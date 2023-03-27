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


//Beim Erstellen muss eine gültige Team ID eingegeben werden sonst fehler.
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



/*--- Update User in DB---*/


router.put('/api/User', async (req, res) => {
  try {

    
    //  Überprüfen, ob die angegebene teamId in der Team Tabelle vorhanden ist
 
     if (req.body.teamID) {
       const team = await Team.findByPk(req.body.teamID);
       if (!team) {
         res.status(400).send('Ungültige teamId');
         return;
       }
     }
     console.log(req.body);
     

    //Aktualisiere den User mit den angegebenen Werten
    await User.update({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      //Password in extra Route??
      email: req.body.email,
      totalVacation: req.body.totalVacation,
      restVacation: req.body.restVacation,
      plannedVacation: req.body.plannedVacation,
      takedVacation: req.body.takedVacation,
      teamID: req.body.teamID

    },
      { where: { userID: req.body.userID } });

    console.log("Benutzer aktualisiert");
    res.status("200").send('OK');
  } catch (error) {
    console.error(error);
    res.send({ error });
  }
});


/*---GET User---*/

router.get('/api/User', async (req, res) => {
  try {
    var allUsers = await User.findAll();
    console.log(allUsers);
    res.send({ allUsers });





  } catch (error) {
    console.error(error);
    res.send({ error });
  }

});

/*--- DELETE User--*/
router.delete('/api/User', async (req, res) => {
  try {
    var data = req.body.userID;
    if (data) {
      await Vacation.destroy({ where: { userID: data } });
      await User.destroy({ where: { userID: data } });
    }

    res.send("Benutzer wurde gelöscht");

  } catch (error) {

  }

});



/* -------------------------------------------------------------------API/Team------------------------------------------------------------------------------------*/


/*---Create Team in DB--- */

router.post('/api/Team', async (req, res) => {
  try {
    await Team.sync(); // Synchronisieren Sie das Modell mit der Datenbank

    const newTeam = Team.build({
      teamID: uuidv4(), // Generiert eine neue UUID
      teamLeaderID: req.body.teamLeaderID,
      teamName: req.body.teamName
    });
    console.log(newTeam);
    await newTeam.save(); // Speicherz das neue Team in der Datenban

    console.log('Team wurde gespeichert.');
    res.send(newTeam); // Sendet das gespeicherte Team als Response zurück
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Fehler beim Speichern des Teams.' }); // Sendet eine Fehlermeldung als Response zurück
  }
});

/*--GET TEAM-- */

router.get('/api/Team', async (req, res)=> {
try {

  var allTeams = await Team.findAll();
  console.log(allTeams);
  res.send({allTeams});
  
} catch (error) {
  console.log(error);
  res.send({error});
}



});



/*--- GET Team ---*/
//ursrpünglich /Team 
router.get('/api/UserTeam', async (req, res) => {
  console.log(req.query);
  var teamLeaderID = req.query.teamLeaderID;
  var data = [];

  console.log("Anfrage auf TeamleiterID: " + teamLeaderID);
  
  const TeamObject = await Team.findAll({
    where: { teamLeaderID: teamLeaderID },
  })
  if(TeamObject[0]){
    console.log(TeamObject);

    const userArray = await User.findAll({
      where: { teamID: TeamObject[0].dataValues.teamID },
    });
  
    if (userArray) {
      for (let i = 0; i < userArray.length; i++) {
        const user = userArray[i];
        const userData = user.dataValues;
        delete userData.createdAt;
        delete userData.updatedAt;
        userData.appointments = [];
        const vacation = await Vacation.findAll({
          where: { userID: userData.userID }
        });
  
        if (vacation && vacation.length > 0) {
          vacation.forEach(element => {
            delete element.dataValues.createdAt;
            delete element.dataValues.updatedAt;
            userData.appointments.push(element.dataValues);
          });
        }
  
        delete userData.password;
        data.push(userData);
      }
  
      res.send({ data });
    } else {
      res.status(404).send({ message: "Keine Benutzer gefunden" });
    }
  }else{
    res.status(404).send({ message: "Keine Team zur Teamleiter id gefunden" });
  }
 
});


/*--- Delete Team ---*/

router.delete('/api/Team', async (req, res) => {
  
  Team.findAll({
    where: {
      teamLeiterId: 1 // oder andere ID
    }
  }).then(teams => {
    console.log(teams);
  });

  const { teamLeiterId } = req.body;
  if (!teamLeiterId) {
    return res.status(400).send("Es wurde keine teamLeiterId übergeben.");
  }

  try {
    const affectedRows = await User.update({ teamLeiterId: null }, { where: { teamLeiterId } });
    if (affectedRows > 0) {
      await Team.destroy({ where: { teamLeiterId } });
      res.send(`Team mit teamLeiterId ${teamLeiterId} wurde gelöscht.`);
    } else {
      res.status(404).send(`Es wurde kein Team mit teamLeiterId ${teamLeiterId} gefunden.`);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Ein Fehler ist aufgetreten.");
  }
});



/* -------------------------------------------------------------------API/Role------------------------------------------------------------------------------------*/



/*--- POST Role ---*/
router.post('/api/Role', async (req, res) => {


  try {

    await Role.sync();
    const newRole = Role.build({
      roleID: uuidv4(),
      roleName: req.body.roleName

    });

    await newRole.save();
    console.log('Role wurde gespeichert.');
    res.send(newRole);
  } catch (error) {
    console.error(error);
    res.send({ error }); // noch erweitern wenn nötig
  }
});



/*--- PUT Role---*/
router.put('/api/Role', async (req, res) => {
  try {



    //Aktualisiere den Role mit den angegebenen Werten
    await Role.update({
      roleID: req.body.roleID,
      roleName: req.body.roleName


    },
      { where: { roleID: req.body.roleID } });

    console.log("Role aktualisiert");
    res.status("200").send('OK');
  } catch (error) {
    console.error(error);
    res.send({ error });
  }
});






/* -------------------------------------------------------------------API/UserRole------------------------------------------------------------------------------------*/


/*---Post UserRole ---*/

router.post('/api/UserRole', async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    const newUserRole = UserRole.build({
      userRoleID: uuidv4(),
      userID: req.body.userID,
      roleID: req.body.roleID,

    });

    await newUserRole.save();
    console.log('Mitarbeiter wurde erfogleich eine Rolle zugewiesen.');
    res.status(200).send();
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
});


/*---GET UserRole ---*/

router.get('/api/UserRole', async (req, res) => {
  try {
    const userRoles = await UserRole.findAll({
      include: [
        {
          model: User,
          attributes: ['firstName', 'lastName']
        },
        {
          model: Role,
          attributes: ['roleName']
        }
      ]
    });

    const formattedUserRoles = userRoles.map(userRole => {
      const { userID, roleID, User, Role } = userRole;
      const { firstName, lastName } = User;
      const { roleName } = Role;
      return { firstName, lastName, roleName, userID, roleID };
    });

    console.log(formattedUserRoles);
    res.send({ userRoles: formattedUserRoles });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});


/* -------------------------------------------------------------------API/Vacation------------------------------------------------------------------------------------*/

/*--- POST Vacation---*/

router.post('/api/Vacation', async (req, res) => {
  try {

    	var data = req.body;
      console.log("Hier drunter müssten die Appointments für Vacation.Build übergeben werden!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      console.log(data);

    await Vacation.sync();
    const newVacation = Vacation.build({
      vacationID: uuidv4(),
      status: data['oAppointment[status]'],
      titel: data['oAppointment[titel]'],
      startDate: data['oAppointment[start]'],
      endDate: data['oAppointment[end]'],
      isRead: data['oAppointment[isRead]'],
      userID: data['oAppointment[userID]']

    });

    console.log("Hier drunter müsste der beantrage Urlaub stehen: ")
    console.log(newVacation);

    await newVacation.save();
    console.log('Urlaub wurde gepseichert.')
    res.send(newVacation);

  } catch (error) {
    console.error(error);
    res.send({ error });

  }
});

/*--- GET Vacation---*/
//Muss noch auf ID angepasst werden FE
router.get('/api/Vacation', async (req, res) => {
  try {

    var data = await Vacation.findAll();
    var userData = await User.findAll(where : {userID })
    console.log(data);
    
    res.send({data});

  } catch (error) {
    console.error(error);
    res.send(error);
  }
});

/*--- DELETE Vacation--*/
router.delete('/api/Vacation', async (req, res) => {
  try {
    const { userID, vacationID } = req.body;
    if (userID && vacationID) {
      await Vacation.destroy({ where: { userID, vacationID } });
      res.send("Urlaub wurde gelöscht");
    } else {
      res.send("Bitte geben Sie sowohl userID als auch urlaubsID an!")
    }



  } catch (error) {
    console.error(error);
    res.send("Urlaub wurde nicht gelöscht!");
    res.send(error);
  }

});




/*--- PUT Vacation---*/

router.put('/api/Vacation', async (req, res) => {
  try {



    //Aktualisiere den Role mit den angegebenen Werten
    await Vacation.update({


      vacationID: req.vacationID,
      status: req.body.status,
      titel: req.body.titel,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      isRead: req.body.isRead


    },
      { where: { vacationID: req.body.vacationID } });

    console.log("Role aktualisiert");
    res.status("200").send('OK');
  } catch (error) {
    console.error(error);
    res.send({ error });
  }
});


/* -------------------------------------------------------------------API/USERDETAIL------------------------------------------------------------------------------------*/

//Postman --> http://localhost:3000/api/userDetail?email=XXXXXX&password=XXXXXX

/*---Login Ablgeich---*/
router.get('/api/UserDetail', async (req, res) => {
  try {
    const email = req.query.email;
    const password = req.query.password;
    const user = await User.findOne({ where: { email } });

    if (user) {
      const hashedPassword = user.password;

      const passwordMatch = await comparePassword(password, hashedPassword);

      if (passwordMatch) {
        const token = jwt.sign(
          { user_id: email },
          "secret",
          {
            expiresIn: "900000ms",
          }
        );
        user.token = token;
        res.send({ userID: user.userID, token });
      } else {
        res.status(401).send('Falsches Passwort');
      }
    } else {
      res.status(404).send('Benutzer nicht gefunden');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Ein Fehler ist aufgetreten');
  }
});

async function comparePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}


/* -------------------------------------------------------------------API/TeamVacation------------------------------------------------------------------------------------*/

router.get('/api/TeamVacation',  async (req, res) => {
  var teamLeaderID = req.query.teamLeaderID;
  var userIDArray = [];
  var data = [];
  var userArrayClean = [];

  console.log("Anfrage auf TeamLeiterID: " + teamLeaderID);


  const TeamObject = await Team.findAll({
    where: { teamLeaderID: teamLeaderID },
  })
  console.log()

  if (TeamObject) {
    // JOIN-Abfrage, um alle Benutzer und Urlaube zu finden, die mit der übergebenen "teamLeaderID" verknüpft sind
    const userArray = await User.findAll({
      where: { teamID: TeamObject[0].dataValues.teamID },
     
    });
    console.log("Das müsste die TeamID seiN:" + TeamObject[0].dataValues.teamID);
    console.log(userArray);

    userArray.forEach(user => {
      userIDArray.push(user.dataValues.userID);
      console.log("Das ist das userIDArray: " + userIDArray);
      userArrayClean.push(user.dataValues)
    })
  
    console.log(userArrayClean);
    var vacationArray = await Vacation.findAll({ where: { userID: userIDArray } });
    
    if (vacationArray) {
      vacationArray.forEach(vacation => {
        var oEntry = userArrayClean.find(function (oEntry) {
          return oEntry.userID === vacation.dataValues.userID;
        });
        vacation.dataValues.firstName = oEntry.firstName;
        vacation.dataValues.lastName = oEntry.lastName;
        vacation.dataValues.restVacation = oEntry.restVacation;
        vacation.dataValues.plannedVacation = oEntry.plannedVacation;
        data.push(vacation.dataValues);
      });
   
      res.send(data);
    } else {
      res.send("Fehler beim Laden der Urlaubsdaten");
    }
  } else {
    res.status(404).send({ message: "Keine Team zur Teamleiter id gefunden" });
  }
});

/* -------------------------------------------------------------------API/UserByID------------------------------------------------------------------------------------*/

/*---UserDaten im Dashboard Laden--- */

router.get('/api/UserByID', async (req, res) => {
  try {
    const userID = req.query.userID;
    console.log("Hier drunter sollte die ID stehebn:", userID);
    const user = await User.findByPk(userID);
    if (!userID) {
      res.status(404).send('Benutzer nicht gefunden');
      return;
    }
    user.dataValues.appointments = [];
    var vacationUser = await Vacation.findAll({ where: { userID: userID } });
    if (vacationUser) {

      if (user) {
        vacationUser.forEach(element => {
          delete element.dataValues.createdAt;
          delete element.dataValues.updatedAt;
          user.dataValues.appointments.push(element.dataValues);
        });
        var data = user.dataValues;
        delete data.passwort;

        var userRoleArray = await UserRole.findAll({
          where: { userID: userID }
        })

        const RoleArray = await Role.findAll();

        if(userRoleArray) {
          userRoleArray.forEach(userRole => {
            var role = RoleArray.find(function (oEntry) {
              return oEntry.roleID === userRole.roleID;
            });
            switch (role.roleName) {
              case "Administrator":
                data.isAdmin = true;
                break;
              case "Vorgesetzter":
                data.isSupervisor = true;
                break;
              case "Mitarbeiter":
                data.isEmployee = true;
                break;
              case "Mitarbeiter Personalabteilung":
                data.isHR = true;
                break;
              default:

                break;
                
            }
          });
          console.log("UserData:");
          console.log(user);
        }


        res.send({ data });
      }
    } else {
      res.status(404).send('Benutzer hat keinen Urlaub');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('User existiert nicht');
  }
});

module.exports = router;