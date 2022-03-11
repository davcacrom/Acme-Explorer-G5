'use strict'
/* ---------------ACTOR---------------------- */
const mongoose = require('mongoose')
const Trip = require('../models/trip')
const Application = mongoose.model('Applications')
const authController = require('./authController')
var groupBy = require('group-by');

exports.list_all_applications = function (req, res) {
  Application.find({}, function (err, applications) {
      if (err) {
        res.send(err)
      } else {
        res.json(applications)
      }
    })
}

exports.list_all_applications_with_auth = async function (req, res) {
  const idToken = req.headers.idtoken // WE NEED the FireBase custom token in the req.header... it is created by FireBase!!
  const authenticatedUser = await authController.getUserId(idToken);
  if (authenticatedUser.role=='MANAGER') {
    Application.find({}, function (err, applications) {
        if (err) {
          res.send(err)
        } else {
          res.json(applications)
        }
      })
  }else{
    res.status(405); // Not allowed
    res.send('The Actor has unidentified roles');
  }
}

exports.create_an_application = async function (req, res) {
  Trip.findById(req.params.tripId, function (err, trip) {
    if(err){
      throw err
    }else{
      var startDate = Date.parse(trip.startDate);

      if(trip.published!=true){
        res.send("The trip is not published");

      }else if(startDate < Date.now() ){
        res.send("The trip you are trying to apply for has already started");

      }else if(trip.state=="CANCELLED"){
        res.send("The trip is cancelled");

      }else{
        req.body["trip"]=req.params.tripId;
        const newApplication = new Application(req.body)
        newApplication.save(function (err, application) {
            if (err) {
            res.send(err)
            } else {
            res.json(application)
            }
        })
      }
    }
  })
}

exports.create_an_application_with_auth = async function (req, res) {
  const idToken = req.headers.idtoken // WE NEED the FireBase custom token in the req.header... it is created by FireBase!!
  const authenticatedUser = await authController.getUserId(idToken);
  if (authenticatedUser.role=='EXPLORER') {
    await Trip.findById(req.params.tripId, function (err, trip) {
      if(err){
        throw err
      }else{
        var startDate = Date.parse(trip.startDate);

      if(trip.published!=true){
        res.send("The trip is not published");

      }else if(startDate < Date.now() ){
        res.send("The trip you are trying to apply for has already started");

      }else if(trip.state=="CANCELLED"){
        res.send("The trip is cancelled");

      }else{
        req.body["trip"]=req.params.tripId;
        const newApplication = new Application(req.body)
        newApplication.save(function (err, application) {
            if (err) {
            res.send(err)
            } else {
            res.json(application)
            }
        })
      }
      }
    })
  } else {
    res.status(405); // Not allowed
    res.send('The Actor has unidentified roles');
  }
}

exports.read_an_application = async function (req, res) {
  Application.findById(req.params.applicationId, function (err, application) {
    if (err) {
      res.send(err)
    } else {
      res.json(application)
    }
  })
}

exports.read_an_application_with_auth = async function (req, res) {
  const idToken = req.headers.idtoken // WE NEED the FireBase custom token in the req.header... it is created by FireBase!!
  const authenticatedUser = await authController.getUserId(idToken)
  if (authenticatedUser.role=='EXPLORER') {
    Application.findById(req.params.applicationId, function (err, application) {
        if (err) {
          res.send(err)
        } else {
          if(authenticatedUser.id==application.actor){
            res.json(application)
          }else{
            res.status(405) // Not allowed 
            res.json("You don't have permission to see other users' applications")
          }
        }
      })
  }else if(authenticatedUser.role=='MANAGER'){
    Application.findById(req.params.applicationId, function (err, application) {
      if (err) {
        res.send(err)
      } else {
        res.json(application)
      }
    })
  }else{
    res.status(405) // Not allowed
    res.send("You can't update other users' applications")
  }
}

exports.update_an_application = async function (req, res) {
  Application.findOneAndUpdate({ _id: req.params.applicationId }, req.body, { new: true }, function (err, application) {
    if (err) {
      res.send(err)
    } else {
      if(req.body.status=="REJECTED" && (req.body.rejectionReason==null||req.body.rejectionReason.match(/^ *$/) !==null)){
        res.send("Kindly enter the rejection reason")
      }else{
        res.json(application)
      }
    }
  })
}

exports.update_an_application_with_auth = async function (req, res) {
  const idToken = req.headers.idtoken // WE NEED the FireBase custom token in the req.header... it is created by FireBase!!
  const authenticatedUser = await authController.getUserId(idToken)
  if (authenticatedUser.role=='EXPLORER') {
    Application.findById(req.params.applicationId, function (err, application) {
      if (err) {
        res.send(err)
      } else {
        if(authenticatedUser.id==application.actor){
          if(application.status=="PENDING" || application.status=="ACCEPTED"){
            Application.findOneAndUpdate({ _id: req.params.applicationId }, req.body, { new: true }, function (err, application) {
              if (err) {
                res.send(err)
              } else {
                if(req.body.status=="REJECTED" && (req.body.rejectionReason==null||req.body.rejectionReason.match(/^ *$/) !==null)){
                  res.send("Kindly enter the rejection reason")
                }else{
                  res.json(application)
                }
              }
            })
          }else{
            res.status(405);
            res.send("You can't cancel the application if is not in state PENDING or ACCEPTED");
          }
        }else{
          res.status(405) // Not allowed
          res.send("You can't update other users' applications")
        }
    
      }
    })
  }else if(authenticatedUser.role=='MANAGER'){
    if(application.status=="PENDING" && (req.body.status=="DUE" || req.body.status=="REJECTED")){
      Application.findOneAndUpdate({ _id: req.params.applicationId }, req.body, { new: true }, function (err, application) {
        if (err) {
          res.send(err)
        } else {
          if(req.body.status=="REJECTED" && (req.body.rejectionReason==null||req.body.rejectionReason.match(/^ *$/) !==null)){
            res.send("Kindly enter the rejection reason")
          }else{
            res.json(application)
          }
        }
      })
    }else if(['REJECTED', 'ACEPTED', 'DUE', 'CANCELLED'].contains(application.status)){
      Application.findOneAndUpdate({ _id: req.params.applicationId }, req.body, { new: true }, function (err, application) {
        if (err) {
          res.send(err)
        } else {
          res.json(application)
        }
      })
    }else{
      res.status(405) // Not allowed
      res.send('You can only change the status from PENDING to DUE or REJECTED')
    }
  }else{
    res.status(405) // Not allowed
    res.send('The Actor has unidentified roles')
  }
}

exports.pay_application = function (req, res) {
  let price = req.body.price;
  let tripPrice;

  Application.findById(req.params.applicationId, function (err, application) {
    if (err) {
      res.send(err)
    } else {
      if(application.status=="DUE"){
        Trip.findById(req.params.tripId, function (err, trip) {
          tripPrice = trip.price;
          if(price == tripPrice){
                Application.findOneAndUpdate({ _id: req.params.applicationId }, {$set: {'application.status': "ACEPTED"}}, { new: true }, function (err, application) {
                  if (err) {
                    res.send(err)
                  } else {
                      res.json(application)
                  }
                }) 
          }else{
            res.send("Kindly enter the correct price")
          }
        });
      }else{
        res.status(405)
        res.send("You caan't pay the application if is not in status DUE")
      }
    }
  });
}

exports.pay_application_with_auth = async function (req, res) {
  const idToken = req.headers.idtoken // WE NEED the FireBase custom token in the req.header... it is created by FireBase!!
  const authenticatedUser = await authController.getUserId(idToken)
  if (authenticatedUser.role=='EXPLORER') {
    Application.findOne({ _id: req.params.applicationId }, function (err, application) {
      if (err) {
        res.send(err)
      } else {
          if(application.actor==authenticatedUser.id){
            let price = req.body.price;
            let tripPrice;

            Application.findById(req.params.applicationId, function (err, application) {
              if (err) {
                res.send(err)
              } else {
                if(application.status=="DUE"){
                  Trip.findById(req.params.tripId, function (err, trip) {
                    tripPrice = trip.price;
                    if(price == tripPrice){
                          Application.findOneAndUpdate({ _id: req.params.applicationId }, {$set: {'application.status': "ACEPTED"}}, { new: true }, function (err, application) {
                            if (err) {
                              res.send(err)
                            } else {
                                res.json(application)
                            }
                          }) 
                    }else{
                      res.send("Kindly enter the correct price")
                    }
                  });
                }else{
                  res.status(405)
                  res.send("You caan't pay the application if is not in statu DUE")
                }
              }
            });
          }else{
            res.status(405) // Not allowed
            res.send("You can't update other users' applications")
          }
      }
    }) 
  }else{
    res.status(405) // Not allowed
    res.send('The Actor has unidentified roles')
  }
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

exports.delete_an_application_with_auth = async function (req, res) {
  const idToken = req.headers.idtoken // WE NEED the FireBase custom token in the req.header... it is created by FireBase!!
  const authenticatedUser = await authController.getUserId(idToken);
  if (authenticatedUser.role=='MANAGER') {
    Application.deleteOne({ _id: req.params.applicationId }, function (err, application) {
      if (err) {
        res.send(err)
      } else {
        res.json({ message: 'Application successfully deleted' })
      }
    })
  }else{
    res.status(405); // Not allowed
    res.send('The Actor has unidentified roles');
  }
}

exports.list_applications_by_user = async function (req, res) {

  Application.find({ user: req.params.userId }, req.body, { new: true ,group:"status" }, function (err, applications) {
      if (err) {
        res.send(err)
      } else {
        res.json(groupBy(applications, 'status'))
      }
    })
}

exports.list_applications_by_user_with_auth = async function (req, res) {
  const idToken = req.headers.idtoken // WE NEED the FireBase custom token in the req.header... it is created by FireBase!!
  const authenticatedUser = await authController.getUserId(idToken);
  if (authenticatedUser.role=='EXPLORER') {
    if (authenticatedUser.id == req.params.actorId) {
      Application.find({ user: req.params.userId }, req.body, { new: true ,group:"status" }, function (err, applications) {
        if (err) {
          res.send(err)
        } else {
          res.json(groupBy(applications, 'status'))
        }
      })
    }else{
      res.status(403) // Auth error
          res.send('The Actor is trying to update an Actor that is not himself!')
    }
  }else{
    res.status(405) // Not allowed
    res.send('The Actor has unidentified roles')
  }
}
