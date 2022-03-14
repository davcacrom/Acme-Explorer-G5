'use strict'
/* ---------------ACTOR---------------------- */
const mongoose = require('mongoose')
const Finder = mongoose.model('Finders')
const Config = mongoose.model('Configurations')
const CronJob = require('cron').CronJob
const CronTime = require('cron').CronTime
var logger = require('../../logger.js')

let rebuildPeriod;
let refreshFindersJob;

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

exports.update_a_finder = function (req, res) {
  req.body['lastUpdate'] = new Date();
  Finder.findOneAndUpdate({ _id: req.params.finderId }, req.body, { new: true }, function (err, finder) {
    if (err) {
      res.send(err)
    } else {
      res.json(finder)
    }
  })
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
