/* eslint-disable no-unused-vars */
const express = require('express')
const app = express()
const port = process.env.PORT || 8080

const mongoose = require('mongoose')
require('./api/models/actor');
const Actor = mongoose.model('Actors')
require('./api/models/trip')
const Trip = mongoose.model('Trips')
require('./api/models/application')
const Application = mongoose.model('Applications')

const Configuration = require('./api/models/configuration')
const Finder = require('./api/models/finder')
const fileSystem = require('fs');

const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const routesActors = require('./api/routes/actorRoutes')
const routesFinder = require('./api/routes/finderRoutes')
const routesTrip = require('./api/routes/tripRoutes')

routesActors(app)
routesFinder(app)
routesTrip(app)

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

// TODO: Descomentar si no se tiene usuario creado en la bd
mongoose.connect(mongoDBURI)

//TODO: Si no se tiene usuario en la bd, diapositivas 9 y 10 de NoSQL Features and JSON Storage
// mongoose.connect(mongoDBURI, {
//   connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
//   socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
//   family: 4, // skip trying IPv6
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
console.log('Connecting DB to: ' + mongoDBURI)

//TODO: Cambiar false a true para cargar los datos iniciales
if (true){
  prepareDatabase();
}

mongoose.connection.on('open', function () {
  app.listen(port, function () {
    console.log('ACME-Explorer RESTful API server started on: ' + port)
  })
})

mongoose.connection.on('error', function (err) {
  console.error('DB init error ' + err)
})

async function prepareDatabase () {
  try {
    console.log('Deleting collections');
    try {
      await Actor.collection.drop();
      await Trip.collection.drop();
      await Application.collection.drop();
    } catch (err) {
      if (err.message !== 'ns not found') {
        throw err;
      }
    }

    console.log("Loading collections");
    let data = fileSystem.readFileSync("./data/Actors.json", 'utf8');
    let jsonDataset = JSON.parse(data);
    await Actor.insertMany(jsonDataset);

    data = fileSystem.readFileSync("./data/Trips.json", 'utf8');
    jsonDataset = JSON.parse(data);
    await Trip.insertMany(jsonDataset);

    data = fileSystem.readFileSync("./data/Applications.json", 'utf8');
    jsonDataset = JSON.parse(data);
    await Application.insertMany(jsonDataset);

    console.log("Collections created")
  } catch (err) {
    throw err;
  }

}
