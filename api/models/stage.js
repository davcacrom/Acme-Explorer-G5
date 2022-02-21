'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema

const StageSchema = new Schema( {
	description:{
		type: String,
		required:'Kindly enter the Stage description',
	},
	price:{
		type: Number,
		required:'Kindly enter the Stage price',
	},
	title:{
		type: String,
		required:'Kindly enter the Stage title',
	},

},{strict:false})//end Stage

module.exports=mongoose.model('Stages',StageSchema)