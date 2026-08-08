const jwt = require('jsonwebtoken')
require('dotenv').config()
const SECRET = process.env.SECRET

module.exports = (req,res,next) =>{
    const authHeader = req.authHeader.authorization

    if(!authHeader){
        return res.status(401).json({error:'Token não fornecido.'})
    }

    const token = authHeader.split(' ')[1]
    try {
        const decoded = jwt.verify(token, SECRET)
        req.usuario = decoded
        next()
    } catch (error) {
        return res.status(403).json({error:'Token inválido ou expirado.'})
    }
}