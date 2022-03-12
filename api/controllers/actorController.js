'use strict'
/* ---------------ACTOR---------------------- */
const mongoose = require('mongoose')
const Finder = require('../models/finder')
const Actor = mongoose.model('Actors')
const admin = require('firebase-admin')
const authController = require('./authController')

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
  const newFinder = new Finder()
  newFinder.actor = newActor._id;
  newActor.save(function (err, actor) {
    if (err) {
      res.send(err)
    } else {
      newFinder.save(function (err, finder) {
        if (err) {
          res.send(err)
        } else {
          res.json({ actor: actor, finder: finder })
        }
      })
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

exports.login_an_actor = async function (req, res) {
  console.log('starting login an actor')
  const emailParam = req.query.email
  const password = req.query.password
  let customToken

  Actor.findOne({ email: emailParam }, function (err, actor) {
    if (err) { // No actor found with that email as username
      res.send(err)
    } else if (!actor) { // an access token isn’t provided, or is invalid
      res.status(401)
      res.json({ message: 'forbidden', error: err })
    } else if ((actor.role.includes('EXPLORER')) && (actor.validated === false)) { // an access token is valid, but requires more privileges
      res.status(403)
      res.json({ message: 'forbidden', error: err })
    } else {
      // Make sure the password is correct
      actor.verifyPassword(password, async function (err, isMatch) {
        if (err) {
          res.send(err)
        } else if (!isMatch) { // Password did not match
          res.status(401) // an access token isn’t provided, or is invalid
          res.json({ message: 'forbidden', error: err })
        } else {
          try {
            customToken = await admin.auth().createCustomToken(actor.email)
          } catch (error) {
            console.log('Error creating custom token:', error)
          }
          actor.customToken = customToken
          res.json(actor)
        }
      })
    }
  })
}

exports.update_a_verified_actor = function (req, res) {
  // Managers and Explorers can update theirselves, administrators can update any actor
  console.log('Starting to update the verified actor...')
  Actor.findById(req.params.actorId, async function (err, actor) {
    if (err) {
      res.send(err)
    } else {
      console.log('actor: ' + actor)
      const idToken = req.headers.idtoken // WE NEED the FireBase custom token in the req.header... it is created by FireBase!!
      if (actor.role.includes('MANAGER') || actor.role.includes('EXPLORER')) {
        const authenticatedUser = await authController.getUserId(idToken)
        const authenticatedUserId = authenticatedUser._id

        if (authenticatedUserId == req.params.actorId) {
          Actor.findOneAndUpdate({ _id: req.params.actorId }, req.body, { new: true }, function (err, actor) {
            if (err) {
              res.send(err)
            } else {
              res.json(actor)
            }
          })
        } else {
          res.status(403) // Auth error
          res.send('The Actor is trying to update an Actor that is not himself!')
        }
      } else if (actor.role.includes('ADMINISTRATOR')) {
        Actor.findOneAndUpdate({ _id: req.params.actorId }, req.body, { new: true }, function (err, actor) {
          if (err) {
            res.send(err)
          } else {
            res.json(actor)
          }
        })
      } else {
        res.status(405) // Not allowed
        res.send('The Actor has unidentified roles')
      }
    }
  })
}