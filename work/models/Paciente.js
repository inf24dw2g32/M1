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
}, {
    timestamps: true, // Garante que createdAt e updatedAt sejam gerados
    createdAt: 'criado_em', // Personaliza o nome do campo createdAt
    updatedAt: 'atualizado_em' // Personaliza o nome do campo updatedAt
});

module.exports = Paciente;