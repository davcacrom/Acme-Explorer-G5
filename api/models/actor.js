'use strict'
const mongoose = require('mongoose')
const validator = require('validator')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

const ActorSchema = new Schema({
  name: {
    type: String,
    required: 'Kindly enter the actor name'
  },
  surname: {
    type: String,
    required: 'Kindly enter the actor surname'
  },
  email: {
    type: String,
    required: 'Kindly enter the actor email',
    unique: true,
    validate: [validator.isEmail, 'Please fill a valid email address']
  },
  preferredLanguage: {
    type: String,
    enum: ['ENGLISH', 'SPANISH'],
    default: 'ENGLISH'
  },
  password: {
    type: String,
    minlength: 5,
    required: 'Kindly enter the actor password'
  },
  phone: {
    type: String
  },
  address: {
    type: String
  },
  role: {
    type: String,
    required: 'Kindly enter the user role(s)',
    enum: ['EXPLORER', 'MANAGER', 'ADMINISTRATOR','SPONSOR']
  },
  active: {
    type: Boolean,
    default: true
  },
  customToken: {
    type: String
  },
  idToken: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  }
}, { strict: false })

ActorSchema.pre('save', function (callback) {
  const actor = this
  // Break out if the password hasn't changed
  if (!actor.isModified('password')) return callback()

  // Password changed so we need to hash it
  bcrypt.genSalt(5, function (err, salt) {
    if (err) return callback(err)

    bcrypt.hash(actor.password, salt, function (err, hash) {
      if (err) return callback(err)
      actor.password = hash
      callback()
    })
  })
})

ActorSchema.methods.verifyPassword = function (password, cb) {
  bcrypt.compare(password, this.password, function (err, isMatch) {
    // console.log('verifying password in actorModel: ' + password)
    if (err) return cb(err)
    // console.log('iMatch: ' + isMatch)
    cb(null, isMatch)
  })
}

module.exports = mongoose.model('Actors', ActorSchema)
