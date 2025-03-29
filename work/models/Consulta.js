const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Paciente = require('./Paciente');
const Medico = require('./Medico'); 

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
    timestamps: true,
    createdAt: 'criado_em',
    updatedAt: 'atualizado_em',
    freezeTableName: true
});

// 🛠 Adicionando relacionamento com Paciente e Médico
Consulta.belongsTo(Paciente, { foreignKey: 'pacienteId', as: 'paciente' });
Consulta.belongsTo(Medico, { foreignKey: 'medicoId', as: 'medico' }); 

module.exports = Consulta;
