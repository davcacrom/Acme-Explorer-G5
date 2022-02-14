'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ConfigurationSchema = new Schema( {
	cachedPeriod:{
		type: Date,
	},
	numberResults:{
		type: number,
	},

},{strict:false})//end Configuration

module.exports=mongoose.model('Configurations',ConfigurationSchema)