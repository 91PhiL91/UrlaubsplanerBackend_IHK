const Sequelize = require('sequelize');
const sequelize = require('../dbConnector/sqlite/sqliteConnector');



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
      model: 'Team',
      key: 'teamID'
    }
  }
},{
  tableName: "User"
});

//User.hasMany(UserRole, { foreignKey: 'userID'});

module.exports = User;