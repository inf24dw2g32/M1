const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Paciente = sequelize.define('Paciente', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,   // Define que o campo id será a chave primária
        autoIncrement: true // Faz com que o campo seja auto-incrementado
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    idade: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true, // O campo de email pode ser nulo se não for obrigatório
            },
    telefone: {
        type: DataTypes.STRING,
        allowNull: true // O campo de telefone pode ser nulo
    }
}, {
    timestamps: true, // Garante que createdAt e updatedAt sejam gerados automaticamente
    createdAt: 'criado_em', // Personaliza o nome do campo createdAt
    updatedAt: 'atualizado_em' // Personaliza o nome do campo updatedAt
});

module.exports = Paciente;
