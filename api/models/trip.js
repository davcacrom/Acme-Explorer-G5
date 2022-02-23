'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const moment = require('moment')
const customAlphabet = require('nanoid').customAlphabet
const idGenerator = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 4)

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
	// Esta es una propiedad derivada
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
		type: String
	},
	title:{
		type: String,
		required:'Kindly enter the Trip title',
	},
	stages: [
		{
		  type: Schema.Types.ObjectId,
		  ref: 'Stages',
		},
	  ],

},{strict:false})//end Trip

TripSchema.pre('save', function (callback) {
	const trip = this
	
	var day = new Date();
	day=moment(day).format('YYMMDD'); 

	const generatedTicker = [day, idGenerator()].join('-')
	trip.ticker = generatedTicker

	callback()
  })

  //Indices: 	Indexar por peso los títulos, descripciones y tickers (de mayor a menor peso)
  //			Indexar precio y fechas
  //			indice unique de ticker

module.exports=mongoose.model('Trips',TripSchema)