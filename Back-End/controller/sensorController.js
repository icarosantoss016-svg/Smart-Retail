const PresencaLog = require("../models/presenca_log")
const ScanLog = require("../models/scan_log")
const Produtos = require("../models/produtos")
const vitrineEstado = require("../config/vitrineEstado")
const mqttClient = require("../config/mqtt")

exports.detectarPresenca = async (idVitrine,payload) =>{
  const { duracaoMs,distanciaMedia, intesidadeLed} = payload

  if(!duracaoMs){
    console.log(`[Vitrine #${idVitrine}] Presença inválida ou vazia ignorada.`)
    return
  }

  try {
    const produtoIdInteragido = vitrineEstado.obterProdutoAtivo(idVitrine)

    await PresencaLog.create({
      entrada:new Date(Date.now()- duracaoMs),
      saida: new Date(),
      duracao:duracaoMs,
      produtoId:produtoIdInteragido,
      intesidadeLed:intesidadeLed
    })

    console.log(`[Vitrine #${idVitrine}] Presença registrada. Duração: ${duracaoMs/1000}s | Distancia Média: ${distanciaMedia}cm | LED: ${intesidadeLed}%`)

    vitrineEstado.limpar(idVitrine)
  } catch (error) {
    console.error(`Erro ao registrar presença da Vitrine ${idVitrine}:`, error.message)
  }
}

exports.detectarNfc = async (idVitrine, payload) =>{
  const {nfcTag} = payload

  if(!nfcTag){
    console.log(`[Vitrine #${idVitrine}] Payload NFC inválido recebido.`)
    return
  }

  try {
    const produto = await Produtos.findOne({where:{nfcTag}})

    if(!produto){
      console.log(`[Vitrine #${idVitrine}] Tag ${nfcTag} não encontrada. Produto não localizado.`)
      return
    }

    const produtoIdAtivo = vitrineEstado.obterProdutoAtivo(idVitrine)

    if(produtoIdAtivo!== produto.produtoId){
      await ScanLog.create({produtoId:produto.produtoId})
      console.log(`[Vitrine ${idVitrine}] Produto escaneado: ${produto.nome}`)
    }else{
      console.log(`[Vitrine ${idVitrine}] Produto ${produto.nome} já está ativo. Scan duplicado ignorado.`)
    }

    vitrineEstado.definirProdutoAtivo(idVitrine, produto.produtoId)

    if(produto.cor && mqttClient.connect){
      const payloadCor = JSON.stringify({hex: produto.cor})
      mqttClient.publish(`vitrine/${idVitrine}/cor`, payloadCor)
      console.log(`[MQTT] Cor ${produto.cor} enviada para a vitrine #${idVitrine}.`)
    }
  } catch (error) {
    console.error(`Erro ao processar NFC da vitrine ${idVitrine}:`,error.message)    
  }
}