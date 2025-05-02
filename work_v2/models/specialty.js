const { DataTypes, Model } = require('sequelize');

class Specialty extends Model {}

module.exports = (sequelize) => {
  Specialty.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Specialty',
    tableName: 'specialties',
    timestamps: false,
  });

  return Specialty;
};
