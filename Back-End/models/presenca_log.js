const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PresencaLog = sequelize.define('PresencaLog', {
    entrada: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    saida: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
    },
    duracao: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    produtoId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    intensidadeLed: { 
        type: DataTypes.FLOAT,
        allowNull: true
    },
    distanciaMedia: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    idVitrine: {
        type: DataTypes.INTEGER,
        allowNull: false
    }   
}, { timestamps: false });

module.exports = PresencaLog;