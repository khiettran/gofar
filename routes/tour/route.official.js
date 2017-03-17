/**
 * Created by kira on 3/15/17.
 */
'use strict';
var TourOfficialService = require('../../services/tour/service.official');
var TourCruiseService = require('../../services/cruise/service.cruise');
var TourCruiseDetailService = require('../../services/cruise/service.cruise.detail');
var PlaceService = require('../../services/place/service.place');

module.exports = function (app) {

    app.get('/api/v1/tour/filter', function (req, res) {
        TourOfficialService.selectHotTrip(res, req.query.HotTrip, req.query.PageSize);
    });

    app.get('/api/v1/tour/:tourId/detail', function (req, res) {
        TourOfficialService.getTourDetailByTour(req.params.tourId).then(function (tourDetails) {
            if (!tourDetails) {
                res.status(200).jsonp({error: 'No found tour detail with id tour:' + req.params.tourId})
            } else {
                tourDetails[0].PlaceImages = [];
                TourCruiseService.getCruiseByTour(tourDetails[0].Id).then(function (cruises) {
                    if (!cruises) cruises = [];

                    TourCruiseDetailService.getCruiseDetails(cruises).then(function (cruiseDetails) {
                        if (!cruiseDetails) cruiseDetails = [];

                        PlaceService.getPlaceImageByCruise(cruiseDetails).then(function (images) {
                            if (!images) images = [];

                            tourDetails[0].PlaceImages = images;

                            res.status(200).jsonp(tourDetails);
                        })
                    })
                });
            }
        });
    });

    app.use('/api/v1/tourrating/', require('./route.rate'));

    app.use('/api/v1/tourcomment/', require('./route.comment'));
};