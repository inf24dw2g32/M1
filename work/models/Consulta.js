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
});

// Define a relação entre Consulta e Paciente
Consulta.belongsTo(Paciente, { foreignKey: 'pacienteId' });

module.exports = Consulta;
