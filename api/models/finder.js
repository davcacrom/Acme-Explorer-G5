'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

function endDateValidator(value) {
	return this.startDate <= value;
}

function priceSetter(value) {
	return value.toFixed(2);
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
	maxPrice: {
		type: Number,
		default: null,
		min: 0,
		set: priceSetter
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

module.exports = mongoose.model('Finders', FinderSchema)