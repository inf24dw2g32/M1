const sequelize = require('../config/db'); // Importa a instância do Sequelize configurada
const initUser = require('./user'); // Importa o modelo User

// Certifique-se de inicializar o modelo com a instância do Sequelize, se necessário
const User = initUser(sequelize);

module.exports = {
  sequelize, // Exporta a instância do Sequelize
  User, // Exporta o modelo User
};