'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TripSchema = new Schema( {
	cancelationReason:{
		type: String,
	},
	description:{
		type: String,
		required:'Kindly enter the Trip description',
	},
	endDate:{
		type: Date,
		required:'Kindly enter the Trip endDate',
	},
	pictures:{
		type: String,
	},
	price:{
		type: Number,
		required:'Kindly enter the Trip price',
	},
	requirements:{
		type: String,
		required:'Kindly enter the Trip requirements',
	},
	startDate:{
		type: Date,
		required:'Kindly enter the Trip startDate',
	},
	ticker:{
		type: String,
		required:'Kindly enter the Trip ticker',
	},
	title:{
		type: String,
		required:'Kindly enter the Trip title',
	},

},{strict:false})//end Trip

module.exports=mongoose.model('Trips',TripSchema)