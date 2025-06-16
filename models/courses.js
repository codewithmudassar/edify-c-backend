'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Courses extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Courses.init({
    course_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
  },
  course_fee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
  },
  duration_months: {
      type: DataTypes.INTEGER,
      allowNull: false,
  },
  duration_weeks: {
      type: DataTypes.INTEGER,
      allowNull: false,
  },
  duration_days: {
      type: DataTypes.INTEGER,
      allowNull: false,
  },
  status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active",
  },
  modules: {
      type: DataTypes.JSON, 
      allowNull: true,
  }
  }, {
    sequelize,
    modelName: 'Courses',
  });
  
  return Courses;
};