'use strict'
/* ---------------ACTOR---------------------- */
const mongoose = require('mongoose')
const Finder = mongoose.model('Finders')
const Config = mongoose.model('Configurations')
const Trip = mongoose.model('Trips')
const CronJob = require('cron').CronJob
const CronTime = require('cron').CronTime
var logger = require('../../logger.js')

let rebuildPeriod;
let refreshFindersJob;
let tripsFiltrer;

function createRefreshFindersJob() {
  rebuildPeriod = '* * * * *';
  refreshFindersJob = new CronJob(rebuildPeriod, function () {
    Config.find({}, function (err, res) {
      if (err) {
        logger.error(err);
      } else {
        Finder.updateMany({ lastUpdate: { $lt: new Date(), $gte: new Date(new Date().getTime() - res[0].cachedPeriod * 60 * 60 * 1000) } }, { trips: [] }, function (err, res) {
          if (err) {
            logger.error(err);
          }
          logger.info("Refreshing");
          logger.info(res.modifiedCount);
        })
      }
    })

  }, null, true, "Europe/Madrid");

}

module.exports.createRefreshFindersJob = createRefreshFindersJob;
exports.read_a_finder = function (req, res) {
  Finder.findById(req.params.finderId, function (err, finder) {
    if (err) {
      res.send(err)
    } else {
      res.json(finder)
    }
  })
}

exports.update_a_finder = async function (req, res1) {
  req.body['lastUpdate'] = new Date();
  await Trip.find({ published: true, endDate: { $lt: new Date(req.body.endDate) }, startDate: { $gte: new Date(req.body.startDate) } }, async function (err, trips) {
    if (err) {
      res1.send(err)
    } else {
      tripsFiltrer = trips;
      console.log(tripsFiltrer.length);
      //cambiar for por for each in 
      for (var i = 0; i < tripsFiltrer.length; i++) {
        if (!(tripsFiltrer[i].price < req.body.maxPrice && tripsFiltrer[i].price > req.body.minPrice)) {
          tripsFiltrer = await tripsFiltrer.splice(i, 1);
        } else {
          if (!tripsFiltrer[i].title.includes(req.body.keyword) || !tripsFiltrer[i].ticker.includes(req.body.keyword) || !tripsFiltrer[i].description.includes(req.body.keyword)) {
          tripsFiltrer = await tripsFiltrer.splice(i, 1);
          }
        }
      }

      console.log(tripsFiltrer.length);
      await Config.find({}, async function (err, res) {
        if (err) {
          logger.error(err);
        } else {
          tripsFiltrer = await tripsFiltrer.slice(0, res[0].numberResults);
          console.log(res[0].numberResults)
          console.log(tripsFiltrer[0].price)
          console.log(typeof (tripsFiltrer[0].price))
          await Finder.findOneAndUpdate({ _id: req.params.finderId }, {
            lastUpdate: req.body.lastUpdate,
            endDate: req.body.endDate, keyword: req.body.keyword,
            maxPrice: req.body.maxPrice, minPrice: req.body.minPrice, startDate: req.body.startDate, $set: { trips: tripsFiltrer },
          }, { new: true }, async function (err, finder) {
            if (err) {
              res1.send(err)
            } else {
              res1.json(finder)
            }
          }).clone().catch(async function (err) { console.log(err) })
        }
      }
      ).clone().catch(async function (err) { console.log(err) })
    }
  }
  ).clone().catch(async function (err) { console.log(err) })
}




exports.update_a_finder_with_auth = async function (req, res) {
  const idToken = req.headers.idtoken
  const authenticatedUser = await authController.getUserId(idToken);
  if (authenticatedUser != null) {
    if (authenticatedUser._id == req.params.actorId || authenticatedUser.role == 'ADMINISTRATOR') {
      req.body['lastUpdate'] = new Date();
      Finder.findOneAndUpdate({ _id: req.params.finderId }, req.body, { new: true }, function (err, finder) {
        if (err) {
          res.send(err)
        } else {
          res.json(finder)
        }
      })
    }
    else {
      res.status(405); // Not allowed
      res.send('Update a finder of other actor is not allowed.');
    }
  } else {
    res.status(405); // Not allowed
    res.send('The Actor does not exist');
  }
}

exports.get_dashboard = function (req, res) {
  Finder.aggregate([[{
    $facet: {
      "Top": [{ $match: { "keyword": { "$exists": true, "$ne": null } } }, { $group: { _id: { keyword: "$keyword" }, count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $group: { _id: "topWords", top_keywords: { $push: "$_id.keyword" } } }, {
        $project: {
          _id: 0, top_keywords:
            { $slice: ["$top_keywords", 10] }
        }
      }], "AvgRange": [{ $group: { _id: "dashboard", avgPriceRangeLow: { $avg: "$minPrice" }, avgPriceRangeHigh: { $avg: "$maxPrice" } } }, { $project: { _id: 0 } }]
    }
  },
  { $project: { "data": { $concatArrays: ["$Top", "$AvgRange"] } } }]], function (err, dashboard) {
    if (err) {
      logger.error(err)
      res.send(err)
    } else {
      res.json(dashboard[0].data)
    }
  })
}

exports.update_config = function (req, res) {
  Config.findOneAndUpdate({ _id: req.params.configId }, req.body, { new: true }, function (err, config) {
    if (err) {
      res.send(err)
    } else {
      res.json(config)
    }
  })
}