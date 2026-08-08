const express = require ('express')
const router =express.Router()
const produtoController = require('../controller/produtoController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/', authMiddleware,produtoController.criarProduto)
router.get('/', authMiddleware,produtoController.listarProdutos)
router.get('/:id', produtoController.buscarProdutoId)
router.put('/:id',authMiddleware,produtoController.atualizarProduto)
router.delete('/:id',authMiddleware, produtoController.deletarProduto)

module.exports = router