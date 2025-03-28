const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Paciente = require('./Paciente'); // Importa o modelo Paciente

const Consulta = sequelize.define('Consulta', {
    data: {
        type: DataTypes.DATE,
        allowNull: false
    },
    descricao: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true, // Garante que createdAt e updatedAt sejam gerados
    createdAt: 'criado_em', // Personaliza o nome do campo createdAt
    updatedAt: 'atualizado_em' // Personaliza o nome do campo updatedAt
});

// Define a relação entre Consulta e Paciente
Consulta.belongsTo(Paciente, { foreignKey: 'pacienteId', as: 'paciente' });

module.exports = Consulta;
