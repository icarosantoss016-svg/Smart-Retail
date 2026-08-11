const mqttClient = require('../config/mqtt')
const vitrineEstado = require('../config/vitrineEstado')

const hexRegex = /^#[0-9A-Fa-f]{6}$/

exports.receberCorComplementar = (req,res) => {
    const {hex} = req.body

    if(!hex||typeof hex !== 'string'|| !hex.trim()){
        return res.status(400).json({error: 'Campo hex é obrigatório.'})
    }

    if(!hexRegex.test(hex.trim())){
        return res.status(400).json({error:'Formato inválido. Use o padrão #RRGGBB.'})
    }
    
    const r = parseInt(hex.slice(1,3), 16)
    const g = parseInt(hex.slice(3,5), 16)
    const b = parseInt(hex.slice(5,7), 16)

    const compR = (255 - r).toString(16).padStart(2, '0');
    const compG = (255 - g).toString(16).padStart(2, '0');
    const compB = (255 - b).toString(16).padStart(2, '0');

    const complementar = `#${compR}${compG}${compB}`

    return res.status(200).json({ complementar })
}


exports.receberCorCamera = (req,res)=>{
    const {hex, idVitrine} = req.body
    const vitrineId = idVitrine ||1

    if(!hex|| typeof hex !=='string'|| !hex.trim()){
        return res.status(400).json({error:' Campo hex é obrigatório.'})
    }

    vitrineEstado.definirCorCamera(vitrineId,hex.trim())

    if(vitrineEstado.obterProdutoAtivo(vitrineId)!==null){
        return res.status(200).json({ignorado:true,
            motivo:'Produto ativo na vitrine. Cor da câmera atualizada no servidor, mas ignorada para o LED.'
        })

        const topicoDinamico = `vitrine/${vitrineId}/cor`
        const payloadCor =JSON.stringify({hex: hex.trim()})

        if (mqttClient.connected){
            mqttClient.publish(topicoDinamico,payloadCor)
            console.log(`[Câmera] Cor (${hex}) enviada para o LED no tópico: ${topicoDinamico}`)
            
        } else{
            console.warn(`[Aviso] MQTT desconectado. Não foi possível publicar a cor ${hex}.`)
        }
    }
    return res.status(200).json({ sucesso: true, cor: hex.trim() })
}