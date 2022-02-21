'use strict'
/* ---------------ACTOR---------------------- */
const mongoose = require('mongoose')
const Finder = mongoose.model('Finders')
const Config = mongoose.model('Configurations')

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
    Finder.findOneAndUpdate({ _id: req.params.finderId }, req.body, { new: true }, function (err, finder) {
        if (err) {
          res.send(err)
        } else {
          res.json(finder)
        }
      })
}

exports.get_dashboard = function (req, res) {
  
}

exports.update_config = function (req, res){
    Config.findOneAndUpdate({ _id: req.params.configId }, req.body, { new: true }, function (err, config) {
        if (err) {
          res.send(err)
        } else {
          res.json(config)
        }
      })
}