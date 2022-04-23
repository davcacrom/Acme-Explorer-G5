const mongoose = require('mongoose')
require('./api/models/actor');
const Actor = mongoose.model('Actors')
require('./api/models/trip')
const Trip = mongoose.model('Trips')
require('./api/models/application')
const Application = mongoose.model('Applications')

require('./api/models/sponsorship')
const Sponsorship = mongoose.model('Sponsorships')

require('./api/models/configuration')
const Configuration = mongoose.model('Configurations')

require('./api/models/finder')
const Finder = mongoose.model('Finders')

const async = require("async");

const fileSystem = require('fs');


const PICTURES = [
    "https://i.blogs.es/161dfa/simon-migaj-yui5vfkhuzs-unsplash/450_1000.jpg",
    "https://elviajerofeliz.com/wp-content/uploads/2016/08/como-hacer-buenas-fotos-de-viaje.jpg",
    "https://lamenteesmaravillosa.com/wp-content/uploads/2015/07/shutterstock_144112840.jpg"
];

async function prepareDatabase() {
    var actorsCount = await Actor.count()
    if (actorsCount == 0) {
        try {
            console.log("The previous data is going to be deleted. Loading new collections");
            // await fixRefs();
            async.parallel(
                [
                    loadActors,
                    loadTrips,
                    loadApplications,
                    loadFinders,
                    loadConfiguration,
                    loadSponsorships
                ],
                function (err, results) {
                    if (err) {
                        throw err
                    } else {
                        console.log("Collections loaded")
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
            actor.password = '$2a$05$qcxoy81dUiCHGz3d4Xkk/.QLXX1zrMPCFJc18ubHLHDTJE7EmztEK'; // La contraseña por defecto es password
        });
        const managers = actors.filter(actor => actor.role === 'MANAGER');
        const explorers = actors.filter(actor => actor.role === 'EXPLORER');

        const trips = JSON.parse(fileSystem.readFileSync("./data/RawTrips.json", 'utf8'));
        trips.forEach(trip => {
            trip.actor = random(managers)._id;
            trip.price = parseFloat(trip.stages.reduce((sum, stage) => sum + stage.price, 0).toFixed(2));
            trip.pictures = PICTURES.sort(() => 0.5 - Math.random()).slice(0, 1 + Math.floor(Math.random() * PICTURES.length));
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
        // Además borramos applications ACCEPTED de los trips cancelados (un trip no puede estar cancelado si hay una solicitud ACCEPTED)
        applications = applications.filter(application =>
            applications.find(x => application.actor === x.actor && application.trip === x.trip) === application &&
            !(application.status === 'ACCEPTED' && trips.find(trip => trip._id === application.trip).state === 'CANCELLED')
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
        console.log("Error en actor")
        throw e;
    }
}

async function loadSponsorships() {
    try {
        let data = fileSystem.readFileSync("./data/sponsorships.json", 'utf8');
        let jsonDataset = JSON.parse(data);
        await Sponsorship.insertMany(jsonDataset);
        return "Sponsorships' collection created";
    } catch (e) {
        console.log("Error en actor")
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
        console.log("Error en trip")
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
        console.log("Error en application")
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
        console.log("Error en finder")
        throw e;
    }
}

async function loadConfiguration() {
    try {
        await Configuration.create({});
        return "Configurations' collection created";
    } catch (e) {
        console.log("Error en configuration")
        throw e;
    }
}


module.exports = { prepareDatabase }
