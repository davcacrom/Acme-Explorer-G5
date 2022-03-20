'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

function rejectionReasonValidator(value) {
	if (this.status === 'REJECTED')
		return value && value.length > 0;
	else
		return value === null || value === undefined;
}

const ApplicationSchema = new Schema({
	creationMoment: {
		type: Date,
		default: Date.now,
		required: true
	},
	rejectionReason: {
		type: String,
		// validate: [rejectionReasonValidator, 'Please enter a rejection reason']
	},
	comments: {
		type: String,
	},
	status: {
		type: String,
		required: 'Kindly enter the Application status',
		enum: ['PENDING', 'REJECTED', 'ACCEPTED', 'DUE', 'CANCELLED'],
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