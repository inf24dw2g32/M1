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
Doctor.belongsTo(Specialty, { foreignKey: 'specialty_id' });
Appointment.belongsTo(User, { foreignKey: 'user_id' });
Appointment.belongsTo(Doctor, { foreignKey: 'doctor_id' });

module.exports = {
  sequelize,
  User,
  Specialty,
  Doctor,
  Appointment,
};
