'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DashboardSchema = new Schema({
  tripsPerManager: {
    type: Object
  },
  applicationsPerTrip: {
    type: Object
  },
  tripsPrices: {
    type: Object
  },
  applicationsRatio: {
    type: Object
  },
  findersAveragePrice: {
    type: Object
  },
  findersTopKeywords: {
    type: Object
  },
  explorersExpensesCubeByYear: {
    type: Object
  },
  explorersExpensesCubeByMonth: {
    type: Object
  },
  computationMoment: {
    type: Date,
    default: Date.now
  },
  rebuildPeriod: {
    type: String
  }
}, { strict: false })

DashboardSchema.index({ computationMoment: -1 })

module.exports = mongoose.model('Dashboards', DashboardSchema)
