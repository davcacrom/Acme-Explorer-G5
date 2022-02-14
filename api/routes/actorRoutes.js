'use strict'
module.exports = function (app) {
  const actors = require('../controllers/actorController');
  const applications = require('../controllers/applicationController');

  app.route('/actors')
    .post(actors.create_an_actor) //Register to the system as an explorer, create accounts for new managers

  app.route('/actors/:actorId')
    .get(actors.read_an_actor)
    .put(actors.update_an_actor) //edit personal data, ban actor, unban actor
  
  app.route('/actors/:actorId/applications')
    .get(applications.list_applications_by_user) //list applications user has made grouped by status
  
}
