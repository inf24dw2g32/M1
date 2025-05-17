const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
});

const User = require('./user')(sequelize);
const Specialty = require('./specialty')(sequelize);
const Doctor = require('./doctor')(sequelize);
const Appointment = require('./appointment')(sequelize);

// Relacionamentos
// >>> CORRIGIDO: Adicionado aliases 'as' para corresponder às rotas <<<

// Um Doutor pertence a UMA Especialidade
Doctor.belongsTo(Specialty, { as: 'specialty', foreignKey: 'specialty_id' }); // Adicionado as: 'specialty'

// Um Agendamento pertence a UM Utilizador (Paciente)
Appointment.belongsTo(User, { as: 'paciente', foreignKey: 'user_id' }); // Adicionado as: 'paciente'

// Um Agendamento pertence a UM Doutor
Appointment.belongsTo(Doctor, { as: 'medico', foreignKey: 'doctor_id' }); // Adicionado as: 'medico'

Specialty.hasMany(Doctor, { as: 'doctors', foreignKey: 'specialty_id' }); // Adicionado as: 'doctors'

// Um Utilizador (Paciente) tem Muitos Agendamentos
User.hasMany(Appointment, { as: 'appointments', foreignKey: 'user_id' }); // Adicionado as: 'appointments'

// Um Doutor tem Muitos Agendamentos
Doctor.hasMany(Appointment, { as: 'appointments', foreignKey: 'doctor_id' }); // Adicionado as: 'appointments'

// Um Doutor pode ter muitos Pacientes (associação N:M)
Doctor.hasMany(User, { as: 'user', foreignKey: 'doctor_id' }); 


module.exports = {
 sequelize,
 User,
 Specialty,
 Doctor,
 Appointment,
};