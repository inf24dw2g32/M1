module.exports = (sequelize, DataTypes) => {
    const Specialty = sequelize.define('Specialty', {
      name: DataTypes.STRING
    });
  
    return Specialty;
  };
  