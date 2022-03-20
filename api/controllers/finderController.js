'use strict'
/* ---------------ACTOR---------------------- */
const mongoose = require('mongoose')
const Finder = mongoose.model('Finders')
const Config = mongoose.model('Configurations')
const Trip = mongoose.model('Trips')
const CronJob = require('cron').CronJob
const CronTime = require('cron').CronTime
const authController = require('./authController')
const { exists } = require('../models/finder.js')

let rebuildPeriod;
let refreshFindersJob;
let tripsFiltrer;

function createRefreshFindersJob() {
  rebuildPeriod = '* * * * *';
  refreshFindersJob = new CronJob(rebuildPeriod, function () {
    Config.find({}, function (err, res) {
      if (err) {
        console.log(err);
      } else {
        Finder.updateMany({ lastUpdate: { $lt: new Date(), $gte: new Date(new Date().getTime() - res[0].cachedPeriod * 60 * 60 * 1000) } }, { trips: [] }, function (err, res) {
          if (err) {
            console.log(err);
          }
          console.log("Refreshing");
          console.log(res.modifiedCount);
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
      for (var i = 0; i < tripsFiltrer.length; i++) {
        if (!(tripsFiltrer[i].price < req.body.maxPrice && tripsFiltrer[i].price > req.body.minPrice)) {
          await delete tripsFiltrer[i];
        } else {
          if (!(req.body.keyword === "") && !(tripsFiltrer[i].title.includes(req.body.keyword)
            || tripsFiltrer[i].ticker.includes(req.body.keyword) || tripsFiltrer[i].description.includes(req.body.keyword))) {
            await delete tripsFiltrer[i];
          }
        }
      }
      var results = [];
      tripsFiltrer.forEach(element => {
        if (element !== undefined) {
          results.push(element);
        }
      });
      await Config.find({}, async function (err, res) {
        if (err) {
          console.log(err);
        } else {
          results = await results.slice(0, res[0].numberResults);
          await Finder.findOneAndUpdate({ _id: req.params.finderId }, {
            lastUpdate: req.body.lastUpdate,
            endDate: req.body.endDate, keyword: req.body.keyword,
            maxPrice: req.body.maxPrice, minPrice: req.body.minPrice, startDate: req.body.startDate, $set: { trips: results },
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



exports.read_a_finder_with_auth = async function (req, res) {
  const idToken = req.headers.idtoken
  const authenticatedUser = await authController.getUserId(idToken);
  const resFinder = await Finder.findById(req.params.finderId);
  if (authenticatedUser != null) {
    if (authenticatedUser._id == resFinder.actor.toString()) {
      Finder.findById(req.params.finderId, async function (err, finder) {
        if (err) {
          res.send(err)
        } else {
          res.json(finder)
        }
      })
    } else {
      res.status(405); // Not allowed
      res.send('Read a finder of other actor is not allowed.');
    }
  } else {
    res.status(401); // Not allowed
    res.send('The Actor is not authenticated');
  }
}

exports.update_a_finder_with_auth = async function (req, res) {
  const idToken = req.headers.idtoken
  const authenticatedUser = await authController.getUserId(idToken);
  const resFinder = await Finder.findById(req.params.finderId);
  if (authenticatedUser != null) {
    if (authenticatedUser._id == resFinder.actor.toString()) {
      req.body['lastUpdate'] = new Date();
      await Trip.find({ published: true, endDate: { $lt: new Date(req.body.endDate) }, startDate: { $gte: new Date(req.body.startDate) } }, async function (err, trips) {
        if (err) {
          res.send(err)
        } else {
          tripsFiltrer = trips;
          for (var i = 0; i < tripsFiltrer.length; i++) {
            if (!(tripsFiltrer[i].price < req.body.maxPrice && tripsFiltrer[i].price > req.body.minPrice)) {
              await delete tripsFiltrer[i];
            } else {
              if (!(req.body.keyword === "") && !(tripsFiltrer[i].title.includes(req.body.keyword)
                || tripsFiltrer[i].ticker.includes(req.body.keyword) || tripsFiltrer[i].description.includes(req.body.keyword))) {
                await delete tripsFiltrer[i];
              }
            }
          }
          var results = [];
          tripsFiltrer.forEach(element => {
            if (element !== undefined) {
              results.push(element);
            }
          });
          await Config.find({}, async function (err, configuration) {
            if (err) {
              console.log(err);
            } else {
              results = await results.slice(0, configuration[0].numberResults);
              await Finder.findOneAndUpdate({ _id: req.params.finderId }, {
                lastUpdate: req.body.lastUpdate,
                endDate: req.body.endDate, keyword: req.body.keyword,
                maxPrice: req.body.maxPrice, minPrice: req.body.minPrice, startDate: req.body.startDate, $set: { trips: results },
              }, { new: true }, async function (err, finder) {
                if (err) {
                  res.send(err)
                } else {
                  console.log(finder);
                  res.json(finder)
                }
              }).clone().catch(async function (err) { console.log(err) })
            }
          }
          ).clone().catch(async function (err) { console.log(err) })
        }
      }
      ).clone().catch(async function (err) { console.log(err) })

    }
    else {
      res.status(405); // Not allowed
      res.send('Update a finder of other actor is not allowed.');
    }
  } else {
    res.status(401); // Not allowed
    res.send('The Actor is not authenticated');
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
      console.log(err)
      res.send(err)
    } else {
      res.json(dashboard[0].data)
    }
  })
}

exports.get_dashboard_with_auth = async function (req, res) {
  const idToken = req.headers.idtoken
  const authenticatedUser = await authController.getUserId(idToken);
  if (authenticatedUser != null) {
    if (authenticatedUser.role == 'ADMINISTRATOR') {
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
          console.log(err)
          res.send(err)
        } else {
          res.json(dashboard[0].data)
        }
      })
    }
    else {
      res.status(403); // Not allowed
      res.send('Only administrators can update the configuration.');
    }
  } else {
    res.status(401); // Not allowed
    res.send('The Actor is not authenticated');
  }
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

exports.update_config_with_auth = async function (req, res) {
  const idToken = req.headers.idtoken
  const authenticatedUser = await authController.getUserId(idToken);
  if (authenticatedUser != null) {
    if (authenticatedUser.role == 'ADMINISTRATOR') {
      await Config.findOneAndUpdate({ _id: req.params.configId }, req.body, { new: true }, async function (err, config) {
        if (err) {
          res.send(err)
        } else {
          res.json(config)
        }
      })
    }
    else {
      res.status(403); // Not allowed
      res.send('Only administrators can update the configuration.');
    }
  } else {
    res.status(401); // Not allowed
    res.send('The Actor is not authenticated');
  }
}