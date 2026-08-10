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
    const {hex, idVitrine}
}