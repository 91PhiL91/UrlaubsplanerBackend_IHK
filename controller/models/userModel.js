const Sequelize = require('sequelize');
const sequelize = require('../dbConnector/sqlite/sqliteConnector');
const Role = require('./roleModel');


const User = sequelize.define('User', {
  userID: {
    type: Sequelize.STRING,
    primaryKey: true,
    unique: true,
    
  },
  firstName: {
    type: Sequelize.STRING
  },
  lastName: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  },
  
  totalVacation: {
    type: Sequelize.INTEGER
  },
  restVacation: {
    type: Sequelize.STRING
  },
  plannedVacation: {
    type: Sequelize.INTEGER
  },
  takedVacation: {
    type: Sequelize.INTEGER
  },
  
 
  teamID: {
    type: Sequelize.STRING,
   references: {
      model: "Team",
      key: 'teamID'
    }
  }
},{

  tableName: "User",

 
  
});

 

module.exports = User;