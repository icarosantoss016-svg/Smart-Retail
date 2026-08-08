const Produtos = require ('../models/produtos')
const ScanLog = require ('../models/scan_log')
const vitrineEstado = require('../config/vitrineEstado')
const mqttClient = require('../config/mqtt')

exports.criarProduto= async(req,res)=>{
    try {
        const { nome, categoria, preco, nfcTag,tipoTecido, imagem} = req.body

        if (!nome || !categoria || preco === undefined || isNaN(preco) || !nfcTag || !tipoTecido || !imagem) {
            return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos.' });
        }

        const novoProduto = await Produtos.create({
            nome,categoria, preco, cor,nfcTag,tipoTecido, imagem
        })

        return res.status(201).json(novoProduto)

    } catch (error) {
        if(error.name ==='SequelizeUniqueConstraintError'){
            return res.status(409).json({error:'A tag NFC informada já esta cadastrada.'})
        }
        console.error('Erro ao criar produto:', error)
        return res.status(500).json({error:'Erro interno ao criar produto.'})
        
    }
}

exports.buscarProdutoId = async(req,res)=>{
    try {
        const produto =await Produtos.findByPk(req.params.id)

        if(!produto){
            return res.status(404).json({error: 'Produto não encotrado.'})
        }

        const idVitrine = parseInt(req.query.vitrine)||1

        const produtoIdAtivo = vitrineEstado.obterProdutoAtivo(idVitrine)

        if(produtoIdAtivo !== produto.produtoId){
            await ScanLog.create({produtoId: produto.produtoId})
            console.log(`[Vitrine #${idVitrine}] Novo produto escaneado. Log registrado.`)
        }else{
            console.log(`[Vitrine #${idVitrine} Busca repetida ignorada para o log.]`)
        }

        vitrineEstado.definirProdutoAtivo(idVitrine, produto.produtoId)

        if(produto.cor && mqttClient.connect){
            const payloadCor = JSON.stringify({hex: produto.cor})
            mqttClient.publish(`vitrine/${idVitrine}/cor`, payloadCor)
            console.log(`[MQTT] Cor ${idVitrine} enviada para vitrine/${idVitrine}/cor`)
        }
        return res.status(200).json(produto)
    } catch (error) {
        console.error("Erro ao buscar produto por ID:", error);
        return res.status(500).json({ error: "Erro interno ao buscar produto." })
    }
}

exports.listarProdutos = async(req, res)=>{
    try {
        const produtos = await Produtos.findAll()
        return res.status(200).json(produtos)
    } catch (error) {
        console.error('Erro ao listar produtos:', error)
        return res.status(500).json({error: 'Erro interno ao buscar produtos.'})
        
    }
}

exports.deletarProduto = async( req,res) =>{
    try {
        const linhasDeletadas = await Produtos.destroy({where:{produtoId:req.params.id}})

        if(linhasDeletadas===0){
            return res.status(404).json({error:'Produto não encotrado.'})
        }
        return res.status(200).json({mensagem:'Produto deletado com sucesso.'})
    } catch (error) {
        console.error("Erro ao deletar produto", error)
        return res.status(500).json({ erro: "Erro ao deletar o produto." })
    }
}

exports.atualizarProduto = async (req, res) =>{
    try {
        const id = req.params.id

        const {nome, categoria, preco, cor, nfcTag, tipoTecido, imagem} = req.body

        const dadosAtualizados ={}
        if (nome !== undefined) dadosAtualizados.nome = nome
        if (categoria !== undefined) dadosAtualizados.categoria = categoria
        if (preco !== undefined) dadosAtualizados.preco = preco
        if (cor !== undefined) dadosAtualizados.cor = cor
        if (nfcTag !== undefined) dadosAtualizados.nfcTag = nfcTag
        if (tipoTecido !== undefined) dadosAtualizados.tipoTecido = tipoTecido
        if (imagem !== undefined) dadosAtualizados.imagem = imagem

        if (Object.keys(dadosAtualizados).length===0){
            return res.status(400).json({error:'Nenhum dado válido fornecido para atualização.'})
        }

        const [linhasAfetadas] = await Produtos.update(dadosAtualizados,{
            where:{produtoId:id}
        })

        if (linhasAfetadas === 0){
            return res.status(404).json({error:'Produto não encontrado.'})
        }

        return res.status(200).json({mensagem:'Produto atualizado com sucesso.'})
    } catch (error) {
       if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ error: 'A tag NFC informada já está em uso por outro produto.' })
       }

        console.error("Erro ao atualizar produto:", error);
        return res.status(500).json({ error: "Erro interno ao atualizar o produto." })
        
    }
}