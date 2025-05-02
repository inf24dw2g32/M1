const { DataTypes, Model } = require('sequelize');

class Doctor extends Model {}

module.exports = (sequelize) => {
  Doctor.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    specialty_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Doctor',
    tableName: 'doctors',
    timestamps: false,
  });

  return Doctor;
};
