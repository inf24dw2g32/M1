module.exports = (sequelize, DataTypes) => {
    const Appointment = sequelize.define('Appointment', {
      date: DataTypes.DATEONLY,
      time: DataTypes.TIME,
      notes: DataTypes.TEXT
    });
  
    return Appointment;
  };
  