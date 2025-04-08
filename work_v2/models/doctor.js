module.exports = (sequelize, DataTypes) => {
    const Doctor = sequelize.define('Doctor', {
      name: DataTypes.STRING
    });
  
    return Doctor;
  };
  