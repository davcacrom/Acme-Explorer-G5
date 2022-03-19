'use strict'
module.exports = function (app) {
  const finders = require('../controllers/finderController');
  
  // V1 - Sin autenticación
  app.route('/v1/finders/dashboard')
    .get(finders.get_dashboard) //finder dashboard

  app.route('/v1/finders/:finderId')
    .get(finders.read_a_finder) 
    .put(finders.update_a_finder) //manage finder (update)
  
  app.route('/v1/finders/config/:configId')
  .put(finders.update_config) // update cached period, update limit results

  // V2 - Con autenticación
  app.route('/v2/finders/dashboard')
    .get(finders.get_dashboard) //finder dashboard

  app.route('/v2/finders/:finderId')
    .get(finders.read_a_finder) 
    .put(finders.update_a_finder_with_auth) //manage finder (update)
  
  app.route('/v2/finders/config/:configId')
  .put(finders.update_config) // update cached period, update limit results
}
