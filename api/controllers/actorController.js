'use strict'
/* ---------------ACTOR---------------------- */
const mongoose = require('mongoose')
const Actor = mongoose.model('Actors')

exports.list_all_actors = function (req, res) {
  Actor.find({}, function (err, actors) {
    if (err) {
      res.send(err)
    } else {
      res.json(actors)
    }
  })
}

exports.create_an_actor = function (req, res) {
  const newActor = new Actor(req.body)
  newActor.save(function (err, actor) {
    if (err) {
      res.send(err)
    } else {
      res.json(actor)
    }
  })
}

exports.read_an_actor = function (req, res) {
  Actor.findById(req.params.actorId, function (err, actor) {
    if (err) {
      res.send(err)
    } else {
      res.json(actor)
    }
  })
}

exports.update_an_actor = function (req, res) {
  Actor.findOneAndUpdate({ _id: req.params.actorId }, req.body, { new: true }, function (err, actor) {
    if (err) {
      res.send(err)
    } else {
      res.json(actor)
    }
  })
}

exports.delete_an_actor = function (req, res) {
  Actor.deleteOne({ _id: req.params.actorId }, function (err, actor) {
    if (err) {
      res.send(err)
    } else {
      res.json({ message: 'Actor successfully deleted' })
    }
  })
}
