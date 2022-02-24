'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema

function priceSetter(value) {
	return value.toFixed(2);
}

const StageSchema = new Schema({
	description: {
		type: String,
		required: 'Kindly enter the Stage description',
	},
	price: {
		type: Number,
		required: 'Kindly enter the Stage price',
		min: 0,
		set: priceSetter
	},
	title: {
		type: String,
		required: 'Kindly enter the Stage title',
	},

}, { strict: false })//end Stage

module.exports = mongoose.model('Stages', StageSchema)