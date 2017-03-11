/**
 * Created by kira on 3/11/17.
 */
'use strict';

var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/travelmanagement');

var TourOfficial = require('../models/TourOfficial');

