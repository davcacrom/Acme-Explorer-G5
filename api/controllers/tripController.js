'use strict'
/* ---------------ACTOR---------------------- */
const mongoose = require('mongoose')
const Trip = mongoose.model('Trips')
const Application = mongoose.model('Applications')
const authController = require('./authController')
const Finder = mongoose.model('Finders')
const math = require('mathjs')
const async = require("async");

const KEYWORD_REGEXP = /^[^\s]+$/;
exports.list_trips = function (req, res) {
  let filter = { published: true };

  if (req.query.keyword) {
    const keyword = req.query.keyword;
    if (keyword.match(KEYWORD_REGEXP))
      filter.$or = [{ ticker: { $regex: keyword } }, { title: { $regex: keyword } }, { descripcion: { $regex: keyword } }];
    else {
      res.status(400).json('A keyword must be just 1 word');
      return;
    }
  }
  Trip.find(filter, function (err, trips) {
    if (err)
      res.status(500).send(err)
    else
      res.json(trips)
  })
}

exports.list_trips_by_finder = function (req, res) {
  Finder.findById(req.params.finderId, function (err, finder) {
    if (err)
      res.status(500).send(err)
    else if (finder)
      Trip.find({ _id: { $in: finder.trips } }, function (err, trips) {
        if (err)
          res.status(500).send(err)
        else
          res.json(trips)
      })
    else
      res.status(404).json("Not found");
  })
}

exports.create_a_trip = function (req, res) {
  new Trip({
    actor: req.body.actor,
    description: req.body.description,
    endDate: req.body.endDate,
    pictures: req.body.pictures,
    requirements: req.body.requirements,
    startDate: req.body.startDate,
    title: req.body.title,
    stages: req.body.stages,
    published: req.body.published
  }).save(function (err, trip) {
    if (err)
      res.status(500).send(err)
    else
      res.json(trip)
  })
}

exports.read_a_trip = function (req, res) {
  Trip.findById(req.params.tripId, function (err, trip) {
    if (err)
      res.status(500).send(err)
    else if (trip) {
      if (trip.published)
        res.json(trip)
      else
        res.status(403).json('You do not have permission to view that trip');
    } else
      res.status(404).json("Not found");
  })
}

exports.update_a_trip = async function (req, res) {
  Trip.findById(req.params.tripId, async function (err, trip) {
    if (err)
      res.status(500).send(err)
    else if (trip) {
      let updatedTrip;
      if (!trip.published) {
        updatedTrip = {
          description: req.body.description,
          endDate: req.body.endDate,
          pictures: req.body.pictures,
          requirements: req.body.requirements,
          startDate: req.body.startDate,
          title: req.body.title,
          stages: req.body.stages,
          published: req.body.published
        };
      } else if (trip.state !== 'CANCELLED' && trip.startDate > new Date() && (await Application.count({ trip: trip._id, status: 'ACEPTED' })) === 0)
        updatedTrip = {
          cancelationReason: req.body.cancelationReason,
          state: req.body.state
        };
      else {
        res.status(403).json('Cannot edit that trip');
        return;
      }

      Trip.findOneAndUpdate({ _id: trip._id }, updatedTrip, { new: true }, function (err, trip) {
        if (err)
          res.status(500).send(err)
        else if (trip)
          res.json(trip)
        else
          res.status(404).json("Not found");
      })
    } else
      res.status(404).json("Not found")
  })
}

exports.delete_a_trip = function (req, res) {
  Trip.deleteOne({ _id: req.params.tripId, published: false }, function (err, trip) {
    if (err)
      res.status(500).send(err)
    else if(trip){
      res.status(204).send()
    } else{
      res.status(404).json("Not found");
    }
  })
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
        res.status(500).send(err)
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
      res.status(500).send(err)
    } else {
      return result;
    }
  })

  return result[0];
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

// v2
exports.list_trips_with_auth = async function (req, res) {
  let filter = { published: true };

  if (req.query.keyword) {
    const keyword = req.query.keyword;
    if (keyword.match(KEYWORD_REGEXP))
      filter.$or = [{ ticker: { $regex: keyword } }, { title: { $regex: keyword } }, { descripcion: { $regex: keyword } }];
    else {
      res.status(400).json('A keyword must be just 1 word');
      return;
    }
  }
  if (req.query.mine !== undefined) {
    const user = await authController.getUserId(req.headers.idtoken);
    filter.actor = user._id;
  }
  Trip.find(filter, function (err, trips) {
    if (err)
      res.status(500).send(err)
    else
      res.json(trips)
  })
}

exports.list_trips_by_finder_with_auth = async function (req, res) {
  const user = await authController.getUserId(req.headers.idtoken);

  Finder.findById(req.params.finderId, function (err, finder) {
    if (err)
      res.status(500).send(err)
    else if (finder) {
      if (finder.actor.equals(user._id))
        Trip.find({ _id: { $in: finder.trips } }, function (err, trips) {
          if (err)
            res.status(500).send(err)
          else
            res.json(trips)
        })
      else
        res.status(403).json('You can not see another person\'s finder');
    } else
      res.status(404).json("Not found");
  })
}

exports.create_a_trip_with_auth = async function (req, res) {
  const user = await authController.getUserId(req.headers.idtoken);

  if (user.role === 'MANAGER')
    new Trip({
      actor: user._id,
      description: req.body.description,
      endDate: req.body.endDate,
      pictures: req.body.pictures,
      requirements: req.body.requirements,
      startDate: req.body.startDate,
      title: req.body.title,
      stages: req.body.stages,
      published: req.body.published
    }).save(function (err, trip) {
      if (err)
        res.status(500).send(err)
      else
        res.json(trip)
    })
  else
    res.status(403).json('You do not have permission to do that');
}

exports.read_a_trip_with_auth = async function (req, res) {
  const user = await authController.getUserId(req.headers.idtoken);

  Trip.findById(req.params.tripId, function (err, trip) {
    if (err) {
      res.status(500).send(err)
    } else if (trip) {
      if (trip.published || trip.actor === user._id)
        res.json(trip)
      else
        res.status(403).json('You do not have permission to view that trip');
    } else
      res.status(404).json("Not found");
  })
}

exports.update_a_trip_with_auth = async function (req, res) {
  const user = await authController.getUserId(req.headers.idtoken);

  if (user.role === 'MANAGER')
    Trip.findById(req.params.tripId, async function (err, trip) {
      if (err)
        res.status(500).send(err)
      else {
        if (user._id === trip.actor) {
          let updatedTrip;
          if (!trip.published)
            updatedTrip = {
              description: req.body.description,
              endDate: req.body.endDate,
              pictures: req.body.pictures,
              requirements: req.body.requirements,
              startDate: req.body.startDate,
              title: req.body.title,
              stages: req.body.stages,
              published: req.body.published
            };
          else if (trip.state !== 'CANCELLED' && trip.startDate > new Date() && (await Application.count({ trip: trip._id, status: 'ACEPTED' })) === 0)
            updatedTrip = {
              cancelationReason: req.body.cancelationReason,
              state: req.body.state
            };
          else {
            res.status(403).json('Cannot edit that trip');
            return;
          }

          Trip.findOneAndUpdate({ _id: trip._id }, updatedTrip, { new: true }, function (err, trip) {
            if (err)
              res.status(500).send(err)
            else if (trip)
              res.json(trip)
            else
              res.status(404).json("Not found");
          })
        } else
          res.status(403).json('Cannot edit that trip');
      }
    })
  else
    res.status(403).json('Cannot edit that trip');
}

exports.delete_a_trip_with_auth = async function (req, res) {
  const user = await authController.getUserId(req.headers.idtoken);

  if (user.role === 'MANAGER')
    Trip.findById(req.params.tripId, function (err, trip) {
      if (err)
        res.status(500).send(err)
      else if (trip) {
        if (trip.actor === user._id)
          Trip.deleteOne({ _id: req.params.tripId, published: false }, function (err, trip) {
            if (err)
              res.status(500).send(err)
            else
              res.json({ message: 'Trip successfully deleted' })
          })
        else
          res.status(403).json('Cannot edit that trip');
      } else
        res.status(404).json("Not found");
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