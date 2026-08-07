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
    }
})

module.exports= Usuarios