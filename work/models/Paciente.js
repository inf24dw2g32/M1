const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');


const Paciente = sequelize.define('Paciente', {
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    idade: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = Paciente;