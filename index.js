const express = require('express'); // Importieren des Express-Frameworks
const app = express(); // Erstellen einer Express-App
const User = require('./controller/models/userModel');
const UserRole = require('./controller/models/UserRoleModel');
const sequelize = require('sequelize');




app.get('/api/User', async (req, res) => {
    var users = await User.findAll().then(users => {
      console.log(users);
      res.send({ users });
    }).catch((err) => {
      console.error('Unable to query users:', err);
      res.sendStatus(500);
    });
  });

app.get('/api/UserRole', async (req, res) => {
    var users = await UserRole.findAll();
    console.log(users);
    // .then(users => {
    //   console.log(users);
    //   res.send({ users });
    // }).catch((err) => {
    //   console.error('Unable to query users:', err);
    //   res.sendStatus(500);
    // });
  });








app.listen(3000, () => { // Starten des Servers auf Port 3000
    console.log('Server started on port 3000'); // Ausgabe in der Konsole
  });