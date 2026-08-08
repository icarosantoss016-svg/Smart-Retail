const Produtos = require('../models/produtos')
const ScanLog = require ('../models/scan_log')
const PresencaLog = require('../models/presenca_log')

exports.obterDadosDashboard = async (req,res) =>{
    try {
        const produtos = await Produtos.findAll()
        const mapaProdutos ={}
        produtos.forEach(p=>{
            mapaProdutos[p.produtoId] = p.nome
        })

        const presencas = await PresencaLog.findAll({order:[['id','DESC']]})

        let tempoTotalMs=0
        const historicoFormatado = presencas.map(log=>{
            if(log.duracao) {
                tempoTotalMs+= parseInt(log.duracao)

                return{
                    id:log.id,
                    produtoNome:mapaProdutos[log.produtoId]||'Semp Produto.',
                    duracao:log.duracao ? `${(log.duracao/1000).toFixed('')}s` : '0s',
                    entrada:log.entrada
                }
            }

            
        })

        const scans = await ScanLog.findAll()
        const contagemScans  = {}

        scans.forEach(scan=>{
            if(scan.produtoId){
                contagemScans[scan.produtoId] = (contagemScans [scan.produtoId] || 0) +1
            }
        })

        const ranking = Object.keys(contagemScans).map(id=>{
            return{
                produtoNome: mapaProdutos[id],
                quantidade: contagemScans[id]
            }
        }).sort((a,b)=> b.quantidade-a.quantidade)

        let tempoMedioMs = 0
        if(presencas.length>0){
            tempoMedioMs= tempoTotalMs/presencas.length
        }

        const minutosMedios = Math.floor(tempoMedioMs/60000)
        const segundosMedios = ((tempoMedioMs %60000)/1000).toFixed(0)

        const tempoMedioFormatado = `${minutosMedios}m ${segundosMedios}s`

        return res.status(200).json({
            historico:historicoFormatado,
            raking:ranking,
            tempoMedioAtivacao: tempoMedioFormatado,
            totalScans: scans.length

        })

    } catch (error) {
        console.error('Erro ao gerar Dashboard:',error)
        return res.status(500).json({erro:'Erro ao carregar dados do dashboard.'})
    }
}