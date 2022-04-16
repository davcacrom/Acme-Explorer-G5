/* eslint-disable eqeqeq */
'use strict'

const mongoose = require('mongoose')
const ObjectId = require('mongoose').Types.ObjectId
const Trip = mongoose.model('Trips')
const Application = mongoose.model('Applications')
const Finder = mongoose.model('Finders')
const Dashboard = mongoose.model('Dashboards')
const Configuration = mongoose.model('Configurations')
const async = require('async')

exports.list_all_indicators = function (req, res) {
  console.log('Requesting indicators')

  Dashboard.find().sort('-computationMoment').exec(function (err, indicators) {
    if (err) {
      res.status(500).send(err)
    } else {
      res.json(indicators)
    }
  })
}

exports.last_indicator = function (req, res) {
  Dashboard.find().sort('-computationMoment').limit(1).exec(function (err, indicators) {
    if (err) {
      res.status(500).send(err)
    } else {
      res.json(indicators)
    }
  })
}

const CronJob = require('cron').CronJob
const CronTime = require('cron').CronTime

// '0 0 * * * *' una hora
// '*/30 * * * * *' cada 30 segundos
// '*/10 * * * * *' cada 10 segundos
// '* * * * * *' cada segundo
let rebuildPeriod = '*/10 * * * * *' // El que se usará por defecto
let computeDashboardJob

// This endpoint function updates CronJob rebuild period when is called
// and also puts the new value in the configuration model where it is stored
exports.rebuildPeriod = function (req, res) {
  console.log('Updating rebuild period. Request: period: ' + req.query.rebuildPeriod)

  Configuration.find().limit(1).exec({}, function (err, configuration) {
    if (err) {
      console.log('Error updating rebuild period: ' + err)
    } else {
      // eslint-disable-next-line eqeqeq
      Configuration.findOneAndUpdate(
        { _id: configuration[0]._id },
        { $set: { rebuildPeriod: req.query.rebuildPeriod } },
        { new: true },
        function (err, configuration) {
          if (err) {
            console.log('Error updating rebuild period: ' + err)
          } else {
            rebuildPeriod = req.query.rebuildPeriod
            computeDashboardJob.setTime(new CronTime(req.query.rebuildPeriod))
            computeDashboardJob.start()
            res.json(rebuildPeriod)
          }
        }
      )
    }
  })
}

// This function is called whenever the job executes itself and checks whether
// the rebuild period in configuration has changed. If it did, we modify
// the CronJob to these value.
// In that way, if an administrator modifies the configuration, the CronJob
// will always use this new value
function checkConfigurationRebuildPeriod () {
  Configuration.find().limit(1).exec({}, function (err, configuration) {
    if (err) {
      console.log('Error computing dashboard: ' + err)
    } else {
      // eslint-disable-next-line eqeqeq
      if (configuration[0].rebuildPeriod != rebuildPeriod) {
        console.log('Updating rebuild period from configuration. Period: ' + configuration[0].rebuildPeriod)
        rebuildPeriod = configuration[0].rebuildPeriod
        computeDashboardJob.setTime(new CronTime(rebuildPeriod))
        computeDashboardJob.start()
      }
    }
  })
}

function createDashboardJob () {
  computeDashboardJob = new CronJob(rebuildPeriod, function () {
    checkConfigurationRebuildPeriod()

    const newDashboard = new Dashboard()
    console.log('Cron job submitted. Rebuild period: ' + rebuildPeriod)
    async.parallel([
      computeTripsPerManager,
      computeApplicationsPerTrip,
      computeTripsPrices,
      computeApplicationsRatio,
      computeFindersAveragePrice,
      computeTopKeywords,
      computeExplorerExpensesCubeByYear,
      computeExplorerExpensesCubeByMonth
    ], function (err, results) {
      if (err) {
        console.log('Error computing dashboard: ' + err)
      } else {
        // console.log("Resultados obtenidos por las agregaciones: "+JSON.stringify(results));
        newDashboard.tripsPerManager = results[0]
        newDashboard.applicationsPerTrip = results[1]
        newDashboard.tripsPrices = results[2]
        newDashboard.applicationsRatio = results[3]
        newDashboard.findersAveragePrice = results[4]
        newDashboard.findersTopKeywords = results[5]
        newDashboard.explorersExpensesCubeByYear = results[6]
        newDashboard.explorersExpensesCubeByMonth = results[7]
        newDashboard.rebuildPeriod = rebuildPeriod

        newDashboard.save(function (err, dashboard) {
          if (err) {
            console.log('Error saving dashboard: ' + err)
          } else {
            console.log('new Dashboard succesfully saved. Date: ' + new Date())
          }
        })
      }
    })
  }, null, true, 'Europe/Madrid')
}

module.exports.createDashboardJob = createDashboardJob

/**
 * Get the average, the minimum, the maximum, and the standard deviation of the
     number of trips managed per manager
*/
function computeTripsPerManager (callback) {
  Trip.aggregate([

    { $group: { _id: '$manager', count: { $sum: 1 } } },
    { $group: { _id: null, average: { $avg: '$count' }, max: { $max: '$count' }, min: { $min: '$count' }, std: { $stdDevSamp: '$count' } } },
    { $project: { _id: 0, average: 1, max: 1, min: 1, std: 1 } }

  ], function (err, res) {
    callback(err, res[0])
  })
};

/**
   * Get the average, the minimum, the maximum, and the standard deviation of the
    number of applications per trip
  */
function computeApplicationsPerTrip (callback) {
  Application.aggregate([

    { $group: { _id: '$trip', count: { $sum: 1 } } },
    { $group: { _id: null, average: { $avg: '$count' }, max: { $max: '$count' }, min: { $min: '$count' }, std: { $stdDevSamp: '$count' } } },
    { $project: { _id: 0, average: 1, max: 1, min: 1, std: 1 } }

  ], function (err, res) {
    callback(err, res[0])
  })
};

/**
   * The average, the minimum, the maximum, and the standard deviation of the
    price of the trips
  */
function computeTripsPrices (callback) {
  Trip.aggregate([
    { $group: { _id: null, average: { $avg: '$price' }, max: { $max: '$price' }, min: { $min: '$price' }, std: { $stdDevSamp: '$price' } } },
    { $project: { _id: 0, average: 1, max: 1, min: 1, std: 1 } }

  ], function (err, res) {
    callback(err, res[0])
  })
};

/**
   * The ratio of applications grouped by status
   *
   * Fully developed using Mongo aggregation framework instead of mongoose utility "Application.count()"
   * to get Applications totals to compute percentage.
   */
function computeApplicationsRatio (callback) {
  Application.aggregate([
    { $unwind: '$status' },
    { $group: { _id: '$status', count: { $sum: 1 } } },
    {
      $group: {
        _id: null,
        totalApps: { $sum: '$count' },
        statuses: {
          $push: {
            status: '$_id',
            count: '$count'
          }
        }
      }
    },
    {
      $project: {
        ratios: {
          $map: {
            input: { $range: [0, { $size: '$statuses' }] },
            as: 'ix',
            in: {
              $let: {
                vars: {
                  pre: { $arrayElemAt: ['$statuses.status', '$$ix'] },
                  cal: { $arrayElemAt: ['$statuses.count', '$$ix'] },
                  ta: '$totalApps'
                },
                in: {
                  status: '$$pre',
                  count: '$$cal',
                  applicationsRatio: {
                    $multiply: [
                      { $divide: ['$$cal', '$$ta'] },
                      100
                    ]
                  }
                }
              }
            }
          }
        },
        _id: 0
      }
    }
  ], function (err, res) {
    callback(err, res[0])
  })
};

/**
   * The average price range that explorers indicate in their finders
  */
function computeFindersAveragePrice (callback) {
  Finder.aggregate([
    { $group: { _id: null, averageMaxPrice: { $avg: '$maxPrice' } } },
    { $project: { _id: 0, averageMaxPrice: 1 } }

  ], function (err, res) {
    callback(err, res[0])
  })
};

/**
   * The top 10 key words that the explorers indicate in their finders
  */
function computeTopKeywords (callback) {
  Finder.aggregate([
    { $group: { _id: '$keyword', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ], function (err, res) {
    callback(err, res[0])
  })
};

/**
 * compute a cube of the form M[e, p] that returns the amount of
money that explorer e has spent on trips during period p, which can be M01-M36 to
denote any of the last 1-36 months or Y01-Y03 to denote any of the last three years
*/
function computeExplorerExpensesCubeByYear (callback) {
  Application.aggregate([
    // First, we retrieve the trip information
    {
      $lookup: {
        from: 'trips',
        localField: 'trip',
        foreignField: '_id',
        as: 'trip_object'
      }
    },
    { $unwind: '$trip_object' },
    // Take the trip price
    { $project: { _id: 1, explorer: 1, year: { $year: '$moment' }, month: { $month: '$moment' }, price: '$trip_object.price' } },
    // Now, we group by explorer and year summing trips prices
    {
      $group: {
        _id: {
          explorer: '$explorer',
          year: '$year'
        },
        amount: { $sum: '$price' },
        explorer: { $first: '$explorer' },
        year: { $first: '$year' }
      }
    },
    { $project: { _id: 0, explorer: 1, year: 1, amount: 1 } }
  ], function (err, res) {
    callback(err, res)
  })
};

function computeExplorerExpensesCubeByMonth (callback) {
  Application.aggregate([
    // First, we retrieve the trip information
    {
      $lookup: {
        from: 'trips',
        localField: 'trip',
        foreignField: '_id',
        as: 'trip_object'
      }
    },
    { $unwind: '$trip_object' },
    // Take the trip price
    { $project: { _id: 1, explorer: 1, year: { $year: '$moment' }, month: { $month: '$moment' }, price: '$trip_object.price' } },
    // Now, we group by explorer, month and year summing trips prices
    {
      $group: {
        _id: {
          explorer: '$explorer',
          year: '$year',
          month: '$month'
        },
        amount: { $sum: '$price' },
        explorer: { $first: '$explorer' },
        year: { $first: '$year' },
        month: { $first: '$month' }

      }
    },
    { $project: { _id: 0, explorer: 1, year: 1, month: 1, amount: 1 } }
  ], function (err, res) {
    callback(err, res)
  })
};

/**
 * Given e and p, return M[e, p]
 *
 * This function provides the sum of prices, it is, the total of money
 * a given explorer e has spent on trips during the period p that can be
 * a past month (M01-M36) or a past year (Y01-Y03)
 *
 */
exports.explorerExpenses = function (req, res) {
  // Check if we have explorer id and it is correct
  if (!req.query.explorer) {
    res.status(400).send('Missing exporer to search.')
  } else if (!ObjectId.isValid(req.query.explorer)) {
    res.status(400).send('Invalid explorer id.')
  }

  // Check whether period given is correct and if it is
  // monthly or yearly agregation
  let periodType = null
  if (!req.query.period) {
    res.status(400).send('Missing period to search.')
  } else if (req.query.period.match(/[M]{1}([0-2]{1}[0-9]|[3][0-6])$/)) {
    periodType = 'month'
  } else if (req.query.period.match(/[Y]{1}(0[1-3])$/)) {
    periodType = 'year'
  } else {
    res.status(400).send('Invalid period, formats accepted: M01-M36 and Y01-Y03.')
  }

  // We retrieve the last dashboard where the information is stored
  Dashboard.find().sort('-computationMoment').limit(1).exec(function (err, indicators) {
    if (err) {
      res.status(500).send(err)
    } else {
      // eslint-disable-next-line eqeqeq
      if (periodType == 'month') {
        // if the period is a previous month, we get it and compute the corresponding month and year
        const minusMonths = req.query.period.split('M')[1]
        const d = new Date()
        d.setMonth(d.getMonth() - minusMonths)
        const requestedMonth = d.getMonth() + 1
        const requestedYear = d.getFullYear()

        const expenses = indicators[0].explorersExpensesCubeByMonth

        // Finally, we filter the cube information looking by the query given
        let result = null
        for (let i = 0; i < expenses.length; i++) {
          if (expenses[i].explorer == req.query.explorer && expenses[i].month == requestedMonth && expenses[i].year == requestedYear) {
            result = { explorer: expenses[i].explorer, month: expenses[i].month, year: expenses[i].year, amount: expenses[i].amount }
            break
          }
        }

        if (result) {
          res.json(result)
        } else {
          res.status(404).send('Registers not found for the query')
        }
      } else {
        // In the case of year filtering, we do the same but only taking into consideration the past year given
        const minusYears = req.query.period.split('Y')[1]
        const d = new Date()
        d.setFullYear(d.getFullYear() - minusYears)
        const requestedYear = d.getFullYear()

        const expenses = indicators[0].explorersExpensesCubeByYear

        let result = null
        for (let i = 0; i < expenses.length; i++) {
          if (expenses[i].explorer == req.query.explorer && expenses[i].year == requestedYear) {
            result = { explorer: expenses[i].explorer, year: expenses[i].year, amount: expenses[i].amount }
            break
          }
        }

        if (result) {
          res.json(result)
        } else {
          res.status(404).send('Registers not found for the query')
        }
      }
    }
  })
}

// Given p, return the explorers e such that M[e, p] q v, where v denotes an arbitrary
//   amount of money and q is a comparison operator (that is, “equal”,
//   “not equal”, “greater than”, “greater than or equal”, “smaller than”, or
//   “smaller than or equal”)
//
// Returns a dictionary where keys are the selected explorers ids and the values are the amount of money
exports.explorerExpensesComparison = function (req, res) {
  // Check whether period given is correct and if it is
  // monthly or yearly agregation
  let periodType = null
  if (!req.query.period) {
    res.status(400).send('Missing period to search.')
  } else if (req.query.period.match(/[M]{1}([0-2]{1}[0-9]|[3][0-6])$/)) {
    periodType = 'month'
  } else if (req.query.period.match(/[Y]{1}(0[1-3])$/)) {
    periodType = 'year'
  } else {
    res.status(400).send('Invalid period, formats accepted: M01-M36 and Y01-Y03.')
  }

  if (!req.query.amount) {
    res.status(400).send('Missing amount to search.')
  } else if (isNaN(req.query.amount)) {
    res.status(400).send('Invalid amount format.')
  }

  if (!req.query.operator) {
    res.status(400).send('Missing operator to search.')
  } else if (!['eq', 'neq', 'gt', 'gte', 'st', 'ste'].includes(req.query.operator)) {
    res.status(400).send('Invalid operator format.')
  }

  const operatorsTable = {
    // eslint-disable-next-line quote-props
    'eq': function (a, b) { return a == b },
    // eslint-disable-next-line quote-props
    'neq': function (a, b) { return a != b },
    // eslint-disable-next-line quote-props
    'gt': function (a, b) { return a > b },
    // eslint-disable-next-line quote-props
    'gte': function (a, b) { return a >= b },
    // eslint-disable-next-line quote-props
    'st': function (a, b) { return a < b },
    // eslint-disable-next-line quote-props
    'ste': function (a, b) { return a <= b }
  }

  // We retrieve the last dashboard where the information is stored
  Dashboard.find().sort('-computationMoment').limit(1).exec(function (err, indicators) {
    if (err) {
      res.status(500).send(err)
    } else {
      if (periodType == 'month') {
        // if the period is a previous month, we get it and compute the corresponding month and year
        const minusMonths = req.query.period.split('M')[1]
        const d = new Date()
        d.setMonth(d.getMonth() - minusMonths)
        const requestedMonth = d.getMonth() + 1
        const requestedYear = d.getFullYear()

        const expenses = indicators[0].explorersExpensesCubeByMonth

        // Finally, we filter the cube information looking by the query given
        // In this case, we use an auxiliar dictionary to use the given operator when comparing money amounts
        const result = {}
        for (let i = 0; i < expenses.length; i++) {
          if (operatorsTable[req.query.operator](expenses[i].amount, req.query.amount) && expenses[i].month == requestedMonth && expenses[i].year == requestedYear) {
            result[expenses[i].explorer] = expenses[i].amount
          }
        }

        if (Object.keys(result).length > 0) {
          res.json(result)
        } else {
          res.status(404).send('Registers not found for the query')
        }
      } else {
        // In the case of year filtering, we do the same but only taking into consideration the past year given
        const minusYears = req.query.period.split('Y')[1]
        const d = new Date()
        d.setFullYear(d.getFullYear() - minusYears)
        const requestedYear = d.getFullYear()

        const expenses = indicators[0].explorersExpensesCubeByYear

        const result = {}
        for (let i = 0; i < expenses.length; i++) {
          if (operatorsTable[req.query.operator](expenses[i].amount, req.query.amount) && expenses[i].year == requestedYear) {
            result[expenses[i].explorer] = expenses[i].amount
          }
        }

        if (Object.keys(result).length > 0) {
          res.json(result)
        } else {
          res.status(404).send('Registers not found for the query')
        }
      }
    }
  })
}
