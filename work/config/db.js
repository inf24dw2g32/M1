require('dotenv').config();
const { Sequelize } = require('sequelize');

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

