const app = require('../app')
const chai = require('chai')
const chaiHttp = require('chai-http')
const sinon = require('sinon');
const mongoose = require('mongoose')
const fileSystem = require('fs');

const Application = mongoose.model('Applications')
const Finder = mongoose.model('Finders')
const Trip = mongoose.model('Trips')

const { expect } = chai
chai.use(chaiHttp);
var sandbox = sinon.createSandbox();

describe('Trips', () => {
  const trips = JSON.parse(fileSystem.readFileSync("./data/Trips.json", 'utf8'));
  trips.forEach(trip => {
    trip.startDate = new Date(trip.startDate);
    trip.endDate = new Date(trip.endDate);
  });

  const finders = JSON.parse(fileSystem.readFileSync("./data/Finders.json", 'utf8'));

  const createFakeCallbackCaller = (res) => async function () {
    arguments[arguments.length - 1](null, res)
  }

  afterEach(() => {
    sandbox.restore();
  });

  describe('Get trips', () => {
    it('Returns list of all trips', done => {
      sandbox.stub(Trip, 'find').callsFake(createFakeCallbackCaller(trips));

      chai.request(app)
        .get('/v1/trips/')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.length).to.equals(trips.length);
          done();
        })
    })

    it('Returns 400 error: invalid keyword', done => {
      chai.request(app)
        .get('/v1/trips/')
        .query({ keyword: 'prueba aas' })
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        })
    })
  })

  describe('Get trip', () => {
    it('Returns trip', done => {
      const trip = trips.find(trip => trip.published);
      sandbox.stub(Trip, 'findById').callsFake(createFakeCallbackCaller(trip));

      chai.request(app)
        .get('/v1/trips/' + encodeURIComponent(trip._id))
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body._id).to.equals(trip._id);
          done();
        })
    })

    it('Returns 403 error: unpublished trip', done => {
      const trip = trips.find(trip => !trip.published);
      sandbox.stub(Trip, 'findById').callsFake(createFakeCallbackCaller(trip));

      chai.request(app)
        .get('/v1/trips/' + encodeURIComponent(trip._id))
        .end((err, res) => {
          expect(res).to.have.status(403);
          done();
        })
    })

    it('Returns 404 error: not found', done => {
      sandbox.stub(Trip, 'findById').callsFake(createFakeCallbackCaller(undefined));

      chai.request(app)
        .get('/v1/trips/inexistent_trip')
        .end((err, res) => {
          expect(res).to.have.status(404);
          done();
        })
    })
  })

  describe('List trips by finder', () => {
    it('Returns list of trips', done => {
      const finder = finders.find(finder => finder.trips.length > 0);
      sandbox.stub(Finder, 'findById').callsFake(createFakeCallbackCaller(finder));
      const tripList = trips.filter(trip => finder.trips.includes(trip._id));
      sandbox.stub(Trip, 'find').callsFake(createFakeCallbackCaller(tripList));

      chai.request(app)
        .get('/v1/trips/finders/' + encodeURIComponent(finder._id))
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.length).to.equals(tripList.length);
          done();
        })
    })

    it('Returns 404 error: finder not found', done => {
      sandbox.stub(Finder, 'findById').callsFake(createFakeCallbackCaller(undefined));

      chai.request(app)
        .get('/v1/trips/finders/inexistent_finder')
        .end((err, res) => {
          expect(res).to.have.status(404);
          done();
        })
    })
  })

  describe('Update a trip', () => {
    it('Update an unpublished trip successfully', done => {
      const trip = trips.find(trip => !trip.published);
      sandbox.stub(Trip, 'findById').callsFake(createFakeCallbackCaller(trip));
      sandbox.stub(Trip, 'findOneAndUpdate').callsFake(createFakeCallbackCaller(trip));

      chai.request(app)
        .put('/v1/trips/' + encodeURIComponent(trip._id))
        .send({
          description: "Test"
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        })
    })

    it('Cancel a published trip successfully', done => {
      const trip = trips.find(trip => trip.published && trip.state !== 'CANCELLED' && trip.startDate > new Date());
      sandbox.stub(Trip, 'findById').callsFake(createFakeCallbackCaller(trip));
      sandbox.stub(Trip, 'findOneAndUpdate').callsFake(createFakeCallbackCaller(trip));
      sandbox.stub(Application, 'count').returns(0);

      chai.request(app)
        .put('/v1/trips/' + encodeURIComponent(trip._id))
        .send({
          cancelationReason: "Test",
          state: "CANCELLED"
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        })
    })

    it('Returns 404 error: not found', done => {
      const trip = trips.find(trip => trip.published);
      sandbox.stub(Trip, 'findById').callsFake(createFakeCallbackCaller(undefined));

      chai.request(app)
        .put('/v1/trips/' + encodeURIComponent(trip._id))
        .send({
          description: "Test"
        })
        .end((err, res) => {
          expect(res).to.have.status(404);
          done();
        })
    })

    it('Returns 403 error: can not edit a cancelled trip', done => {
      const trip = trips.find(trip => trip.published && trip.state === 'CANCELLED');
      sandbox.stub(Trip, 'findById').callsFake(createFakeCallbackCaller(trip));

      chai.request(app)
        .put('/v1/trips/' + encodeURIComponent(trip._id))
        .send({
          cancelationReason: "Test",
          state: "CANCELLED"
        })
        .end((err, res) => {
          expect(res).to.have.status(403);
          done();
        })
    })

    it('Returns 403 error: can not cancel an already started trip', done => {
      const trip = trips.find(trip => trip.published && trip.state !== 'CANCELLED');
      trip.startDate = new Date(new Date().getTime() - 1000 * 60);
      sandbox.stub(Trip, 'findById').callsFake(createFakeCallbackCaller(trip));

      chai.request(app)
        .put('/v1/trips/' + encodeURIComponent(trip._id))
        .send({
          cancelationReason: "Test",
          state: "CANCELLED"
        })
        .end((err, res) => {
          expect(res).to.have.status(403);
          done();
        })
    })

    it('Returns 403 error: can not cancel a trip with accepted applications', done => {
      const trip = trips.find(trip => trip.published && trip.state !== 'CANCELLED' && trip.startDate > new Date());
      sandbox.stub(Trip, 'findById').callsFake(createFakeCallbackCaller(trip));
      sandbox.stub(Trip, 'findOneAndUpdate').callsFake(createFakeCallbackCaller(trip));
      sandbox.stub(Application, 'count').returns(1);

      chai.request(app)
        .put('/v1/trips/' + encodeURIComponent(trip._id))
        .send({
          cancelationReason: "Test",
          state: "CANCELLED"
        })
        .end((err, res) => {
          expect(res).to.have.status(403);
          done();
        })
    })
  })

  describe('Delete a trip', () => {
    it('Delete a trip successfully', done => {
      const trip = trips.find(trip => trip.published === false);
      sandbox.stub(Trip, 'deleteOne').callsFake(createFakeCallbackCaller(trip));

      chai.request(app)
        .delete('/v1/trips/' + encodeURIComponent(trip._id))
        .end((err, res) => {
          expect(res).to.have.status(204);
          done();
        })
    })

    it('Delete a trip error 404: Not found', done => {
      const trip = trips.find(trip => trip.published);
      sandbox.stub(Trip, 'deleteOne').callsFake(createFakeCallbackCaller(undefined));

      chai.request(app)
        .delete('/v1/trips/' + encodeURIComponent(trip._id))
        .end((err, res) => {
          expect(res).to.have.status(404);
          done();
        })
    })
  })

  describe('Create a trip', () => {
    it('Create a trip successfully', done => {
      const trip = {
        actor: "623621b21c5657dfe659c8b0",
        description: "Una buena descripcion",
        endDate: "2025-07-14T07:49:36.000Z",
        pictures: [],
        requirements: "Unos buenos requisitos",
        startDate: "2020-05-28T08:29:52.000Z",
        title: "Un buen titulo",
        stages: [],
        published: false
      }
      sandbox.stub(Trip.prototype, 'save').callsFake(createFakeCallbackCaller(trip));

      chai.request(app)
        .post('/v1/trips')
        .send(trip)
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        })
    })

    it('Create a trip error 500', done => {

      chai.request(app)
        .post('/v1/trips')
        .end((err, res) => {
          expect(res).to.have.status(500);
          done();
        })
    })
  })

  describe('Get trip and application dashboard', () => {
      it('Returns dashboard', done => {
          chai.request(app)
              .get('/v1/trips/dashboard')
              .end((err, res) => {
                  expect(res).to.have.status(200);
                  done();
              })
      })
  })
})