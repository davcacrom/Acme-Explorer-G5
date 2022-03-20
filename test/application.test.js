const app = require('../app')
const chai = require('chai')
const chaiHttp = require('chai-http')
const sinon = require('sinon');
const mongoose = require('mongoose')

const Application = mongoose.model('Applications')
const Trip = mongoose.model('Trips')

const { expect } = chai
chai.use(chaiHttp);
var sandbox = sinon.createSandbox();

describe('Applications', () => {

    var createdApplicationId = null;
    var applications = [{
        "_id": "621bc2fc8ed42c1c26274c30",
        "creationMoment": "2017-10-01T07:06:12.000Z",
        "paid": false,
        "rejectionReason": "Veniam incididunt labore cillum duis exercitation Lorem non sint officia dolor. Voluptate laborum velit est adipisicing irure id cillum. Pariatur proident ad sunt occaecat proident do do sit consectetur deserunt cillum pariatur mollit. Officia enim magna enim eiusmod cupidatat commodo dolore. Nulla laboris labore ullamco magna in. Eiusmod sunt elit quis irure fugiat ut veniam. Sit qui ex laborum Lorem ea elit nulla laborum nulla reprehenderit irure non dolore adipisicing.\r\n",
        "comments": "Comentarios de una aplicación",
        "status": "DUE",
        "trip": "621bc2fcc4b04c8afb4931a0",
        "actor": "621bc2fc0eb01ca0e535d599",
        "__v": 0
    }]

    var application = {
        "creationMoment": "2017-10-01T07:06:12.000Z",
        "paid": false,
        "rejectionReason": "Veniam incididunt labore cillum duis exercitation Lorem non sint officia dolor. Voluptate laborum velit est adipisicing irure id cillum. Pariatur proident ad sunt occaecat proident do do sit consectetur deserunt cillum pariatur mollit. Officia enim magna enim eiusmod cupidatat commodo dolore. Nulla laboris labore ullamco magna in. Eiusmod sunt elit quis irure fugiat ut veniam. Sit qui ex laborum Lorem ea elit nulla laborum nulla reprehenderit irure non dolore adipisicing.\r\n",
        "comments": "Comentarios de una aplicación",
        "status": "DUE",
        "trip": "621bc2fcc4b04c8afb4931a0",
        "actor": "621bc2fc0eb01ca0e535d599",
        "__v": 0
    }

    var trip = {
        "_id": "622b9c78bb3ab67a6b700137",
        "actor": "622b9c789742000e530a804e",
        "state": "ACTIVE",
        "description": "Enim id occaecat enim fugiat irure consectetur ex eiusmod eu. Enim minim adipisicing cupidatat consectetur veniam dolore. Lorem elit ipsum aliqua laborum. Ex in deserunt id cillum aliqua occaecat id pariatur.\r\nAmet velit et ullamco elit nisi nulla aliqua in do velit voluptate tempor dolor aliquip. Ullamco nostrud officia exercitation mollit eu voluptate. Cupidatat excepteur proident proident ipsum magna sint aliquip exercitation laboris nulla culpa id. Nostrud mollit proident laborum sunt sit id sunt in cillum consectetur qui occaecat deserunt. Velit proident excepteur anim laboris. Laborum excepteur esse enim enim eiusmod non nisi excepteur.\r\nOccaecat tempor id eiusmod aliqua ipsum cupidatat nisi dolor. Enim laboris mollit reprehenderit exercitation nisi ipsum nostrud irure. Fugiat consectetur nulla reprehenderit in ipsum. Ullamco consectetur fugiat exercitation culpa excepteur ipsum. Officia aliqua ea consequat enim fugiat culpa enim sint reprehenderit ad. Laboris aute aliquip do cupidatat adipisicing aute aute nulla commodo fugiat.\r\nEsse aliquip eiusmod cupidatat cupidatat exercitation deserunt. Tempor nostrud deserunt ut eiusmod. Eiusmod sit velit consectetur elit ut. Exercitation nulla velit elit dolor dolor ullamco esse voluptate exercitation culpa velit. Lorem laboris voluptate duis reprehenderit.\r\nOfficia ex aute nostrud deserunt occaecat est laborum excepteur pariatur. Velit proident aliqua sit excepteur exercitation reprehenderit adipisicing sit ad voluptate incididunt aliquip reprehenderit sunt. Ex culpa ullamco id labore occaecat irure fugiat ut consequat tempor consectetur. Incididunt quis consequat est cillum sint irure id laboris tempor aliquip.\r\n",
        "endDate": "2025-01-04T09:37:36.000Z",
        "pictures": [
            "http://placehold.it/32x32",
            "http://placehold.it/32x32",
            "http://placehold.it/32x32",
            "http://placehold.it/32x32",
            "http://placehold.it/32x32",
            "http://placehold.it/32x32",
            "http://placehold.it/32x32"
        ],
        "requirements": "magna cillum commodo qui consequat",
        "startDate": "2023-04-15T23:08:29.000Z",
        "ticker": "170325-QTVY",
        "title": "amet aute eiusmod velit est",
        "published": true,
        "stages": [
            {
                "description": "Esse cupidatat elit nisi aliquip elit aute ea deserunt ea mollit. Commodo do officia irure sit elit cupidatat laborum sit in labore commodo veniam voluptate. Laborum labore amet nisi occaecat exercitation minim nulla incididunt adipisicing voluptate magna. Voluptate ut ut eu eiusmod officia commodo magna id consectetur do cupidatat do consectetur sint. Duis excepteur ea aliqua culpa minim ad nostrud. Irure ex nisi nisi do exercitation ex. Eu commodo occaecat culpa proident esse tempor mollit exercitation duis ipsum elit aute.\r\nAute velit qui eu elit nulla cupidatat ea esse mollit est quis aliqua. Voluptate eu ex aute consequat ullamco aliqua cupidatat laboris culpa occaecat do. Ad veniam aliquip culpa esse proident cupidatat sint non sit tempor. Nisi anim mollit est dolor irure reprehenderit sit Lorem laborum reprehenderit minim pariatur. Sunt elit anim officia minim ex anim ullamco ad sunt. Quis esse non reprehenderit fugiat qui voluptate ullamco. Adipisicing elit consequat cupidatat enim esse ex.\r\n",
                "price": 462.11,
                "title": "eu ut ex anim id",
                "_id": "622b9d0b4ac19c7c4c49bd32"
            },
            {
                "description": "Dolor eiusmod magna adipisicing excepteur. Adipisicing velit aliqua excepteur dolore mollit adipisicing sunt magna nostrud sint nostrud. Pariatur tempor cupidatat laboris enim proident. Esse excepteur cillum enim veniam incididunt ea. Aliqua pariatur veniam sit tempor sit aliquip eu. Sit sint voluptate labore ea aliqua ullamco.\r\nIrure fugiat do ullamco anim esse culpa officia ad nulla ad voluptate pariatur eiusmod. Dolor culpa eiusmod sit labore velit non. Dolore est eu ipsum laborum id. Duis dolore non excepteur pariatur fugiat occaecat deserunt duis ullamco aliqua esse.\r\n",
                "price": 158.75,
                "title": "voluptate ad est voluptate laboris",
                "_id": "622b9d0b4ac19c7c4c49bd33"
            },
            {
                "description": "Occaecat reprehenderit excepteur deserunt nisi ad incididunt. Excepteur id laboris ut velit id velit minim laborum eiusmod qui. Dolor minim ullamco est sint commodo est dolor irure sint minim quis amet consectetur pariatur. Anim esse dolore officia in elit fugiat fugiat aute commodo proident. Exercitation Lorem dolore eu fugiat in labore ad laboris commodo sint esse elit. Veniam veniam occaecat eiusmod aliqua.\r\nIncididunt ut minim est mollit id incididunt velit cupidatat aliquip laborum nisi exercitation ullamco. Reprehenderit deserunt nostrud est nulla do magna. Eiusmod duis commodo ea adipisicing anim aliqua esse. Aliquip nostrud nisi est culpa fugiat pariatur reprehenderit irure aliqua. Nisi ut sit anim ipsum cillum eiusmod nisi nostrud cillum reprehenderit do consequat.\r\n",
                "price": 437.55,
                "title": "exercitation nisi irure nulla exercitation",
                "_id": "622b9d0b4ac19c7c4c49bd34"
            },
            {
                "description": "Duis commodo Lorem deserunt incididunt sint sit sunt veniam labore. Esse id labore cillum aliquip dolor labore aliqua non labore aute esse. Magna adipisicing nisi pariatur consequat aliqua velit est laborum culpa amet minim sint pariatur. Nulla excepteur commodo laborum voluptate eu voluptate do do commodo Lorem cillum nostrud. Id minim nulla Lorem velit sint qui consequat sunt velit nisi pariatur. Nulla nisi sint Lorem laboris laboris id dolore dolore commodo quis ex Lorem. Tempor eu in ea deserunt.\r\nEu esse cupidatat pariatur ea in non ipsum quis cillum elit voluptate. Aliquip ullamco dolore laborum proident id anim incididunt duis officia qui incididunt. Dolore aute velit labore mollit sint duis. Veniam enim culpa et proident occaecat aliquip incididunt reprehenderit ex officia duis do in.\r\n",
                "price": 568.95,
                "title": "proident ullamco veniam id ex",
                "_id": "622b9d0b4ac19c7c4c49bd35"
            },
            {
                "description": "Culpa eu aute Lorem ullamco. Nostrud quis enim ex ipsum amet ipsum reprehenderit ipsum quis. Labore esse quis anim do amet minim ex.\r\nElit dolore sit proident cillum quis. Elit voluptate voluptate ex laboris laborum occaecat sit eu. Reprehenderit nulla consequat in incididunt nostrud. Anim tempor sit id non laboris exercitation nostrud sunt quis cillum elit ad aliquip dolore. Magna esse nostrud ad laboris anim ea est commodo ipsum qui ut. Laborum reprehenderit adipisicing laboris occaecat nisi occaecat excepteur minim.\r\n",
                "price": 437.14,
                "title": "id sunt proident quis tempor",
                "_id": "622b9d0b4ac19c7c4c49bd36"
            },
            {
                "description": "Duis cillum enim eu in in ipsum officia occaecat culpa deserunt magna velit. Elit aliqua reprehenderit id enim consectetur et laboris. Ex laboris excepteur nulla ut minim sint in laboris qui laboris est. Est aliquip mollit occaecat pariatur ipsum ipsum officia laborum. Minim in magna veniam mollit dolor. Lorem laborum velit sit dolor magna ipsum labore consequat ex ex ex aliqua minim aliqua.\r\nMollit minim exercitation cupidatat labore dolore exercitation in labore amet. Magna adipisicing nisi culpa dolor veniam aute duis proident proident. Eiusmod est dolore elit dolor laborum sint anim excepteur pariatur cupidatat quis. Fugiat aute nisi excepteur laborum.\r\n",
                "price": 563.67,
                "title": "sunt consectetur ullamco duis mollit",
                "_id": "622b9d0b4ac19c7c4c49bd37"
            }
        ],
        "__v": 0,
        "price": 2628.17
    }

    afterEach(() => {
        sandbox.restore();
    })

    describe('Get applications', () => {

        it('Return list of all applications', (done) => {
            fakeFindApplications = (err, callback) => {
                callback(null, applications)
            }

            authStub = sandbox.stub(Application, 'find').callsFake(fakeFindApplications);

            fakeFindByIdTrip = (err, callback) => {
                callback(null, trip)
            }

            authStub = sandbox.stub(Trip, 'findById').callsFake(fakeFindByIdTrip);

            chai.request(app)
                .get('/v1/trips/621bc2fcc4b04c8afb4931a0/applications')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.length).to.equals(1);
                    done();
                })
        })

        it('Error: Trip does not exist on list applications', (done) => {
            fakeFindApplications = (err, callback) => {
                callback(null, null)
            }

            authStub = sandbox.stub(Application, 'find').callsFake(fakeFindApplications);

            fakeFindByIdTrip = (err, callback) => {
                callback(null, null)
            }

            authStub = sandbox.stub(Trip, 'findById').callsFake(fakeFindByIdTrip);

            chai.request(app)
                .get('/v1/trips/621bc2fcc4b04c8afb4931a0/applications')
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    done();
                })
        })

        it('Return one applications', (done) => {
            fakeFindApplication = (err, callback) => {
                callback(null, application)
            }

            authStub = sandbox.stub(Application, 'findById').callsFake(fakeFindApplication);

            chai.request(app)
                .get('/v1/trips/621bc2fcc4b04c8afb4931a0/applications/621bc2fc8ed42c1c26274c30')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.status).to.equals("DUE");
                    expect(res.body.comments).to.equals("Comentarios de una aplicación");
                    done();
                })
        })

        it('Error: Application does not exist on return one application', (done) => {
            fakeFindApplication = (err, callback) => {
                callback(null, null)
            }

            authStub = sandbox.stub(Application, 'findById').callsFake(fakeFindApplication);

            chai.request(app)
                .get('/v1/trips/621bc2fcc4b04c8afb4931a0/applications/621bc2fc8ed42c1c26274c30')
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    done();
                })
        })

        it('Return list of all applications by actor', done => {

            chai.request(app)
                .get('/v1/actors/621bc003d03031da41d7d008/applications')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    done();
                })
        })

        it('Error: Actor not found on return list of all applications by actor', done => {

            chai.request(app)
                .get('/v1/actors/62364a936ef0982cbd890bbe/applications')
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    done();
                })
        })

    })

    describe('Create applications', () => {

        afterEach(() => {
            sandbox.restore();
        })

        it('Create an application correctly', (done) => {

            // fakeCreateApplication = (err, callback) =>{
            //     callback(null, application)
            // }

            // authStub =  sandbox.stub(Application.prototype, 'save').callsFake(fakeCreateApplication);            

            fakefindByIdTrip = (err, callback) => {
                callback(null, trip)
            }

            authStub = sandbox.stub(Trip, 'findById').callsFake(fakefindByIdTrip);

            chai.request(app)
                .post('/v1/trips/622e380670ca329ee563e511/applications')
                .send(application)
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    createdApplicationId = res.body._id;
                    done();
                })
        })

        it('Error: Trip does not exist on create an application correctly', (done) => {

            fakefindByIdTrip = (err, callback) => {
                callback(null, null)
            }

            authStub = sandbox.stub(Trip, 'findById').callsFake(fakefindByIdTrip);

            chai.request(app)
                .post('/v1/trips/622e380670ca329ee563e511/applications')
                .send(application)
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    done();
                })
        })

        it('Error creating application: Trip is not publised', (done) => {
            var unpublishedTrip = {};
            Object.assign(unpublishedTrip, trip);
            unpublishedTrip.published = false;
            fakefindByIdTrip = (err, callback) => {
                callback(null, unpublishedTrip)
            }

            authStub = sandbox.stub(Trip, 'findById').callsFake(fakefindByIdTrip);

            chai.request(app)
                .post('/v1/trips/621bc2fcc4b04c8afb4931a0/applications')
                .send(application)
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.error.text).to.equals("The trip is not published");
                    done();
                })
        })

        it('Error creating application: Trip already started', (done) => {
            var startedTrip = {};
            Object.assign(startedTrip, trip);
            startedTrip.startDate = "2020-05-07T01:36:25.000Z";
            fakefindByIdTrip = (err, callback) => {
                callback(null, startedTrip)
            }

            authStub = sandbox.stub(Trip, 'findById').callsFake(fakefindByIdTrip);

            chai.request(app)
                .post('/v1/trips/621bc2fcc4b04c8afb4931a0/applications')
                .send(application)
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.error.text).to.equals("The trip you are trying to apply for has already started");
                    done();
                })
        })

        it('Error creating application: Trip cancelled', (done) => {
            var cancelledTrip = {}
            Object.assign(cancelledTrip, trip);
            cancelledTrip.state = "CANCELLED";
            fakefindByIdTrip = (err, callback) => {
                callback(null, cancelledTrip)
            }

            authStub = sandbox.stub(Trip, 'findById').callsFake(fakefindByIdTrip);

            chai.request(app)
                .post('/v1/trips/621bc2fcc4b04c8afb4931a0/applications')
                .send(application)
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.error.text).to.equals("The trip is cancelled");
                    done();
                })
        })

    })

    describe('Update applications', () => {
        var applicationToUpdate = {}

        beforeEach(done => {
            Object.assign(applicationToUpdate, trip);
            applicationToUpdate.status = "PENDING"

            done();
        })

        afterEach(() => {
            sandbox.restore();
        })


        it('Reject an application correctly', (done) => {
            var applicationUpdated = {}
            Object.assign(applicationUpdated, application)

            applicationUpdated.status = "REJECTED"
            applicationUpdated.rejectionReason = "Rejection reason";

            fakefindOneApplication = (err, callback) => {
                callback(null, applicationToUpdate)
            }

            authStub = sandbox.stub(Application, 'findOne').callsFake(fakefindOneApplication);

            // fakefindOneAndUpdateApplication = (err, callback) =>{
            //     callback(null, application)
            // }

            // sinon.stub(Application, 'findOneAndUpdate').callsFake(fakefindOneAndUpdateApplication);

            chai.request(app)
                .put('/v1/trips/621bc2fcc4b04c8afb4931a0/applications/621bc2fc8ed42c1c26274c30')
                .send(applicationUpdated)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    done();
                })
        })

        it('Change status of application correctly', (done) => {
            var applicationUpdated = {}
            Object.assign(applicationUpdated, application)

            applicationUpdated.status = "DUE"

            fakefindOneApplication = (err, callback) => {
                callback(null, applicationToUpdate)
            }

            authStub = sandbox.stub(Application, 'findOne').callsFake(fakefindOneApplication);

            chai.request(app)
                .put('/v1/trips/621bc2fcc4b04c8afb4931a0/applications/621bc2fc8ed42c1c26274c30')
                .send(applicationUpdated)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    done();
                })
        })

        it('Error updating application: Can not cancel application', (done) => {
            var applicationUpdated = {}
            Object.assign(applicationUpdated, application)

            applicationUpdated.status = "REJECTED"

            applicationToUpdate.status = "DUE"

            fakefindOneApplication = (err, callback) => {
                callback(null, applicationToUpdate)
            }

            authStub = sandbox.stub(Application, 'findOne').callsFake(fakefindOneApplication);

            chai.request(app)
                .put('/v1/trips/621bc2fcc4b04c8afb4931a0/applications/621bc2fc8ed42c1c26274c30')
                .send(applicationUpdated)
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.error.text).to.equals("You can't cancel the application if the status is not PEDING or ACCEPTED");
                    done();
                })
        })

        it('Pay application correctly', (done) => {
            var applicationUpdated = {}
            Object.assign(applicationUpdated, application)

            applicationUpdated.status = "ACCEPTED"

            fakefindByIdApplication = (err, callback) => {
                callback(null, application)
            }

            authStub = sandbox.stub(Application, 'findById').callsFake(fakefindByIdApplication);

            fakefindByIdTrip = (err, callback) => {
                callback(null, trip)
            }

            authStub = sandbox.stub(Trip, 'findById').callsFake(fakefindByIdTrip);

            // fakefindOneAndUpdateApplication = (err, callback) =>{
            //     callback(null, applicationUpdated)
            // }

            // authStub =  sandbox.stub(Application, 'findOneAndUpdate').callsFake(fakefindOneAndUpdateApplication);

            var body = { price: 2628.17 }

            chai.request(app)
                .put('/v1/trips/621bc2fcc4b04c8afb4931a0/applications/621bc2fc8ed42c1c26274c30/pay')
                .send(body)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    done();
                })
        })

        it('Error updating application: Pay less than trip price', (done) => {
            var applicationUpdated = {}
            Object.assign(applicationUpdated, application)

            applicationUpdated.status = "ACCEPTED"

            fakefindByIdApplication = (err, callback) => {
                callback(null, application)
            }

            authStub = sandbox.stub(Application, 'findById').callsFake(fakefindByIdApplication);

            fakefindByIdTrip = (err, callback) => {
                callback(null, trip)
            }

            authStub = sandbox.stub(Trip, 'findById').callsFake(fakefindByIdTrip);

            var body = { price: 10 }

            chai.request(app)
                .put('/v1/trips/621bc2fcc4b04c8afb4931a0/applications/621bc2fc8ed42c1c26274c30/pay')
                .send(body)
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.text).to.equals("Kindly enter the correct price")
                    done();
                })
        })

        it('Error updating application: Application is not in status DUE', (done) => {
            var applicationUpdated = {}
            Object.assign(applicationUpdated, application)

            applicationUpdated.status = "ACCEPTED"

            var applicationToBeUpdated = {}
            Object.assign(applicationToBeUpdated, application)

            applicationToBeUpdated.status = "PENDING"

            fakefindByIdApplication = (err, callback) => {
                callback(null, applicationToBeUpdated)
            }

            authStub = sandbox.stub(Application, 'findById').callsFake(fakefindByIdApplication);

            var body = { price: 10 }

            chai.request(app)
                .put('/v1/trips/621bc2fcc4b04c8afb4931a0/applications/621bc2fc8ed42c1c26274c30/pay')
                .send(body)
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.error.text).to.equals("You can't pay the application if is not in status DUE")
                    done();
                })
        })

    })

    after((done) => {
        Application.deleteOne({ _id: createdApplicationId }, (err, response) => {
            done();
        });
    });
});

