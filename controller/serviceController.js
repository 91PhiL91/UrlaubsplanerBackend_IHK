const express = require('express');
const router = express.Router();
var jwt = require('jsonwebtoken');
const User = require('./models/userModel');
const Team = require('./models/teamModel');
const Vacation = require('./models/vacationModel');
const Role = require('./models/roleModel');
const UserRole = require('./models/userRoleModel');
const authHelper = require("../helper/authHelper");
const { v4: uuidv4 } = require('uuid');
const { hashPassword } = require('../helper/hashHelper');
const bcrypt = require('bcrypt');



/* -------------------------------------------------------------------API/User------------------------------------------------------------------------------------*/




/*---CreateNew User in DB--- */
router.post('/api/User', async (req, res) => {
  try {
    const hashedPassword = await hashPassword(req.body.password);

    console.log("Das ist das gehaste Passwort : ", hashedPassword);


    await User.sync();
    const newUser = User.build({
      userID: uuidv4(),
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: hashedPassword,
      email: req.body.email,
      totalVacation: req.body.totalVacation,
      restVacation: req.body.restVacation,
      plannedVacation: req.body.plannedVacation,
      takedVacation: req.body.takedVacation,
      teamID: req.body.teamID
    });

    console.log("Hash Password nach user hinzufügen ", hashedPassword);

    await newUser.save();
    console.log('User wurde gespeichert.');
    res.send(newUser);
  } catch (error) {
    console.error(error);
    res.send({ error }); // noch erweitern wenn nötig
  }
});













module.exports = router;