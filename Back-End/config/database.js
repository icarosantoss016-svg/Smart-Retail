const { Sequelize } = require ('sequelize')
require ('dotenv').config()

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_STORAGE||'./database.sqlite',
    logging: false
})

sequelize.authenticate()
    .then(()=> console.log('[DB] Conectado ao SQLite com sucesso.'))
    .catch(error => console.error('[DB] Falha ao conectar no banco:', error))

module.exports = sequelize