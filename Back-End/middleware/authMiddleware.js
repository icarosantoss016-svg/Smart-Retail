const jwt = require ('jsonwebtoken')
require (dotenv).config()
const SECRET = process.env.SECRET

module.exports = (req,res,next) =>{
    const authHeader = req.headers.authorization

    if (!authHeader){
        return res.status(401).json({error: 'Token não fornecido.'})
    }

    const partes = authHeader.split(' ')

    if(partes.length !==2){
        return res.status(401).json({error:'Erro de formatação do token.'})
    }

    const [tipo, token] = partes

    if(!/^Bearer$/i.test(tipo)){
        return res.status(401).json({error: 'Token mal formatado.'})
    }

    try {
        const tokenDecodificado = jwt.verify(token, SECRET)
        req.usuario = tokenDecodificado 

        return next()
    } catch (error) {
        if(error.name === 'TokenExpiredError'){
            return res.status(401).json({error:'Token expirado. Faça login Novamente.'})
        }
        return res.status(401).json({error: 'Token inválido.'})
    }

}