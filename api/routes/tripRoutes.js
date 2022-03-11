'use strict'
module.exports = function (app) {
  const trips = require('../controllers/tripController');
  const applications = require('../controllers/applicationController');
  
  // V1 - Sin autenticación
  app.route('/v1/trips')
    .get(trips.list_all_trips) //browse the list of trips, search for trips using keyword, listing trips
    .post(trips.create_a_trip) //creating trips

  app.route('/v1/trips/dashboard')
  .get(trips.get_dashboard) //trip dashboard
  
  app.route('/v1/trips/:tripId')
    .get(trips.read_a_trip) //displaying trips
    .put(trips.update_a_trip) //publishing trips, modifying trips, cancel trip
    .delete(trips.delete_a_trip) //deleting trips    

  app.route('/v1/trips/:tripId/applications')
    .get(applications.list_all_applications) //listing applications for a trip
    .post(applications.create_an_application) //apply for a trip

  app.route('/v1/trips/finders/:finderId')
    .get(trips.list_trips_by_finder) //listing trips by explorers finder

  app.route('/v1/trips/:tripId/applications/:applicationId')
    .get(applications.read_an_application) //displaying applications
    .put(applications.update_an_application) //change status, cancel application

  app.route('/v1/trips/:tripId/applications/:applicationId/:price')
    .put(applications.update_an_application) //pay trip

  //v2 - con autorización
  app.route('/v2/trips')
  .get(trips.list_all_trips) //browse the list of trips, search for trips using keyword, listing trips
  .post(trips.create_a_trip) //creating trips

  app.route('/v2/trips/dashboard')
  .get(trips.get_dashboard) //trip dashboard
  
  app.route('/v2/trips/:tripId')
    .get(trips.read_a_trip) //displaying trips
    .put(trips.update_a_trip) //publishing trips, modifying trips, cancel trip
    .delete(trips.delete_a_trip) //deleting trips    

  app.route('/v2/trips/:tripId/applications')
    .get(applications.list_all_applications) //listing applications for a trip
    // .post(applications.create_an_application_with_auth) //apply for a trip

  app.route('/v2/trips/finders/:finderId')
    .get(trips.list_trips_by_finder) //listing trips by explorers finder

  app.route('/v2/trips/:tripId/applications/:applicationId')
    .get(applications.read_an_application) //displaying applications
    .put(applications.update_an_application) //change status, cancel application

  app.route('/v2/trips/:tripId/applications/:applicationId/:price')
    .put(applications.update_an_application) //pay trip
}
