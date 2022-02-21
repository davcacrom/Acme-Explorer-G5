'use strict'
/* ---------------ACTOR---------------------- */
const mongoose = require('mongoose')
const Application = mongoose.model('Applications')

exports.list_all_applications = function (req, res) {
    Application.find({}, function (err, applications) {
        if (err) {
          res.send(err)
        } else {
          res.json(applications)
        }
      })
}

exports.create_an_application = function (req, res) {
    const newApplication = new Application(req.body)
    newApplication.save(function (err, application) {
        if (err) {
        res.send(err)
        } else {
        res.json(application)
        }
    })
}

exports.read_an_application = function (req, res) {
    Application.findById(req.params.applicationId, function (err, application) {
        if (err) {
          res.send(err)
        } else {
          res.json(application)
        }
      })
}

exports.update_an_application = function (req, res) {
    Application.findOneAndUpdate({ _id: req.params.applicationId }, req.body, { new: true }, function (err, application) {
        if (err) {
          res.send(err)
        } else {
          res.json(application)
        }
      })
}

exports.delete_an_application = function (req, res) {
    Application.deleteOne({ _id: req.params.applicationId }, function (err, application) {
        if (err) {
          res.send(err)
        } else {
          res.json({ message: 'Application successfully deleted' })
        }
      })
}

exports.list_applications_by_user = function (req, res) {
    Application.findOne({ user: req.params.userId }, req.body, { new: true }, function (err, application) {
        if (err) {
          res.send(err)
        } else {
          res.json(application)
        }
      })
}
