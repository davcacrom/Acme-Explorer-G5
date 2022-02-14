'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FinderSchema = new Schema( {
	endDate:{
		type: Date,
	},
	keyword:{
		type: string,
	},
	maxPrice:{
		type: double,
	},
	minPrice:{
		type: double,
	},
	startDate:{
		type: Date,
	},

},{strict:false})//end Finder

module.exports=mongoose.model('Finders',FinderSchema)