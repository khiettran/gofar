/**
 * Created by kira on 3/17/17.
 */
'use strict';

var db = require('../../helpers/db');

var CruiseService = {
    getCruiseByTour: function (idTour) {
        return db.get().collection('dbo.TourCruise').find({TourId: idTour}).toArray();
    }
}

module.exports = CruiseService;