'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ApplicationSchema = new Schema( {
	creationMoment:{
		type: Time,
		required:'Kindly enter the Application creationMoment',
	},
	paid:{
		type: boolean,
		required:'Kindly enter the Application paid',
	},
	rejectionReason:{
		type: String,
		required:'Kindly enter the Application rejectionReason',
	},
	status:[{
		type: String,
		default:pending,
		required:'Kindly enter the Application status',
		enum:['PENDING','REJECTED','ACEPTED','DUE','CANCELLED']
	}],

},{strict:false})//end Application

module.exports=mongoose.model('Applications',ApplicationSchema)