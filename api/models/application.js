'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ApplicationSchema = new Schema( {
	creationMoment:{
		type: Date,
		required:'Kindly enter the Application creationMoment',
		default: Date.now,
	},
	paid:{
		type: Boolean,
		required:'Kindly enter the Application paid',
		default: false
	},
	rejectionReason:{
		type: String	
	},
	comments:{
		type: String,
	},
	status:[{
		type: String,
		default:"PENDING",
		required:'Kindly enter the Application status',
		enum:['PENDING','REJECTED','ACEPTED','DUE','CANCELLED']
	}],
	trip:{
		type:String,
		requred:'Kindly enter the Application trip',
	}

},{strict:false})//end Application

module.exports=mongoose.model('Applications',ApplicationSchema)