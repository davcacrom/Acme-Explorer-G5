'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FinderSchema = new Schema( {
	endDate:{
		type: Date,
	},
	keyword:{
		type: String,
	},
	maxPrice:{
		type: Number,
	},
	minPrice:{
		type: Number,
	},
	startDate:{
		type: Date,
	},
	actor:{
		type: Schema.Types.ObjectId,
		ref: 'Actors',
  	},

},{strict:false})//end Finder

module.exports=mongoose.model('Finders',FinderSchema)