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

    /*--
     // Überprüfen, ob die angegebene teamId in der Team Tabelle vorhanden ist
 
     // if (req.body.teamId) {
     //   const team = await Team.findByPk(req.body.teamID);
     //   if (!team) {
     //     res.status(400).send('Ungültige teamId');
     //     return;
     //   }
     // }
     //console.log(req.body);
     --*/

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
  if(data) {
    await Vacation.destroy({where: {userID : data}});
    await User.destroy({where : {userID : data}});
  }

  res.send("Benutzer wurde gelöscht");

} catch (error) {
  
}

});



/* -------------------------------------------------------------------API/USERTEAM------------------------------------------------------------------------------------*/


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


  
 await Vacation.sync();
  const newVacation = Vacation.build({
    vacationID: uuidv4(),
    status: req.body.status,
    titel: req.body.titel,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    isRead: req.body.isRead,
    userID: req.body.userID

  });

  console.log(newVacation);

  await newVacation.save();
  console.log('Urlaub wurde gepseichert.')
  res.send(newVacation);
  
} catch (error) {
  console.error(error);
  res.send({error});
  
}
});

/*--- GET Vacation---*/

router.get('/api/Vacation', async (req, res)=> {
try {
    
    const vacationAll = await Vacation.findAll();
    console.log(vacationAll);
    res.send(vacationAll);

} catch (error) {
  console.error(error);
  res.send(error);
}
});

/*--- DELETE Vacation--*/
router.delete('/api/Vacation', async (req, res) => {
 try {
  const {userID, vacationID} = req.body;
  if(userID && vacationID) {
    await Vacation.destroy({where: {userID, vacationID}});
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
      status : req.body.status,
      titel : req.body.titel,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      isRead: req.body.isRead
     

    },
      { where: {vacationID : req.body.vacationID } });

    console.log("Role aktualisiert");
    res.status("200").send('OK');
  } catch (error) {
    console.error(error);
    res.send({ error });
  }
});




/* -------------------------------------------------------------------API/TeamVacation------------------------------------------------------------------------------------*/




module.exports = router;