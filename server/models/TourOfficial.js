/**
 * Created by kira on 3/11/17.
 */
'use strict';

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/travelmanagement');
var Schema = mongoose.Schema;

var tourOfficial = new Schema({
    "_id" : ObjectId,
    "BookNumber" : Number,
    "CreatedAt" : Date,
    "CreatedBy" : Number,
    "DateStart" : Date,
    "Id" : {type: Number, required:true, unique:true},
    "ogc_fid" : Number,
    "PriceAdult" : Number,
    "PriceChild" : Number,
    "PriceInfant" : 0,
    "PromotionRate" : Number,
    "StatusId" : Number,
    "TotalSeat" : Number,
    "TourId" :  Number,
    "UpdatedAt" : Date,
    "UpdatedBy" : Number,
    "ViewNumber" : Number
});

var TourOfficial = mongoose.model('TourOfficial', tourOfficial);

module.exports = TourOfficial;