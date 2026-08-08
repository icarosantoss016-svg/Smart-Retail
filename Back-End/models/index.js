const Produtos = require('../models/produtos')
const PresencaLog = require('../models/presenca_log')
const ScanLog = require('../models/scan_log')
const Usuarios = require('../models/usuarios')
const Vitrine = require('../models/vitrine')

Produtos.hasMany(ScanLog, {foreignKey: 'produtoId', onDelete: 'CASCADE'})
ScanLog.belongsTo(Produtos, {foreignKey: 'produtoId'})
Produtos.hasMany(PresencaLog, {foreignKey: 'produtoId', onDelete: 'SET NULL'})
PresencaLog.belongsTo(Produtos, {foreignKey: 'produtoId'})
Vitrine.hasMany(PresencaLog, {foreignKey:'idVitrine', onDelete:'CASCADE'})
PresencaLog.belongsTo(Vitrine,{foreignKey:'idVitrine'})

module.exports = { Produtos, PresencaLog, ScanLog, Usuarios, Vitrine }