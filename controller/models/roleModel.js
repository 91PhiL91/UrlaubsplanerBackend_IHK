const Sequelize = require('sequelize');
const sequelize = require('../dbConnector/sqlite/sqliteConnector');
const UserRole = require('./userRoleModel');


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
tableName:"Role"

});

// Role.hasMany(UserRole, {  as: 'UserRole', foreignKey: "roleID"});

module.exports = Role;