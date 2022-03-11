'use strict'
module.exports = function (app) {
  const actors = require('../controllers/actorController');
  const applications = require('../controllers/applicationController');

  // V1 - Sin autenticación
  app.route('/v1/actors')
    .post(actors.create_an_actor) //Register to the system as an explorer, create accounts for new managers

  app.route('/v1/actors/:actorId')
    .get(actors.read_an_actor)
    .put(actors.update_an_actor) //edit personal data, ban actor, unban actor
  
  app.route('/v1/actors/:actorId/applications')
    .get(applications.list_applications_by_user) //list applications user has made grouped by status
  
  //V2 - Con autenticación
  app.route('/v2/actors')
    .post(actors.create_an_actor) //Register to the system as an explorer, create accounts for new managers

  app.route('/v2/actors/:actorId')
    .get(actors.read_an_actor)
    .put(actors.update_an_actor) //edit personal data, ban actor, unban actor
  
  app.route('/v2/actors/:actorId/applications')
    .get(applications.list_applications_by_user_with_auth) //list applications user has made grouped by status
}
