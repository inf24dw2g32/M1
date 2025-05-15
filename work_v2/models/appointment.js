// models/appointment.js

const { DataTypes, Model } = require('sequelize');

class Appointment extends Model {}

module.exports = (sequelize) => {
 Appointment.init({
 id: {
 type: DataTypes.INTEGER,
 autoIncrement: true,
 primaryKey: true,
 },
 date: {
 type: DataTypes.DATEONLY,
 allowNull: false,
 },
 time: {
 type: DataTypes.TIME,
 allowNull: false,
 },
 notes: {
 type: DataTypes.TEXT,
 allowNull: true,
 },
 // As chaves estrangeiras user_id e doctor_id já estão aqui,
 // mas as associações precisam de ser definidas abaixo.
 user_id: {
 type: DataTypes.INTEGER,
 allowNull: false,
 },
 doctor_id: {
 type: DataTypes.INTEGER,
 allowNull: false,
 },
    // Note: A coluna specialty_id aqui é inesperada com base no schema original (era na tabela doctors).
    // Se ela existe na BD e é necessária, mantenha. Se não, remova.
    // Para as relações discutidas (Appointments -> Doctors -> Specialties), specialty_id na tabela appointments
    // não é estritamente necessário para os includes que está a fazer.
 specialty_id: { // <-- Verifique se esta coluna realmente existe na sua tabela 'appointments'
 type: DataTypes.INTEGER,
 allowNull: false, // Verifique a permissão de NULL na DB
 },
}, {
 sequelize,
 modelName: 'Appointment',
 tableName: 'appointments',
 timestamps: false, // Se não usar createdAt e updatedAt
 });

  // >>> ADICIONAR ESTA SECÇÃO <<<
  // Definir associações para este modelo
  Appointment.associate = (models) => {
    // Um Agendamento pertence a UM Utilizador (Paciente)
    Appointment.belongsTo(models.User, {
      as: 'paciente', // Alias para aceder ao utilizador a partir do agendamento
      foreignKey: 'user_id' // Coluna na tabela 'appointments' que aponta para 'users'
    });

    // Um Agendamento pertence a UM Doutor
    Appointment.belongsTo(models.Doctor, {
      as: 'medico', // Alias para aceder ao doutor a partir do agendamento
      foreignKey: 'doctor_id' // Coluna na tabela 'appointments' que aponta para 'doctors'
    });

    // Nota: Não define Appointment.belongsTo(models.Specialty) diretamente aqui
    // porque a especialidade é acedida através do Doctor.
    // A associação Doctor -> Specialty é definida no modelo Doctor.
  };
  // >>> FIM DA SECÇÃO A ADICIONAR <<<


 return Appointment; // Retorna o modelo definido
};