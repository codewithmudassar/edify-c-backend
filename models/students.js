'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Students extends Model {
        static associate(models) {
            this.belongsTo(models.Batches, {
                foreignKey: "batch_id",
            });
        }
    }

    Students.init({
        fullname: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: "Full name of the student",
        },
        father_name: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: "Father's name of the student",
        },
        dob: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            validate: {
                isDate: true, // Ensure the value is a valid date
            },
            comment: "Date of birth of the student",
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
            indexes: [{ unique: true }], // Add an index for faster lookups
            comment: "Email address of the student",
        },
        contact_no: {
            type: DataTypes.STRING,
            allowNull: false,
            indexes: [{ unique: true }], // Add an index for faster lookups
            comment: "Contact number of the student",
        },
        gender: {
            type: DataTypes.ENUM("Male", "Female", "Other"),
            allowNull: false,
            comment: "Gender of the student",
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: "Address of the student",
        },
        active_status: {
            type: DataTypes.ENUM("Y", "N"),
            allowNull: false,
            defaultValue: "Y",
            comment: "Active status of the student (Y/N)",
        },
        discount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: "Discount percentage applied to the total fee",
        },
        total_fee: {
            type: DataTypes.DECIMAL(10, 2), // Use DECIMAL for monetary values
            allowNull: false,
            comment: "Total fee after applying discount",
        },
        installments: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: [],
                    
            comment: "Array of installment objects containing fee and date",
        },
    }, {
        sequelize,
        modelName: 'Students',
        comment: "Table to store student information",
    });

    return Students;
};