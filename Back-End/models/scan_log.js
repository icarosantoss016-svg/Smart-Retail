const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ScanLog = sequelize.define('ScanLog', {
    produtoId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    scanData: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, { timestamps: false });

module.exports = ScanLog;