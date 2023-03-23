const express = require('express'); // Importieren des Express-Frameworks
const app = express(); // Erstellen einer Express-App
const router = express.Router();
const bodyParser = require('body-parser');
const service = require('./controller/serviceController')
const Sequelize = require('sequelize');
const cors = require('cors');
const corsOptions = {
  origin: 'http://localhost:8080',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use('/', service);




module.exports = router;

app.listen(3000, () => { // Starten des Servers auf Port 3000
  console.log('Server started on port 3000'); // Ausgabe in der Konsole
});