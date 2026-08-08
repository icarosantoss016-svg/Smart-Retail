const express = require ('express')
const router = express.Router()
const colorController = require('../controller/colorController')

router.post('/', colorController.receberCorComplementar)
router.post('/camera', colorController.receberCorCamera)


module.exports = router