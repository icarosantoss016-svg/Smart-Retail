const express = require('express')
const path = require('path')
const cors = require('cors')

const app = express()

app.use(express.json({limit:'50mb'}))
app.use(express.urlencoded({limit:'50mb', extended:true}))
app.use(express.static(path.join(__dirname, 'public')))

app.use(cors())

const colorRoutes = require('./routes/colorRoutes')
const produtosRoutes = require('./routes/produtosRoutes')
const dashboardRoutes = require('./routes/dashboardRoutes')
const usuariosRoutes = require('./routes/usuarioRoutes')
const vitrineRoutes = require('./routes/vitrineRoutes')
const authRoutes = require('./routes/authRoutes')

app.get('/',(req,res)=>{  
    res.send('Smart Retail: Servidor no ar.')
})

app.use('/sensor/color', colorRoutes)
app.use('/produtos', produtosRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/usuario', usuariosRoutes)
app.use('/vitrine', vitrineRoutes)
app.use('/auth', authRoutes)

module.exports = app