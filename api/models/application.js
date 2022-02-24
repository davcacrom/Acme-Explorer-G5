'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ApplicationSchema = new Schema({
	creationMoment: {
		type: Date,
		default: Date.now,
		required: true
	},
	paid: {
		type: Boolean,
		default: false,
		required: true
	},
	rejectionReason: {
		type: String
	},
	comments: {
		type: String,
	},
	status: {
		type: String,
		required: 'Kindly enter the Application status',
		enum: ['PENDING', 'REJECTED', 'ACEPTED', 'DUE', 'CANCELLED'],
		default: 'PENDING'
	},
	trip: {
		type: Schema.Types.ObjectId,
		ref: 'Trips',
	},
	actor: {
		type: Schema.Types.ObjectId,
		ref: 'Actors',
	},

}, { strict: false })//end Application

// Indexar aplicaciones por status

module.exports = mongoose.model('Applications', ApplicationSchema)