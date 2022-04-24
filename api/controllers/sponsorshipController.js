'use strict'

const mongoose = require('mongoose')
const Sponsorship = mongoose.model('Sponsorships')
const Actor = mongoose.model('Actors')
const authController = require('./authController')

exports.list_my_sponsorships = function (req, res) {
  Sponsorship.find({ sponsor: req.params.sponsorId }, function (err, sponsorships) {
    if (err) {
      res.status(500).send(err)
    } else {
      res.json(sponsorships)
    }
  })
}

exports.list_my_sponsorships_verified = function (req, res) {
  const idToken = req.headers.idtoken

  authController.getUserId(idToken).then(function (loggedUser) {
    Actor.findById(loggedUser, function (err, actor) {
      if (err) {
        res.status(500).send(err)
      } else {
        if (actor) {
          if (actor.roles.includes('SPONSOR')) {
            Sponsorship.find({ sponsor: loggedUser }, function (err, sponsorships) {
              if (err) {
                res.status(500).send(err)
              } else {
                res.json(sponsorships)
              }
            })
          } else {
            res.status(405).send('The Actor has unidentified roles') // Not allowed
          }
        } else {
          res.status(404).send('Cannot find actor')
        }
      }
    })
  })
}

exports.create_a_sponsorship = function (req, res) {
  const newSponsorship = new Sponsorship(req.body)
  newSponsorship.save(function (err, sponsorship) {
    if (err) {
      if (err.name === 'ValidationError') {
        res.status(422).send(err)
      } else {
        res.status(500).send(err)
      }
    } else {
      res.json(sponsorship)
    }
  })
}

exports.create_a_sponsorship_verified = function (req, res) {
  const idToken = req.headers.idtoken

  authController.getUserId(idToken).then(function (loggedUser) {
    Actor.findById(loggedUser, function (err, actor) {
      if (err) {
        res.status(500).send(err)
      } else {
        if (actor) {
          if (actor.roles.includes('SPONSOR')) {
            const newSponsorship = new Sponsorship(req.body)
            newSponsorship.save(function (err, sponsorship) {
              if (err) {
                if (err.name === 'ValidationError') {
                  res.status(422).send(err)
                } else {
                  res.status(500).send(err)
                }
              } else {
                res.json(sponsorship)
              }
            })
          } else {
            res.status(405).send('The Actor has unidentified roles') // Not allowed
          }
        } else {
          res.status(404).send('Cannot find actor')
        }
      }
    })
  })
}

exports.read_a_sponsorship = function (req, res) {
  Sponsorship.findById(req.params.sponsorshipId, function (err, sponsorship) {
    if (err) {
      res.status(500).send(err)
    } else {
      res.json(sponsorship)
    }
  })
}

exports.read_a_sponsorship_verified = function (req, res) {
  const idToken = req.headers.idtoken

  authController.getUserId(idToken).then(function (loggedUser) {
    Actor.findById(loggedUser, function (err, actor) {
      if (err) {
        res.status(500).send(err)
      } else {
        if (actor) {
          if (actor.roles.includes('SPONSOR')) {
            Sponsorship.findById(req.params.sponsorshipId, function (err, sponsorship) {
              if (err) {
                res.status(500).send(err)
              } else if (sponsorship.sponsor !== loggedUser) {
                res.status(405).send('The Actor has unidentified roles') // Not allowed
              } else {
                res.json(sponsorship)
              }
            })
          } else {
            res.status(405).send('The Actor has unidentified roles') // Not allowed
          }
        } else {
          res.status(404).send('Cannot find actor')
        }
      }
    })
  })
}

exports.update_a_sponsorship = function (req, res) {
  Sponsorship.findOneAndUpdate({ _id: req.params.sponsorshipId }, req.body, { new: true }, function (err, sponsorship) {
    if (err) {
      if (err.name === 'ValidationError') {
        res.status(422).send(err)
      } else {
        res.status(500).send(err)
      }
    } else {
      res.json(sponsorship)
    }
  })
}

exports.update_a_sponsorship_verified = function (req, res) {
  const idToken = req.headers.idtoken

  authController.getUserId(idToken).then(function (loggedUser) {
    Actor.findById(loggedUser, function (err, actor) {
      if (err) {
        res.status(500).send(err)
      } else {
        if (actor) {
          if (actor.roles.includes('SPONSOR')) {
            Sponsorship.findById(req.params.sponsorship, function (err, sponsorship) {
              if (err) {
                res.status(500).send(err)
              } else if (sponsorship.sponsor !== loggedUser) {
                res.status(405).send('The Actor has unidentified roles') // Not allowed
              } else {
                Sponsorship.findOneAndUpdate({ _id: req.params.sponsorshipId }, req.body, { new: true }, function (err, sponsorship) {
                  if (err) {
                    if (err.name === 'ValidationError') {
                      res.status(422).send(err)
                    } else {
                      res.status(500).send(err)
                    }
                  } else {
                    res.json(sponsorship)
                  }
                })
              }
            })
          } else {
            res.status(405).send('The Actor has unidentified roles') // Not allowed
          }
        } else {
          res.status(404).send('Cannot find actor')
        }
      }
    })
  })
}

exports.delete_a_sponsorship = function (req, res) {
  Sponsorship.findById(req.params.sponsorshipId, function (err, sponsorship) {
    if (err) {
      res.status(500).send(err)
    } else {
      if (sponsorship) {
        Sponsorship.deleteOne({ _id: req.params.sponsorshipId }, function (err, sponsorship) {
          if (err) {
            res.status(500).send(err)
          } else {
            res.json({ message: 'Sponsorship successfully deleted' })
          }
        })
      } else {
        res.status(404).send('Sponsorship not found')
      }
    }
  })
}

exports.delete_a_sponsorship_verified = function (req, res) {
  const idToken = req.headers.idtoken

  authController.getUserId(idToken).then(function (loggedUser) {
    Actor.findById(loggedUser, function (err, actor) {
      if (err) {
        res.status(500).send(err)
      } else {
        if (actor) {
          if (actor.roles.includes('SPONSOR')) {
            Sponsorship.findById(req.params.sponsorship, function (err, sponsorship) {
              if (err) {
                res.status(500).send(err)
              } else if (sponsorship.sponsor !== loggedUser) {
                res.status(405).send('The Actor has unidentified roles') // Not allowed
              } else {
                Sponsorship.deleteOne({ _id: req.params.sponsorshipId }, function (err, sponsorship) {
                  if (err) {
                    res.status(500).send(err)
                  } else {
                    res.json({ message: 'Sponsorship successfully deleted' })
                  }
                })
              }
            })
          } else {
            res.status(405).send('The Actor has unidentified roles') // Not allowed
          }
        } else {
          res.status(404).send('Cannot find actor')
        }
      }
    })
  })
}

exports.pay_a_sponsorship = function (req, res) {
  console.log('Pay a sponsorship with id: ' + req.params.sponsorshipId)
  Sponsorship.findOneAndUpdate(
    { _id: req.params.sponsorshipId },
    { $set: { isPaid: true } },
    { new: true },
    function (err, sponsorship) {
      if (err) {
        res.status(500).send(err)
      } else {
        res.json(sponsorship)
      }
    }
  )
}

exports.pay_a_sponsorship_verified = function (req, res) {
  const idToken = req.headers.idtoken

  authController.getUserId(idToken).then(function (loggedUser) {
    Actor.findById(loggedUser, function (err, actor) {
      if (err) {
        res.status(500).send(err)
      } else {
        if (actor) {
          if (actor.roles.includes('SPONSOR')) {
            Sponsorship.findById(req.params.sponsorship, function (err, sponsorship) {
              if (err) {
                res.status(500).send(err)
              } else if (sponsorship.sponsor !== loggedUser) {
                res.status(405).send('The Actor has unidentified roles') // Not allowed
              } else {
                console.log('Pay a sponsorship with id: ' + req.params.sponsorshipId)
                Sponsorship.findOneAndUpdate(
                  { _id: req.params.sponsorshipId },
                  { $set: { isPaid: true } },
                  { new: true },
                  function (err, sponsorship) {
                    if (err) {
                      res.status(500).send(err)
                    } else {
                      res.json(sponsorship)
                    }
                  }
                )
              }
            })
          } else {
            res.status(405).send('The Actor has unidentified roles') // Not allowed
          }
        } else {
          res.status(404).send('Cannot find actor')
        }
      }
    })
  })
}

exports.get_random_sponsorship = function (req, res) {
  const tripId = req.params.tripId
  Sponsorship.find({ isPaid: true, trip: tripId }).count().exec(function (err, count) {
    if (err) {
      res.status(500).send(err)
    } else {
      const random = Math.floor(Math.random() * count)
      Sponsorship.findOne({ isPaid: true, trip: tripId }).skip(random).exec(
        function (err, result) {
          if (err) {
            res.status(500).send(err)
          } else {
            res.json(result)
          }
        }
      )
    }
  })
}
