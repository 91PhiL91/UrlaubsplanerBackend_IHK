const Sequelize = require('sequelize');
const sequelize = require('../dbConnector/sqlite/sqliteConnector');
const User = require('./userModel');
const Role = require('./roleModel');




const UserRole = sequelize.define('UserRole',{
     
    UserRoleID: {
        type: Sequelize.STRING,
        primaryKey: true,
        unique: true,
    },



   
    userID: {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
            // This is a reference to another model
            model: "User",

            // This is the column name of the referenced model
            key: 'userID',
        }

    },
    roleID: {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
            // This is a reference to another model
            model: "Role",

            // This is the column name of the referenced model
            key: "roleID",
        }
    
    }
},{
        tableName:"UserRole"
    }     
);


module.exports= UserRole;