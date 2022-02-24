'use strict'
const mongoose = require('mongoose')
const validator = require('validator')
const Schema = mongoose.Schema

const moment = require('moment')
const customAlphabet = require('nanoid').customAlphabet
const idGenerator = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 4)

function endDateValidator(value) {
	return this.startDate <= value;
}

const TripSchema = new Schema({
	actor: {
		type: Schema.Types.ObjectId,
		ref: 'Actors',
	},
	cancelationReason: {
		type: String,
	},
	description: {
		type: String,
		required: 'Kindly enter the Trip description',
	},
	endDate: {
		type: Date,
		required: 'Kindly enter the Trip endDate',
		min: Date.now,
		validate: [endDateValidator, 'End date must be greater than start date']
	},
	pictures: [
		{
			type: String,
			required: 'Kindly enter the picture URL', // no sé si esto va bien o no
			validate: [v => validator.isURL(v, { protocols: ['http', 'https'] }), 'Please enter a valid URL']
		}
	],
	// Esta es una propiedad derivada
	price: {
		type: Number,
		required: 'Kindly enter the Trip price',
		default: 0,
		min: 0
	},
	requirements: {
		type: String,
		required: 'Kindly enter the Trip requirements',
	},
	startDate: {
		type: Date,
		required: 'Kindly enter the Trip startDate',
		min: Date.now,
	},
	ticker: {
		type: String,
		required: true
	},
	title: {
		type: String,
		required: 'Kindly enter the Trip title',
	},
	published: {
		type: Boolean,
		default: false,
		required: true
	},
	stages: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Stages',
		},
	],

}, { strict: false })//end Trip

TripSchema.pre('save', function (callback) {
	const trip = this;

	var day = new Date();
	day = moment(day).format('YYMMDD');

	const generatedTicker = [day, idGenerator()].join('-');
	trip.ticker = generatedTicker;

	callback();
})

//Indices: 	Indexar por peso los títulos, descripciones y tickers (de mayor a menor peso)
//			Indexar precio y fechas
//			indice unique de ticker

module.exports = mongoose.model('Trips', TripSchema)