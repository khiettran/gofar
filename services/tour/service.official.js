/**
 * Created by kira on 3/11/17.
 */
'use strict';

var db = require('../../helpers/db');
// var co = require('co');
var jsonUtil = require('../../helpers/json');

var TourOfficialService = {
    getTourDetailByTour: function (id) {
        id = Number(id);
        return db.get().collection('dbo.TourOfficial').find({TourId: id}).toArray();
    },

    selectHotTrip: function (res, hot_trip, page_size) {
        page_size = Number(page_size);
        if (hot_trip) {

            return db.get().collection('dbo.TourOfficial').find({}).sort({BookNumber: -1}).limit(page_size).toArray(function (err, docs) {
                if (docs) {
                    res.status(200).jsonp(docs);
                }
            });
        } else {
            return db.get().collection('dbo.TourOfficial').find({}).sort({CreateAt: -1}).limit(page_size).toArray(function (err, docs) {
                if (docs) {
                    res.status(200).jsonp(docs);
                }
            });
        }
    }
};

module.exports = TourOfficialService;

