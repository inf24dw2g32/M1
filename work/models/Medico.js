const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Medico = sequelize.define('Medico', {
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    especialidade: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Medico;