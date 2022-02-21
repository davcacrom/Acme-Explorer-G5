'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ConfigurationSchema = new Schema( {
	cachedPeriod:{
		type: Number,
		default: 1,
		min:0,
		max:24
	},
	numberResults:{
		type: Number,
		default: 10,
		min: 0,
		max: 100
	},

},{strict:false})//end Configuration

module.exports=mongoose.model('Configurations',ConfigurationSchema)