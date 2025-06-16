'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Timeslots extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Timeslots.init({
    class_start_time: {
      type: DataTypes.TIME,
      allowNull: false,
  },
  class_end_time: {
      type: DataTypes.TIME,
      allowNull: false,
  },
  classroom: {
      type: DataTypes.STRING(70),
      allowNull: false,
  },
  class_capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
          max: 999,
      },
  },
  status: {  
      type: DataTypes.ENUM('occupied', 'free'),
      defaultValue: 'free',
      allowNull: false,
  }
  }, {
    sequelize,
    modelName: 'Timeslots',
  });
  return Timeslots;
};