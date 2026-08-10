const jwt = require ('jsonwebtoken')
const Usuario = require ('../models/usuarios')
require('dotenv').config()
const SECRET = process.env.SECRET
const bcrypt = require('bcrypt')

exports.login = async(req,res)=> {
    try {
        const {login,senha} = req.body

        if (!login|| typeof login!=='string'|| !login.trim()){
            return res.status(400).json({error:'Login é obrigatório.'})
        }

        if(!senha||typeof senha !=='string'||!senha.trim()){
            return res.status(400).json({error:'Senha é obrigatória.'})
        }

        const usuario = await Usuario.findOne({where:{login}})

        if (!usuario){
            return res.status(401).json({error:'Login ou senha inválidos.'})
        }

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha)

        if(!senhaCorreta){
            return res.status(401).json({error:'Login ou senha inválidos.'})
        }

        const token = jwt.sign(
            {id:usuario.id,login:usuario.login,perfil:usuario.perfil},SECRET,{expiresIn:'1h'}
        )

        return res.status(200).json({token})
    } catch (error) {
        console.error('Erro ao autenticar usuário:',error)
        return res.status(500).json({error:'Erro interno ao autenticar usuário.'})
        
    }
}