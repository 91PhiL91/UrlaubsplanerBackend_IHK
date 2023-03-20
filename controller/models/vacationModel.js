const Sequelize = require('sequelize');
const sequelize = require('../dbConnector/sqlite/sqliteConnector');
const User = require('./userModel');

const Vacation = sequelize.define('Vacation', {
    vacationID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        unique: true,
    },

    isRead: {
        type: Sequelize.INTEGER
    },

    title: {
        type: Sequelize.STRING
    },

    startDate: {
        type: Sequelize.STRING
    },
    endDate: {
        type: Sequelize.STRING
    },


    status: {
        type: Sequelize.STRING
    },
    userID: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            // This is a reference to another model
            model: User,

            // This is the column name of the referenced model
            key: 'userID',
        }
    }
}, {
    tableName: "Vacation"
});
module.exports = Vacation;