const { Sequelize } = require('sequelize');
require('dotenv').config(); // Carrega as variáveis do .env

const sequelize = new Sequelize(
  process.env.DB_NAME || 'Scheduler',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || '12345678',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
  }
);

module.exports = sequelize;

