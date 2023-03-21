const express = require('express'); // Importieren des Express-Frameworks
const app = express(); // Erstellen einer Express-App
const router = express.Router();
const bodyParser = require('body-parser');
const service = require('./controller/serviceController')
const Sequelize = require('sequelize');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use('/', service);




module.exports = router; 

app.listen(3005, () => { // Starten des Servers auf Port 3000
    console.log('Server started on port 3000'); // Ausgabe in der Konsole
  });