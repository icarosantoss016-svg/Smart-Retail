const express =require ('express')
const router = express.Router()
const usuarioController = require('../controller/usuarioController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/',authMiddleware, usuarioController.criarUsuario)
router.get('/', authMiddleware,usuarioController.listarUsuarios)
router.get('/:id',authMiddleware,usuarioController.buscarUsuarioId)
router.put('/:id', authMiddleware, usuarioController.atualizarSenha)
router.delete('/:id', authMiddleware,usuarioController.deletarUsuario)

module.exports = router