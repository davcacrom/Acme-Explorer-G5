const app = require('../app')
const chai = require('chai')
const chaiHttp = require('chai-http')
const sinon = require('sinon');
const mongoose = require('mongoose')

const Finder = mongoose.model('Finders')
const Trip = mongoose.model('Trips')
const Actor = mongoose.model('Actors')
const Config = mongoose.model('Configurations')

const { expect } = chai
chai.use(chaiHttp);
var sandbox = sinon.createSandbox();

describe('Finders', () => {

    const createFakeCallbackCaller = (res) => async function () {
        arguments[arguments.length - 1](null, res)
      }

    var configuration =
        [{
            "_id": "62370d0b02e79f439b1a7575",
            "cachedPeriod": 1,
            "numberResults": 10,
            "__v": 0
        }]

    var configurationUpdated =
        [{
            "_id": "62370d0b02e79f439b1a7575",
            "cachedPeriod": 1,
            "numberResults": 100,
            "__v": 0
        }]

    var finder =
    {
        "_id": "6236519484fbbeb4349eee8d",
        "endDate": "2025-06-26T11:54:24.000Z",
        "keyword": "a",
        "lastUpdate": "2022-03-19T19:05:20.278Z",
        "maxPrice": 26000,
        "minPrice": 21000,
        "startDate": "2021-05-28T08:29:52.000Z",
        "trips": [],
        "actor": "62372bb7c7b544c1ff736e4d",
        "__v": 0
    }



    var finderUpdated =
    {
        "_id": "6236519484fbbeb4349eee8d",
        "endDate": "2025-06-26T11:54:24.000Z",
        "keyword": "a",
        "lastUpdate": "2022-03-19T19:05:20.278Z",
        "maxPrice": 26000,
        "minPrice": 2100,
        "startDate": "2021-05-28T08:29:52.000Z",
        "trips": [],
        "actor": "62372bb7c7b544c1ff736e4d",
        "__v": 0
    }

    before(() => {
        var newFinder = new Finder(finder)
        newFinder.save()
    })

    afterEach(() => {
        sandbox.restore();
    })


    describe('Get dashboard', () => {
        it('Returns dashboard', done => {
            chai.request(app)
                .get('/v1/finders/dashboard')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    done();
                })
        })
    })

    describe('Get finder', () => {
        it('Returns finder', done => {
            fakeGetFinder = (err, callback) => {
                callback(null, finder)
            }
            sandbox.stub(Finder, 'findById').callsFake(fakeGetFinder);

            chai.request(app)
                .get('/v1/finders/' + encodeURIComponent(finder._id))
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body._id).to.equals(finder._id);
                    done();
                })
        })

        it('Get finder error 404: not found', done => {
            fakeGetFinder = (err, callback) => {
                callback(null, undefined)
            }
            sandbox.stub(Finder, 'findById').callsFake(fakeGetFinder);

            chai.request(app)
                .get('/v1/finders/falseFinder')
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    done();
                })
        })


    })

    describe('Update finder', () => {

        it('Update finder', done => {
            chai
                .request(app)
                .put('/v1/finders/' + encodeURIComponent(finder._id))
                .send({ finderUpdated })
                .end((err, res) => {
                    expect(res).to.have.status(200)
                    if (err) done(err)
                    else done()
                })
        })

        it('Update finder error 404: Not Found', done => {
            sandbox.stub(Finder, 'findOneAndUpdate').callsFake(createFakeCallbackCaller(undefined));
            chai
                .request(app)
                .put('/v1/finders/' + encodeURIComponent(finder._id))
                .send({ finderUpdated })
                .end((err, res) => {
                    expect(res).to.have.status(404)
                    if (err) done(err)
                    else done()
                })
        })

        after((done) => {
            Finder.deleteOne({ _id: finder._id }, (err, response) => {
                done();
            });
        })
    })
    describe('Update config', () => {
        
        it('Update config', done => {
            fakeGetConfiguration = (err, callback) => {
                callback(null, configurationUpdated)
            }
            sandbox.stub(Config, 'findOne').callsFake(fakeGetConfiguration);
            chai
                .request(app)
                .put('/v1/finders/config/' + encodeURIComponent(configuration._id))
                .send({ configurationUpdated })
                .end((err, res) => {
                    expect(res).to.have.status(200)
                    if (err) done(err)
                    else done()
                })
        })

        it('Update config error 404: Not found', done => {
            sandbox.stub(Config, 'findOneAndUpdate').callsFake(createFakeCallbackCaller(undefined));
            chai
                .request(app)
                .put('/v1/finders/config/' + encodeURIComponent(configuration._id))
                .send({ configurationUpdated })
                .end((err, res) => {
                    expect(res).to.have.status(404)
                    if (err) done(err)
                    else done()
                })
        })
    });
});