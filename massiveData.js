const mongoose = require('mongoose')
require('./api/models/actor');
const Actor = mongoose.model('Actors')
require('./api/models/trip')
const Trip = mongoose.model('Trips')
require('./api/models/application')
const Application = mongoose.model('Applications')
var logger = require('./logger');

require('./api/models/configuration')
const Configuration = mongoose.model('Configurations')

require('./api/models/finder')
const Finder = mongoose.model('Finders')

const async = require("async");

const fileSystem = require('fs');

async function prepareDatabase() {
    var actorsCount = await Actor.count()
    if (actorsCount == 0) {
        try {
            logger.info("The previous data is going to be deleted. Loading new collections");
            // await fixRefs();
            async.parallel(
                [
                    loadActors,
                    loadTrips,
                    loadApplications,
                    loadFinders,
                    loadConfiguration
                ],
                function (err, results) {
                    if (err) {
                        throw err
                    } else {
                        logger.info("Collections loaded")
                    }
                }
            )
        } catch (err) {
            throw err;
        }
    }
}

async function fixRefs() {
    function random(list) {
        return list[Math.floor(Math.random() * list.length)];
    }

    try {
        const actors = JSON.parse(fileSystem.readFileSync("./data/RawActors.json", 'utf8'));
        actors.forEach(actor => {
            actor.password = '$2a$05$qcxoy81dUiCHGz3d4Xkk/.QLXX1zrMPCFJc18ubHLHDTJE7EmztEK';
        });
        const managers = actors.filter(actor => actor.role === 'MANAGER');
        const explorers = actors.filter(actor => actor.role === 'EXPLORER');

        const trips = JSON.parse(fileSystem.readFileSync("./data/RawTrips.json", 'utf8'));
        const cancelledTrips = trips.filter(trip => trip.state === 'CANCELLED');
        trips.forEach(trip => {
            trip.actor = random(managers)._id;
            if (trip.state === 'CANCELLED')
                trip.cancelationReason = 'This trip has been cancelled';
        });

        let applications = JSON.parse(fileSystem.readFileSync("./data/RawApplications.json", 'utf8'));
        applications.forEach(application => {
            application.actor = random(explorers)._id;
            application.trip = random(trips)._id;
            if (application.status === 'REJECTED')
                application.rejectionReason = 'This application has been rejected';
        });
        // Eliminamos applications duplicadas (mismo actor y mismo trip) si las hubiese
        // Lo que hace es filtrar las aplicaciones y dejar solo la primera de las ocurrencias con el mismo actor y trip
        // Además borramos applications ACEPTED de los trips cancelados (un trip no puede estar cancelado si hay una solicitud ACEPTED)
        applications = applications.filter(application =>
            applications.find(x => application.actor === x.actor && application.trip === x.trip) === application &&
            !(application.status === 'ACEPTED' && trips.find(trip => trip._id === application.trip).state === 'CANCELLED')
        );

        // Dejamos solo la misma cantidad de finders que de explorers y le asignamos uno a cada uno 
        const finders = JSON.parse(fileSystem.readFileSync("./data/RawFinders.json", 'utf8')).slice(0, explorers.length);
        finders.forEach((finder, i) => {
            finder.actor = explorers[i]._id;
            finder.trips = Array.apply(null, Array(finder.trips.length)).map(() => random(trips)._id);
        });

        fileSystem.writeFileSync("./data/Actors.json", JSON.stringify(actors), { encoding: 'utf8' });
        fileSystem.writeFileSync("./data/Trips.json", JSON.stringify(trips), { encoding: 'utf8' });
        fileSystem.writeFileSync("./data/Applications.json", JSON.stringify(applications), { encoding: 'utf8' });
        fileSystem.writeFileSync("./data/Finders.json", JSON.stringify(finders), { encoding: 'utf8' });
    } catch (e) {
        throw e;
    }
}

async function loadActors() {
    try {
        let data = fileSystem.readFileSync("./data/Actors.json", 'utf8');
        let jsonDataset = JSON.parse(data);
        await Actor.insertMany(jsonDataset);
        return "Actors' collection created";
    } catch (e) {
        logger.error("Error en actor")
        throw e;
    }
}

async function loadTrips() {
    try {
        // await Trip.collection.drop();
        let data = fileSystem.readFileSync("./data/Trips.json", 'utf8');
        jsonDataset = JSON.parse(data);
        await Trip.insertMany(jsonDataset);
        return "Trips' collection created";
    } catch (e) {
        logger.error("Error en trip")
        throw e;
    }
}

async function loadApplications() {
    try {
        let data = fileSystem.readFileSync("./data/Applications.json", 'utf8');
        jsonDataset = JSON.parse(data);
        await Application.insertMany(jsonDataset);
        return "Applications' collection created";
    } catch (e) {
        logger.error("Error en application")
        throw e;
    }
}

async function loadFinders() {
    try {
        let data = fileSystem.readFileSync("./data/Finders.json", 'utf8');
        jsonDataset = JSON.parse(data);
        await Finder.insertMany(jsonDataset);
        return "Finders' collection created";
    } catch (e) {
        logger.error("Error en finder")
        throw e;
    }
}

async function loadConfiguration() {
    try {
        await Configuration.create({});
        return "Configurations' collection created";
    } catch (e) {
        logger.error("Error en configuration")
        throw e;
    }
}


module.exports = { prepareDatabase }
