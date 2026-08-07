const {DataTypes} = require ('sequelize')
const sequelize = require ('../config/database')

    const Vitrine = sequelize.define ('Vitrine',{
        idVitrine:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        localizacao:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        statusVitrine:{
            type:DataTypes.ENUM('ATIVA','DESATIVADA','MANUTENÇÃO'),
            allowNull:false,
            defaultValue:'ATIVA'
        }
    })

    module.exports=Vitrine