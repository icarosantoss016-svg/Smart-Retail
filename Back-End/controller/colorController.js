const mqttClient = require('../config/mqtt')
const vitrineEstado = require('../config/vitrineEstado')
const Vitrine = require ('../models/vitrine')

function receberCorComplementar(req,res){
    const {hex} = req.body

    if(!hex){
        return res.status(400).json({error:'Campo hex é obrigatório.'})
    }

    const r = parseInt(hex.slice(1,3),16)
    const g = parseInt(hex.slice(3,5), 16)
    const b = parseInt(hex.slice(5,7),16)


    const compR = (255 - r).toString(16).padStart(2, '0')
    const compG = (255 - g).toString(16).padStart(2, '0')
    const compB = (255 - b).toString(16).padStart(2, '0')

    const complementar = `#${compR}${compG}${compB}`

    return res.json({ complementar })
}


function receberCorCamera(req,res){
    const hex = req.body
    const vitrineId = req.body.idVitrine || 1

    if (!hex){
        return res.status(400).json({error:'Campo hex é obrigatório.'})
    }

    vitrineEstado.definirCorCamera(vitrineId,hex)

    if(vitrineEstado.obterProdutoAtivo(vitrineId) !==null){
        return res.status(200).json({
            ignorado:true,
            motivo: 'Produto ativo. Cor atualizada.'
        })
    }

    const topicoDinamico = `vitrine/${vitrineId}/cor`
    const payloadCor = JSON.stringify({hex:hex})

    mqttClient.publish(topicoDinamico,payloadCor)
    console.log(`[Câmera] Cor (${hex}) enviada para o LED no tópico: ${topicoDinamico}`)

    return res.status(200.json({sucesso:true, cor:hex}))
}