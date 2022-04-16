'use strict'

module.exports = function (app) {
  const dashboard = require('../controllers/dashboardController')
  const authController = require('../controllers/authController')

  /**
   * Get a list of all indicators or post a new computation period for rebuilding
   * @section dashboard
   * @type get post
   * @url /dashboard
   * @param [string] rebuildPeriod
  */
  app.route('/v1/dashboard')
    .get(dashboard.list_all_indicators)
    .post(dashboard.rebuildPeriod)

  /**
   * Get a list of all indicators or post a new computation period for rebuilding
   * RequiredRole: Administrator
   * @section dashboard
   * @type get post
   * @url /dashboard
   * @param [string] rebuildPeriod
  */
  app.route('/v2/dashboard')
    .get(authController.verifyUser(
      ['ADMINISTRATOR']), dashboard.list_all_indicators)
    .post(authController.verifyUser(
      ['ADMINISTRATOR']), dashboard.rebuildPeriod)

  /**
  * Get a list of last computed indicator
  * @section dashboard
  * @type get
  * @url /dashboard/latest
 */
  app.route('/v1/dashboard/latest')
    .get(dashboard.last_indicator)

  /**
  * Get a list of last computed indicator
  * RequiredRole: Administrator
  * @section dashboard
  * @type get
  * @url /dashboard/latest
 */
  app.route('/v2/dashboard/latest')
    .get(authController.verifyUser(
      ['ADMINISTRATOR']), dashboard.last_indicator)

  /**
  * Returns the amount of
    money that explorer e has spent on trips during period p, which can be M01-M36 to
    denote any of the last 1-36 months or Y01-Y03 to denote any of the last three years
  * @section dashboard
  * @type get
  * @url /dashboard/explorerExpenses
  * @param [string] explorer
  * @param [string] period
 */
  app.route('/v1/dashboard/explorerExpenses')
    .get(dashboard.explorerExpenses)

  /**
  * Returns the amount of
    money that explorer e has spent on trips during period p, which can be M01-M36 to
    denote any of the last 1-36 months or Y01-Y03 to denote any of the last three years
  * RequiredRole: Administrator
  * @section dashboard
  * @type get
  * @url /dashboard/explorerExpenses
  * @param [string] explorer
  * @param [string] period
 */
  app.route('/v2/dashboard/explorerExpenses')
    .get(authController.verifyUser(
      ['ADMINISTRATOR']), dashboard.explorerExpenses)

  /**
  * Given p, return the explorers e such that M[e, p] q v, where v denotes an arbitrary
  amount of money and q is a comparison operator (that is, “equal”,
  “not equal”, “greater than”, “greater than or equal”, “smaller than”, or
  “smaller than or equal”).
  * @section dashboard
  * @type get
  * @url /dashboard/explorerExpenses
  * @param [string] period
  * @param [integer] amount
  * @param [string] operator - Values [eq, neq, gt, gte, st, ste]
 */
  app.route('/v1/dashboard/explorerExpensesComparison')
    .get(dashboard.explorerExpensesComparison)

  /**
  * Given p, return the explorers e such that M[e, p] q v, where v denotes an arbitrary
  amount of money and q is a comparison operator (that is, “equal”,
  “not equal”, “greater than”, “greater than or equal”, “smaller than”, or
  “smaller than or equal”).

  * RequiredRole: Administrator
  * @section dashboard
  * @type get
  * @url /dashboard/explorerExpenses
  * @param [string] period
  * @param [integer] amount
  * @param [string] operator - Values [eq, neq, gt, gte, st, ste]
 */
  app.route('/v2/dashboard/explorerExpensesComparison')
    .get(authController.verifyUser(
      ['ADMINISTRATOR']), dashboard.explorerExpensesComparison)
}
