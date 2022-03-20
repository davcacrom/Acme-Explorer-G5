'use strict'
/* ---------------ACTOR Auth---------------------- */
const mongoose = require('mongoose')
const Actor = mongoose.model('Actors')
const admin = require('firebase-admin')

exports.getUserId = async function (idToken) {
  console.log('idToken: ' + idToken)

  const actorFromFB = await admin.auth().verifyIdToken(idToken)
  const uid = actorFromFB.uid
  const authTime = actorFromFB.auth_time
  const exp = actorFromFB.exp
  console.log('idToken verificado para el uid: ' + uid)
  console.log('auth_time: ' + authTime)
  console.log('exp: ' + exp)

  const mongoActor = await Actor.findOne({ email: uid })
  if (!mongoActor) {
    return null
  } else {
    console.log('The actor exists in our DB')
    console.log('actor: ' + mongoActor)
    return mongoActor
  }
}

exports.verifyUser = function (requiredRoles) {
  return function (req, res, callback) {
    console.log('starting verifying idToken')
    console.log('requiredRoles: ' + requiredRoles)
    const idToken = req.headers.idtoken
    console.log('idToken: ' + idToken)

    admin.auth().verifyIdToken(idToken).then(function (decodedToken) {
      console.log('entra en el then de verifyIdToken: ')

      const uid = decodedToken.uid
      const authTime = decodedToken.auth_time
      const exp = decodedToken.exp
      console.log('idToken verificado para el uid: ' + uid)
      console.log('auth_time: ' + authTime)
      console.log('exp: ' + exp)

      Actor.findOne({ email: uid }, function (err, actor) {
        if (err) {
          res.send(err)
        } else if (!actor) { // No actor found with that email as username
          res.status(401) // an access token isn’t provided, or is invalid
          res.json({ message: 'No actor found with the provided email as username', error: err })
        } else {
          console.log('The actor exists in our DB')
          console.log('actor: ' + actor)
          let isAuth = false
          for (let i = 0; i < requiredRoles.length; i++) {
              if (requiredRoles[i] === actor.role) {
                if (requiredRoles[i] === 'EXPLORER') {
                  if (actor.active === true) isAuth = true
                } else {
                  isAuth = true
                }
            }
          }
          if (isAuth) {
            return callback(null, actor)
          } else {
            res.status(403) // an access token is valid, but requires more privileges
            res.json({ message: 'The actor has not the required roles', error: err })
          }
        }
      })
    }).catch(function (err) {
      // Handle error
      console.log('Error en autenticación: ' + err)
      res.status(403) // an access token is valid, but requires more privileges
      res.json({ message: 'The actor has not the required roles', error: err })
    })
  }
}
