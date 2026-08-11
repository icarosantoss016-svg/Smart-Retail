const app = require('./app')
const sequelize = require('./config/database')
const mqttClient = require  ('./config/mqtt')
const sensorController = require('./controller/sensorController')
const usuarioController = require('./controller/usuarioController')

const relacionamentoDb = require('./models/index')

mqttClient.on('message', (topico,buffer)=>{
    const payload =JSON.parse(buffer.toString())
    const partes = topico.split('/')

    if(partes[0] === 'vitrine' && partes.length ===3){
        const idVitrine=parseInt(partes[1])
        const evento= partes[2]

        if(evento === 'presenca'){
            sensorController.detectarPresenca(idVitrine, payload)
        }else if(evento==='nfc'){
            sensorController.detectarNfc(idVitrine,payload)
        }
    }
})

const PORT = process.env.PORT||3000

sequelize.sync()
    .then(()=>{
        console.log('Banco de dados sincronizado.')
        app.listen(PORT,()=>{
            console.log(`Servidor rodando em http://localhost:${PORT}`)
        })
        usuarioController.criarAdminPadrao()
    }).catch((error)=>{
        console.error('Erro ao incializar:', error)
})