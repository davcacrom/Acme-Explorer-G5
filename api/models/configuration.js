'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ConfigurationSchema = new Schema({
	cachedPeriod: {
		type: Number,
		default: 1,
		min: 1,
		max: 24,
		set: v => Math.round(v),
	},
	numberResults: {
		type: Number,
		default: 10,
		min: 1,
		max: 100,
		set: v => Math.round(v),
	},

}, { strict: false })//end Configuration

module.exports = mongoose.model('Configurations', ConfigurationSchema)