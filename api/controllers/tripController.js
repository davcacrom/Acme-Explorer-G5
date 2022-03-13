'use strict'
/* ---------------ACTOR---------------------- */
const mongoose = require('mongoose')
const Trip = mongoose.model('Trips')
const Application = mongoose.model('Applications')
const authController = require('./authController')
const Finder = mongoose.model('Finders')
const math = require('mathjs')
const async = require("async");

exports.list_all_trips = function (req, res) {
  Trip.find({ published: true }, function (err, trips) {
    if (err) {
      res.send(err)
    } else {
      res.json(trips)
    }
  })
}

exports.list_trips_by_finder = function (req, res) {
  Finder.findById(req.params.finderId, function (err, finder) {
    if (err) {
      res.send(err)
    } else {
      Trip.find({ _id: { $in: finder.trips } }, function (err, trips) {
        if (err) {
          res.send(err)
        } else {
          res.json(trips)
        }
      })
    }
  })
}

exports.create_a_trip = function (req, res) {
  new Trip({
    actor: req.actor,
    description: req.description,
    endDate: req.endDate,
    pictures: req.pictures,
    requirements: req.requirements,
    startDate: req.startDate,
    title: req.title,
    stages: req.stages,
    published: req.published
  }).save(function (err, trip) {
    if (err) {
      res.send(err)
    } else {
      res.json(trip)
    }
  })
}

exports.read_a_trip = function (req, res) {
  Trip.findById(req.params.tripId, function (err, trip) {
    if (err) {
      res.send(err)
    } else {
      if (trip.published)
        res.json(trip)
      else
        res.status(403).json('You do not have permission to view that trip');
    }
  })
}

exports.update_a_trip = function (req, res) {
  Trip.findById(req.params.tripId, function (err, trip) {
    if (err) {
      res.send(err)
    } else {
      let updatedTrip;
      if (!trip.published)
        updatedTrip = {
          description: req.description,
          endDate: req.endDate,
          pictures: req.pictures,
          requirements: req.requirements,
          startDate: req.startDate,
          title: req.title,
          stages: req.stages,
          published: req.published
        };
      else if (trip.state !== 'CANCELLED' && trip.startDate > new Date() && (await Application.count({ trip: trip._id, status: 'ACEPTED' })) === 0)
        updatedTrip = {
          cancelationReason: req.cancelationReason,
          state: req.state
        };
      else {
        res.status(403).json('Cannot edit that trip');
        return;
      }

      Trip.findOneAndUpdate({ _id: trip._id }, updatedTrip, { new: true }, function (err, trip) {
        if (err) {
          res.send(err)
        } else {
          res.json(trip)
        }
      })
    }
  })
}

exports.delete_a_trip = function (req, res) {
  Trip.deleteOne({ _id: req.params.tripId, published: false }, function (err, trip) {
    if (err) {
      res.send(err)
    } else {
      res.json({ message: 'Trip successfully deleted' })
    }
  })
}

exports.get_dashboard = async function (req, res) {
  async.parallel(
    [
      applicationDashboard,
      tripsDashboard,
    ],
    function (err, results) {
      if (err) {
        throw err
      } else {
        var result = {}
        result["applicationsTrip"] = results[0]["applicationsTrip"][0];
        result["tripsByManager"] = results[1]["tripsByManager"][0];
        result["pricesTrip"] = results[1]["pricesTrip"][0];
        result["ratioApplication"] = results[0]["ratioApplication"];
        res.send(result);
      }
    }
  )
}

async function applicationDashboard() {
  var totalDocument = await Application.count()
  var result = await Application.aggregate([{
    $facet: {
      "applicationsTrip": [
        { $group: { _id: '$trip', count: { $sum: 1 } } },
        { $group: { _id: null, average: { $avg: '$count' }, max: { $max: '$count' }, min: { $min: '$count' }, std: { $stdDevSamp: '$count' } } },
        { $project: { _id: 0, average: 1, max: 1, min: 1, std: 1 } }
      ],
      "ratioApplication": [
        { "$group": { _id: "$status", total: { $sum: 1 } } },
        {
          "$project": {
            "total": 1,
            "percentage": {
              "$concat": [{ "$substr": [{ "$multiply": [{ "$divide": ["$total", { "$literal": totalDocument }] }, 100] }, 0, 2] }, "", "%"]
            }
          }
        }
      ]
    }
  }]
    , function (err, result) {
      if (err) {
        console.log(err)
        res.send(err)
      } else {
        return result;
      }
    })

  return result[0];
}

async function tripsDashboard() {
  // Trips by manager
  var result = await Trip.aggregate([{
    $facet: {
      "tripsByManager": [
        { $group: { _id: "$actor", count: { $sum: 1 } } },
        { $group: { _id: null, average: { $avg: '$count' }, max: { $max: '$count' }, min: { $min: '$count' }, std: { $stdDevSamp: '$count' } } },
        { $project: { _id: 0, average: 1, max: 1, min: 1, std: 1 } }
      ],
      "pricesTrip": [
        {
          $group: {
            _id: '$_id',
            sum: { $sum: { $sum: "$stages.price" } }
          }
        },
        { $group: { _id: null, average: { $avg: '$sum' }, max: { $max: '$sum' }, min: { $min: '$sum' }, std: { $stdDevSamp: '$sum' } } },
        { $project: { _id: 0, average: 1, max: 1, min: 1, std: 1 } }
      ]
    }
  }
  ], function (err, result) {
    if (err) {
      console.log(err)
      res.send(err)
    } else {
      return result;
    }
  })

  return result[0];
}

// v2
exports.list_all_trips_with_auth = function (req, res) {
  Trip.find({ published: true }, function (err, trips) {
    if (err) {
      res.send(err)
    } else {
      res.json(trips)
    }
  })
}

exports.list_trips_by_finder_with_auth = function (req, res) {
  const user = await authController.getUserId(req.headers.idtoken);

  Finder.findById(req.params.finderId, function (err, finder) {
    if (finder.actor === user._id) {
      if (err) {
        res.send(err)
      } else {
        Trip.find({ _id: { $in: finder.trips } }, function (err, trips) {
          if (err) {
            res.send(err)
          } else {
            res.json(trips)
          }
        })
      }
    } else
      res.status(403).json('You can not see another person\'s finder');
  })
}

exports.create_a_trip_with_auth = function (req, res) {
  const user = await authController.getUserId(req.headers.idtoken);

  if (user.role === 'MANAGER')
    new Trip({
      actor: user._id,
      description: req.description,
      endDate: req.endDate,
      pictures: req.pictures,
      requirements: req.requirements,
      startDate: req.startDate,
      title: req.title,
      stages: req.stages,
      published: req.published
    }).save(function (err, trip) {
      if (err) {
        res.send(err)
      } else {
        res.json(trip)
      }
    })
  else
    res.status(403);
}

exports.read_a_trip_with_auth = async function (req, res) {
  const user = await authController.getUserId(req.headers.idtoken);

  Trip.findById(req.params.tripId, function (err, trip) {
    if (err) {
      res.send(err)
    } else {
      if (trip.published || trip.actor === user._id)
        res.json(trip)
      else
        res.status(403).json('You do not have permission to view that trip');
    }
  })
}

exports.update_a_trip_with_auth = function (req, res) {
  const user = await authController.getUserId(req.headers.idtoken);

  if (user.role === 'MANAGER')
    Trip.findById(req.params.tripId, function (err, trip) {
      if (err) {
        res.send(err)
      } else {
        if (user._id === trip.actor) {
          let updatedTrip;
          if (!trip.published)
            updatedTrip = {
              description: req.description,
              endDate: req.endDate,
              pictures: req.pictures,
              requirements: req.requirements,
              startDate: req.startDate,
              title: req.title,
              stages: req.stages,
              published: req.published
            };
          else if (trip.state !== 'CANCELLED' && trip.startDate > new Date() && (await Application.count({ trip: trip._id, status: 'ACEPTED' })) === 0)
            updatedTrip = {
              cancelationReason: req.cancelationReason,
              state: req.state
            };
          else {
            res.status(403).json('Cannot edit that trip');
            return;
          }

          Trip.findOneAndUpdate({ _id: trip._id }, updatedTrip, { new: true }, function (err, trip) {
            if (err) {
              res.send(err)
            } else {
              res.json(trip)
            }
          })
        } else
          res.status(403).json('Cannot edit that trip');
      }
    })
  else
    res.status(403).json('Cannot edit that trip');
}

exports.delete_a_trip_with_auth = function (req, res) {
  const user = await authController.getUserId(req.headers.idtoken);

  if (user.role === 'MANAGER')
    Trip.findById(req.params.tripId, function (err, trip) {
      if (err)
        res.send(err)
      else {
        if (trip.actor === user._id)
          Trip.deleteOne({ _id: req.params.tripId, published: false }, function (err, trip) {
            if (err)
              res.send(err)
            else
              res.json({ message: 'Trip successfully deleted' })
          })
        else
          res.status(403).json('Cannot edit that trip');
      }
    });
  else
    res.status(403).json('Cannot edit that trip');
}

exports.get_dashboard_with_auth = async function (req, res) {
  const user = await authController.getUserId(req.headers.idtoken);

  if (user.role === 'ADMINISTRATOR')
    async.parallel(
      [
        applicationDashboard,
        tripsDashboard,
      ],
      function (err, results) {
        if (err) {
          throw err
        } else {
          var result = {}
          result["applicationsTrip"] = results[0]["applicationsTrip"][0];
          result["tripsByManager"] = results[1]["tripsByManager"][0];
          result["pricesTrip"] = results[1]["pricesTrip"][0];
          result["ratioApplication"] = results[0]["ratioApplication"];
          res.send(result);
        }
      }
    )
  else
    res.status(403).json('Cannot see the dashboard');
}