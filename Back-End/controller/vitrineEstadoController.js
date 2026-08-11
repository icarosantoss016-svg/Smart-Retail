const vitrineEstado=require('../config/vitrineEstado')

exports.obterEstadoVitrine = (req,res) =>{
    try {
        const idVitrine = req.params.id
        const estado = vitrineEstado.obterEstadoCompleto(idVitrine)

        if(!estado){
            return res.status(404).json({error:'Vitrine não encontrada ou inativa.'})
        }

        return res.status(200).json(estado)
    } catch (error) {
        console.error('Erro ao obter estado da vitrine:',error)
        return res.status(500).json({error:'Erro interno do servidor ao obter o estado.'})
    }
}