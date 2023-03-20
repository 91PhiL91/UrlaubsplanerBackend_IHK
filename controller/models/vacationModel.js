const Sequelize = require('sequelize');
const sequelize = require('../dbConnector/sqlite/sqliteConnector');


const Vacation = sequelize.define('Vacation', {
    vacationID: {
        type: Sequelize.STRING,
        primaryKey: true,
        unique: true,
    },

    isRead: {
        type: Sequelize.INTEGER
    },

    titel: {
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
            model: "User",

            // This is the column name of the referenced model
            key: 'userID',
        }
    },
}, {
    tableName: "Vacation"
});


//Vacation.belongsTo(User, {foreignKey: 'userID'});

module.exports = Vacation;