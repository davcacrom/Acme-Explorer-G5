'use strict'
/* ---------------ACTOR---------------------- */
const mongoose = require('mongoose')
const Trip = mongoose.model('Trips')
const Application = mongoose.model('Applications')
const Finder = mongoose.model('Finders')
const math=require('mathjs')
const async= require("async");

exports.list_all_trips = function (req, res) {
  Trip.find({}, function (err, trips) {
    if (err) {
      res.send(err)
    } else {
      res.json(trips)
    }
  })
}

exports.list_trips_by_finder = function (req, res) {
    Finder.find({finder: req.params.finderId}, function (err, finder) {
      if (err) {
        res.send(err)
      } else {
        res.json(finder.trips)
      }
    })
}

exports.create_a_trip = function (req, res) {
  const newTrip = new Trip(req.body);
  newTrip.save(function (err, trip) {
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
      res.json(trip)
    }
  })
}

exports.update_a_trip = function (req, res) {
  Trip.findOneAndUpdate({ _id: req.params.tripId }, req.body, { new: true }, function (err, trip) {
    if (err) {
      res.send(err)
    } else {
      res.json(trip)
    }
  })
}

exports.delete_a_trip = function (req, res) {
  Trip.deleteOne({ _id: req.params.tripId }, function (err, trip) {
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
    function(err,results){
        if(err){
            throw err
        }else{
            var result={}
            result["applicationsTrip"]= results[0]["applicationsTrip"][0];
            result["tripsByManager"]= results[1]["tripsByManager"][0];
            result["pricesTrip"]= results[1]["pricesTrip"][0];
            result["ratioApplication"]= results[0]["ratioApplication"];
            res.send(result);
        }
    }
  )
}

async function applicationDashboard(){
  
  var totalDocument = await Application.count()
  var result= await  Application.aggregate([{
    $facet: {
      "applicationsTrip":[
        { $group: { _id: '$trip', count: { $sum: 1 } } },
        { $group: { _id: null, average: { $avg: '$count' }, max: { $max: '$count' }, min: { $min: '$count' }, std: { $stdDevSamp: '$count' } } },
        { $project: { _id: 0, average: 1, max: 1, min: 1, std: 1 } }
      ],
      "ratioApplication":[
        { "$group": { _id: "$status", total: { $sum:1}}},
        { "$project": { 
          "total": 1, 
          "percentage": { 
              "$concat": [ { "$substr": [ { "$multiply": [ { "$divide": [ "$total", {"$literal": totalDocument }] }, 100 ] }, 0,2 ] }, "", "%" ]}
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

async function tripsDashboard(){ 
    // Trips by manager
    var result= await Trip.aggregate([{
      $facet: {
        "tripsByManager":[
          { $group: { _id: "$actor", count: { $sum:1}}},
          { $group: { _id: null, average: { $avg: '$count' }, max: { $max: '$count' }, min: { $min: '$count' }, std: { $stdDevSamp: '$count' } } },
          { $project: { _id: 0, average: 1, max: 1, min: 1, std: 1 } }
        ],
        "pricesTrip":[
          { $group: {
            _id: '$_id',
            sum: { $sum: { $sum: "$stages.price" } }
          }},
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
