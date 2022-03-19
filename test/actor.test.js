const app = require('../app')
const chai = require('chai')
const chaiHttp = require('chai-http')
const sinon = require('sinon');
const mongoose = require('mongoose')

const Actor = mongoose.model('Actors')

// const Trip = require('../api/models/trip')

const { expect } = chai
chai.use(chaiHttp);
var sandbox = sinon.createSandbox();
var newActorId;
describe('Actors', () => {
  describe('Create actors', () => {
    it('Create actor properly', done => {
      chai
        .request(app)
        .post('/v1/actors')
        .send({"name":"user19",
        "surname": "surname surname",
        "email": "user19@gmail.com",
        "password": "complexPassword",
        "phone": "642912310",
        "address": "Calle falsa n 1",
        "role": "EXPLORER"})
        .end((err, res) => {
          expect(res).to.have.status(200)
          newActorId=res.body.actor._id;
          if (err) done(err)
          else done()
        })
    })
    it('Error creating actor: the new actor role must be EXPLORER, only admins can create different users', done => {
      chai
        .request(app)
        .post('/v1/actors')
        .send({"name":"user20",
        "surname": "surname surname",
        "email": "user20@gmail.com",
        "password": "complexPassword",
        "phone": "642912310",
        "address": "Calle falsa n 1",
        "role": "MANAGER"})
        .end((err, res) => {
          expect(res).to.have.status(400)
          if (err) done(err)
          else done()
        })
    })
    it('Error creating actor: new actors must be active', done => {
      chai
        .request(app)
        .post('/v1/actors')
        .send({"name":"user21",
        "surname": "surname surname",
        "email": "user21@gmail.com",
        "password": "complexPassword",
        "phone": "642912310",
        "address": "Calle falsa n 1",
        "role": "EXPLORER",
        "active": false})
        .end((err, res) => {
          expect(res).to.have.status(400)
          if (err) done(err)
          else done()
        })
    })
  })

  describe('Get actors', () => {
    it('Get actor properly', done => {
      chai
        .request(app)
        .get('/v1/actors/'+newActorId)
        .end((err, res) => {
          expect(res).to.have.status(200)
          if (err) done(err)
          else done()
        })
    })
  })

  describe('Update actors', () => {
    it('Update actor properly', done => {
      chai
        .request(app)
        .put('/v1/actors/'+newActorId)
        .send({"name":"user22",
        "surname": "user22 test",
        "email": "user22@gmail.com",
        "password": "complexPassword22",
        "phone": "642912322",
        "address": "Calle falsa n 22",
        "role": "EXPLORER"})
        .end((err, res) => {
          expect(res).to.have.status(200)
          if (err) done(err)
          else done()
        })
    })
  })   
        after((done) => {
          Actor.deleteOne({ _id: newActorId }, (err, response) => {
            done();
          });
        });
      });
  
  
  