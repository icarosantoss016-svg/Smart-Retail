const mqtt = require('mqtt')
require ('dotenv').config()


const brokerUrl = process.env.MQTT_BROKER ||'mqtt://broker.hivemq.com:1883'
const client = mqtt.connect(brokerUrl)

client.on ('connect', ()=>{
    console.log('[MQTT] Conectado ao broker.')
    client.subscribe('vitrine/+/presenca', {qos: 1})
    client.subscribe('vitrine/+/nfc',{qos:1})
    
})

client.on('error',(error)=>{
    console.error('[MQTT] Erro de conexão:', error.message)
})

client.on('offline', ()=>{
    console.warn('[MQTT] Cliente desconectado. Tentatdo reconectar...')
})

module.exports=client