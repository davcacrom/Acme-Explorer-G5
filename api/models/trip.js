'use strict'
const mongoose = require('mongoose')
const validator = require('validator')
const Schema = mongoose.Schema

const moment = require('moment')
const customAlphabet = require('nanoid').customAlphabet
const idGenerator = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 4)

function priceSetter(value) {
	return value != null ? value.toFixed(2) : value;
}

function endDateValidator(value) {
	return this.startDate <= value;
}

const TripSchema = new Schema({
	actor: {
		type: Schema.Types.ObjectId,
		ref: 'Actors',
		required: 'Kindly enter the Trip actor',
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
			validate: [v => validator.isURL(v, { protocols: ['http', 'https'] }), 'Please enter a valid URL']
		}
	],
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
		type: String
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
	stages: {
		type: [
			{
				description: {
					type: String,
					required: 'Kindly enter the Stage description',
				},
				price: {
					type: Number,
					required: 'Kindly enter the Stage price',
					min: 0.01,
					set: priceSetter
				},
				title: {
					type: String,
					required: 'Kindly enter the Stage title',
				},
			},
		],
		validate: [v => v.length >= 1, 'Must have at least one stage']
	}
}, { strict: false, toJSON: { virtuals: true } })//end Trip

TripSchema.virtual('price').get(function () {
	return this.stages.reduce((sum, stage) => sum + stage.price, 0);
});

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