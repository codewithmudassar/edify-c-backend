"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    static associate(models) {
      this.belongsTo(models.Department, {
        foreignKey: "department_id",
      });
    }
  }

  Employee.init(
    {
      employeeName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
        comment: "Full name of the employee",
      },
      userName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
        comment: "Unique username for login",
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
        comment: "Hashed password for authentication",
      },
      department: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
        comment: "Department of the employee",
      },
      joiningDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          isDate: true,
        },
        comment: "Date when the employee joined",
      },
      dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          isDate: true,
        },
        comment: "Employee's date of birth",
      },
      cnic: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
        comment: "Employee's CNIC number",
      },
      whatsappContact: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
        comment: "WhatsApp contact number",
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
        comment: "Official email address",
      },
      jobDescription: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
        comment: "Short job description",
      },
      checkIn: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "Employee check-in time",
      },
      checkOut: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "Employee check-out time",
      },
      isSalaryPerson: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: "Defines if the employee is salaried",
      },
      employeeStatus: {
        type: DataTypes.ENUM("Pending", "Approved", "Rejected"),
        allowNull: false,
        defaultValue: "Pending",
        comment: "Current approval status",
      },
      accessRights: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
        comment: "Permissions granted to the employee",
      },
      applicationStatus: {
        type: DataTypes.ENUM("Pending", "Accepted", "Declined"),
        allowNull: false,
        defaultValue: "Pending",
        comment: "Employee's application process status",
      },
      adminResponseDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: "Date when admin responded",
      },
    },
    {
      sequelize,
      modelName: "Employee",
      comment: "Table to store employee information",
    }
  );

  return Employee;
};
