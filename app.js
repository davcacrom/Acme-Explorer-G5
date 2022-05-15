/* eslint-disable no-unused-vars */
const express = require('express')
const app = express()
const port = process.env.PORT || 8080

const mongoose = require('mongoose')
require('./api/models/actor');
require('./api/models/trip')
require('./api/models/application')
require('./api/models/configuration')
require('./api/models/finder')
const Dashboard = require('./api/models/dashboard')
const Sponsorship = require('./api/models/sponsorship')
const DashboardTools = require('./api/controllers/dashboardController')

const { prepareDatabase } = require("./massiveData");

const bodyParser = require('body-parser')
var admin = require("firebase-admin");
var serviceAccount = require("./acme-explorer-g5-ass-firebase-adminsdk-m29nr-e3653510fe.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Configurar cabeceras y cors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

const routesActors = require('./api/routes/actorRoutes')
const routesFinder = require('./api/routes/finderRoutes')
const routesTrip = require('./api/routes/tripRoutes');
const routesLogin = require('./api/routes/loginRoutes');
const finderTools = require('./api/controllers/finderController');
const routesSponships = require('./api/routes/sponsorshipRoutes')
const routesDashboard = require('./api/routes/dashboardRoutes')


routesActors(app)
routesFinder(app)
routesTrip(app)
routesLogin(app)
routesSponships(app)
routesDashboard(app)

// MongoDB URI building
const mongoDBUser = process.env.mongoDBUser || 'myUser'
const mongoDBPass = process.env.mongoDBPass || 'myUserPassword'
const mongoDBCredentials = (mongoDBUser && mongoDBPass) ? mongoDBUser + ':' + mongoDBPass + '@' : ''

const mongoDBHostname = process.env.mongoDBHostname || 'localhost'
const mongoDBPort = process.env.mongoDBPort || '27017'
const mongoDBName = process.env.mongoDBName || 'ACME-Explorer'

//TODO: Descomentar si no se tiene usuario en bd
const mongoDBURI = 'mongodb://' + mongoDBHostname + ':' + mongoDBPort + '/' + mongoDBName

// const mongoDBURI = 'mongodb://' + mongoDBCredentials + mongoDBHostname + ':' + mongoDBPort + '/' + mongoDBName
const MONGOURL = process.env.MONGOURL || ''

// TODO: Descomentar si no se tiene usuario creado en la bd
if(MONGOURL){
  mongoose.connect(MONGOURL)
}else{
  mongoose.connect(mongoDBURI)
}

//TODO: Si no se tiene usuario en la bd, diapositivas 9 y 10 de NoSQL Features and JSON Storage
// mongoose.connect(mongoDBURI, {
//   connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
//   socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
//   family: 4, // skip trying IPv6
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
console.log('Connecting DB to: ' + mongoDBURI)

mongoose.connection.on('open', function () {
  prepareDatabase();
  app.listen(port, function () {
    console.log('ACME-Explorer RESTful API server started on: ' + port)
  })
})

mongoose.connection.on('error', function (err) {
  console.log('DB init error ' + err)
})

//finderTools.createRefreshFindersJob();

module.exports = app
