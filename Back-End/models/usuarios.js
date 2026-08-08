const {DataTypes} = require ('sequelize')
const sequelize = require ('../config/database')

const Usuarios = sequelize.define('Usuarios',{
    login:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    senha:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    perfil:{
        type:DataTypes.ENUM('ADMIN','USUARIO'),
        allowNull:false
    }

})

module.exports= Usuarios