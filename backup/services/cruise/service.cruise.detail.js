/**
 * Created by kira on 3/17/17.
 */

'use strict';

var db = require('../../helpers/db');
var jsonUtil = require('../../helpers/json')

var CruiseDetailService = {
    getCruiseDetails: function (cruises) {
        var _cruises = [];
        if (cruises instanceof Array) {
            _cruises.push(jsonUtil.toArrayValues(cruises, 'TourCruiseId'));
        } else {
            _cruises.push(cruises);
        }

        return db.get().collection('dbo.TourCruiseDetail').find({TourCruiseId: {$in: _cruises}}).toArray();
    }
};

module.exports = CruiseDetailService;