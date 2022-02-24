'use strict'
module.exports = function (app) {
  const finders = require('../controllers/finderController');
  
  app.route('/finders/dashboard')
    .get(finders.get_dashboard) //finder dashboard

  app.route('/finders/:finderId')
    .get(finders.read_a_finder) 
    .put(finders.update_a_finder) //manage finder (update)
  
  app.route('/finders/config/:configId')
  .put(finders.update_config) // update cached period, update limit results
}
