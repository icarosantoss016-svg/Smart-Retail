const {DataTypes} = require('sequelize')
const sequelize = require ('../config/database')

const Produtos = sequelize.define('Produtos',{
    produtoId:{
        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement:true
    },
    nome:{
        type: DataTypes.STRING,
        allowNull:false
    },
    categoria:{
        type:DataTypes.STRING,
        allowNull:false
    },
    preco: {
        type:DataTypes.DECIMAL(10,2),
        allowNull:false
    },
    cor:{
        type:DataTypes.STRING,
        allowNull:true
    },
    nfcTag:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    tipoTecido:{
        type:DataTypes.STRING,
        allowNull:false
    },
    imagem:{
        type: DataTypes.TEXT,
        allowNull:false

    }
})

module.exports =  Produtos