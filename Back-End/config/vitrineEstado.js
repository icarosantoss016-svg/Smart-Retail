const estadoPorVitrine = {}

function inicializarEstado(idVitrine){
    if(!estadoPorVitrine[idVitrine]){
        estadoPorVitrine[idVitrine] ={
            produtoId:null,
            timestampDoScan:null,
            corCamera:'#000000'
        }
    }
}

module.exports ={
    definirCorCamera(idVitrine,corHex){
        inicializarEstado(idVitrine)
        estadoPorVitrine[idVitrine].corCamera =corHex
    },

    definirProdutoAtivo(idVitrine,produtoId){
        inicializarEstado(idVitrine)
        estadoPorVitrine[idVitrine].produtoId = produtoId
        estadoPorVitrine[idVitrine].timestampDoScan = Date.now()
        console.log(`[ESTADO] Vitrine#${idVitrine}: Produto #${produtoId} ativo.`)
        
    },

    obterEstadoCompleto(idVitrine){
        const estado = estadoPorVitrine[idVitrine]
        if(!estado){
            return {
                produtoId:null,
                corCamera:'#dee8e9'
            }
        }

        const tempoMaximo = 100*1000
        if(estado.produtoId && (Date.now()-estado.timestampDoScan>tempoMaximo)){
            console.log(`[ESTADO] Scan da vitrine #${idVitrine} expirou.`)
            estado.produtoId=null
        }
        
        return{
            produtoId:estado.produtoId,
            corCamera:estado.corCamera
        }
    },

    obterProdutoAtivo(idVitrine){
        return this.obterEstadoCompleto(idVitrine).produtoId
    },
    limpar(idVitrine){
        delete estadoPorVitrine[idVitrine]
        console.log(`[ESTADO DA VITRINE] Memória limpa para a Vitrine #${idVitrine}.`)
    }
}