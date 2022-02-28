'use strict'
/* ---------------ACTOR---------------------- */
const mongoose = require('mongoose')
const Trip = mongoose.model('Trips')
const Application = mongoose.model('Applications')
const Finder = mongoose.model('Finders')
const math=require('mathjs')

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
  var tripsByManager={};
  var applicationsTrip={};
  var pricessTrip={};
  var ratioApplication={};

  // Trips by manager
  await Trip.aggregate([
    { "$group": { _id: "$actor", total: { $sum:1}}}
  ], function (err, actors) {
    if (err) {
      console.log(err)
      res.send(err)
    } else {
      var totals=actors.map(item => item.total);
      var min = Math.min.apply(null, totals),
        max = Math.max.apply(null, totals),
        mean = math.mean(totals),
        std = math.std(totals);

      tripsByManager["max"]=max;
      tripsByManager["min"]=min;
      tripsByManager["mean"]=mean;
      tripsByManager["std"]=std;
    }
  })

  // number of applications per trip
  await Trip.aggregate([
    { "$group": {
      "_id": "$_id",
      "total": { "$sum": { "$size": "$stages" } }
  }}
  ], function (err, trips) {
    if (err) {
      console.log(err)
      res.send(err)
    } else {
      var totals=trips.map(item => item.total);
      var min = Math.min.apply(null, totals),
        max = Math.max.apply(null, totals),
        mean = math.mean(totals),
        std = math.std(totals);

      applicationsTrip["max"]=max;
      applicationsTrip["min"]=min;
      applicationsTrip["mean"]=mean;
      applicationsTrip["std"]=std;
    }
  })

  // price per trip
  await Trip.aggregate([
    { "$group": {
      "_id": "$_id",
      "total": { "$sum": { "$sum": "$stages.price" } }
    }}
  ], function (err, trips) {
    if (err) {
      console.log(err)
      res.send(err)
    } else {
      var totals=trips.map(item => item.total);
      var min = Math.min.apply(null, totals),
        max = Math.max.apply(null, totals),
        mean = math.mean(totals),
        std = math.std(totals);

      pricessTrip["max"]=max;
      pricessTrip["min"]=min;
      pricessTrip["mean"]=mean;
      pricessTrip["std"]=std;
    }
  })

  // price per trip
  var totalDocument = await Application.count()
  await Application.aggregate([
    { "$group": { _id: "$status", total: { $sum:1}}},
    { "$project": { 
      "total": 1, 
      "percentage": { 
          "$concat": [ { "$substr": [ { "$multiply": [ { "$divide": [ "$total", {"$literal": totalDocument }] }, 100 ] }, 0,2 ] }, "", "%" ]}
      }
    }
  ], function (err, applications) {
    if (err) {
      console.log(err)
      res.send(err)
    } else {
      ratioApplication=applications
    }
  })

  var result={
    "tripsByManager":tripsByManager,
    "applicationsTrip":applicationsTrip,
    "pricessTrip":pricessTrip,
    "ratioApplication":ratioApplication
  }

  res.send(result);
}
