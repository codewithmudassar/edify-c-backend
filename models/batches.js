'use strict';
const { Model } = require('sequelize');



module.exports = (sequelize, DataTypes) => {

    class Batches extends Model {
        static associate(models) {
            this.belongsTo(models.Courses, {
                foreignKey: "course_id",
            })
            this.belongsTo(models.Timeslots, {
                foreignKey: "timeslot_id",
            })
        }
    }

    Batches.init({
        start_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        end_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        schedule: {
            type: DataTypes.ENUM("MWF", "TTS"), 
            allowNull: false,
        },
        active_status: {
            type: DataTypes.ENUM("Y", "N"),
            allowNull: false,
            defaultValue: "Y",
        },
    }, {
        sequelize,
        modelName: 'Batches',
    });

    return Batches;
}