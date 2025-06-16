"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Department extends Model {
    static associate(models) {
      this.hasMany(models.Employee, {
        foreignKey: "department_id",
      });
    }
  }

  Department.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: "Department name",
      },
    },
    {
      sequelize,
      modelName: "Department",
      comment: "Stores department details",
    }
  );

  return Department;
};
