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
}, {
    timestamps: true, // Garante que createdAt e updatedAt sejam gerados
    createdAt: 'criado_em', // Personaliza o nome do campo createdAt
    updatedAt: 'atualizado_em' // Personaliza o nome do campo updatedAt
});

module.exports = Medico;