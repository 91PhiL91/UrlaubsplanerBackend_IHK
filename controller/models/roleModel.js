const Sequelize = require('sequelize');
const sequelize = require('../dbConnector/sqlite/sqliteConnector');
const User = require('./userModel');


const Role = sequelize.define('Role',{

    roleID: {
        type: Sequelize.STRING,
        primaryKey: true,
        unique: true,
    },

    roleName: {
        type: Sequelize.STRING
    },

},{
tableName: "Role"


});




module.exports = Role;

