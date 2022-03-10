const mongoose = require('mongoose')
require('./api/models/actor');
const Actor = mongoose.model('Actors')
require('./api/models/trip')
const Trip = mongoose.model('Trips')
require('./api/models/application')
const Application = mongoose.model('Applications')

require('./api/models/configuration')
const Configuration= mongoose.model('Configurations')

require('./api/models/finder')
const Finder = mongoose.model('Finders')

const async= require("async");

const fileSystem = require('fs');

async function prepareDatabase () {
    var actorsCount= await Actor.count()
    if(actorsCount==0){
      try {  
        console.log("The previous data is going to be deleted. Loading new collections");
        async.parallel(
            [
                loadActors,
                loadTrips,
                loadApplications,
                loadFinders,
                loadConfiguration
            ],
            function(err,results){
                if(err){
                    throw err
                }else{
                    console.log("Collections loaded")
                }
            }
        )
      } catch (err) {
        throw err;
      }
    }
  }

async function loadActors(){
    try{
        let data = fileSystem.readFileSync("./data/Actors.json", 'utf8');
        let jsonDataset = JSON.parse(data);
        await Actor.insertMany(jsonDataset);
        return "Actors' collection created";
    }catch(e){
        console.log("Error en actor")
        throw e;
    }
}

async function loadTrips(){
    try{
        await Trip.collection.drop();
        let data = fileSystem.readFileSync("./data/Trips.json", 'utf8');
        jsonDataset = JSON.parse(data);
        await Trip.insertMany(jsonDataset);
        return "Trips' collection created";
    }catch(e){
        console.log("Error en trip")
        throw e;
    }
}

async function loadApplications(){
    try{
        let data = fileSystem.readFileSync("./data/Applications.json", 'utf8');
        jsonDataset = JSON.parse(data);
        await Application.insertMany(jsonDataset);
        return "Applications' collection created";
    }catch(e){
        console.log("Error en application")
        throw e;
    }
}

async function loadFinders(){
    try{
        let data = fileSystem.readFileSync("./data/Finders.json", 'utf8');
        jsonDataset = JSON.parse(data);
        await Finder.insertMany(jsonDataset);
        return "Finders' collection created";
    }catch(e){
        console.log("Error en finder")
        throw e;
    }
}

async function loadConfiguration(){
    try{
        await Configuration.create({});
        return "Configurations' collection created";
    }catch(e){
        console.log("Error en configuration")
        throw e;
    }
}


module.exports = {prepareDatabase}
