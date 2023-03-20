const Sequelize = require('sequelize');
const sequelize = require('../dbConnector/sqlite/sqliteConnector');


const Team = sequelize.define('Team', {
    teamID: {
      type: Sequelize.STRING,
      primaryKey: true,
      unique: true,
      
    },
    teamLeaderID: {
      type: Sequelize.STRING
    },
    teamName: {
      type: Sequelize.STRING
    }
  },{
    tableName: "Team"
  });
  
  module.exports = Team;