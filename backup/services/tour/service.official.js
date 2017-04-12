/**
 * Created by kira on 3/11/17.
 */
'use strict';

var db = require('../../helpers/db');
var co = require('co');
var jsonUtil = require('../../helpers/json');

var TourOfficialService = {
    getTourDetailByTour: function (id) {
        id = Number(id);

        let result = co.wrap(function* () {

             var officials = yield db.get().collection('dbo.TourOfficial').find({TourId: id}).toArray();

            if (officials.length > 0) {

                officials[0].PlaceImages = [];

                // get cruise from tour
                var cruises = yield db.get().collection('dbo.TourCruise').find({TourId: officials[0].Id}).toArray();
                if (cruises.length > 0) {
                    cruises = jsonUtil.toArrayValues(cruises, 'TourCruiseId');

                    // get cruise detail
                    var c_details = yield db.get().collection('dbo.TourCruiseDetail').find({TourCruiseId: {$in: cruises}}).toArray();

                    if (c_details.length > 0) {
                        c_details = jsonUtil.toArrayValues(c_details, 'PlaceId');
                        let images = db.get().collection('dbo.PlaceImage').find({PlaceId: {$in: c_details}}).a();
                        if (images.length > 0) {
                            officials[0].PlaceImages = images;
                        }
                    }
                }
                return yield Promise.resolve(officials);
            } else {
                return yield Promise.reject("cannot load tour detail");
            }
        });

        return result(true);
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

