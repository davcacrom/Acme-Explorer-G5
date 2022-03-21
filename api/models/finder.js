'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

function endDateValidator(value) {
	return this.startDate <= value;
}

function maxPriceValidator(value) {
	return this.minPrice <= value;
}

function priceSetter(value) {
	return value != null ? parseFloat(value.toFixed(2)) : value;
}

const KEYWORD_REGEXP = /^[^\s]+$/;
function keywordValidator(value) {
	return value === null || value.match(KEYWORD_REGEXP);
}

const FinderSchema = new Schema({
	endDate: {
		type: Date,
		default: null,
		validate: [endDateValidator, 'End date must be greater than start date']
	},
	keyword: {
		type: String,
		default: null,
		validate: [keywordValidator, 'Keyword must be just one word']
	},
	lastUpdate: {
		type: Date,
		default: null,
	},
	maxPrice: {
		type: Number,
		default: null,
		min: 0,
		set: priceSetter,
		validate: [maxPriceValidator, 'Maximum price must be greater than min price']
	},
	minPrice: {
		type: Number,
		default: null,
		min: 0,
		set: priceSetter
	},
	startDate: {
		type: Date,
		default: null
	},
	actor: {
		type: Schema.Types.ObjectId,
		ref: 'Actors',
		unique: true,
	},
	trips: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Trips',
		},
	],

}, { strict: false })//end Finder

FinderSchema.pre('save', function (callback) {
	this.lastUpdate = new Date();
	callback();
});

const Trip = mongoose.model('Trips')
const Config = mongoose.model('Configurations')
FinderSchema.methods.updateTrips = async function (save) {
	const config = await Config.findOne();

	this.trips = (await Trip.find({
		$or: [
			{ ticker: { $regex: this.keyword } },
			{ title: { $regex: this.keyword } },
			{ descripcion: { $regex: this.keyword } }
		],
		startDate: { $gte: this.startDate },
		endDate: { $lte: this.endDate },
		price: { $gte: this.minPrice, $lte: this.maxPrice }
	}, { limit: config.numberResults })).map(trip => trip._id);
	this.lastUpdate = new Date();
}

module.exports = mongoose.model('Finders', FinderSchema)