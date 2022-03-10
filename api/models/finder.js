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
	return value != null ? value.toFixed(2) : value;
}

const FinderSchema = new Schema({
	endDate: {
		type: Date,
		default: null,
		validate: [endDateValidator, 'End date must be greater than start date']
	},
	keyword: {
		type: String,
		default: null
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
	// Comprobar tiempo de caché y actualizar si es necesario
	callback();
});

FinderSchema.post('find', function (callback) {
	// Comprobar tiempo de caché y actualizar si es necesario
});

module.exports = mongoose.model('Finders', FinderSchema)