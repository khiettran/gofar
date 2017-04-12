/**
 * Created by kira on 3/15/17.
 */
'use strict';

var TourOfficialService = require('.././tour/service.official');

module.exports = function (app) {

    app.get('/api/v1/tour/filter', function (req, res) {
        TourOfficialService.selectHotTrip(res, req.query.HotTrip, req.query.PageSize);
    });

    app.get('/api/v1/tour/:tourId/detail', function (req, res) {
        TourOfficialService.getTourDetailByTour(req.params.tourId).then(function (tour_details) {
            res.status(200).jsonp(tour_details);
        }, function (err) {
            throw err;
        });
    });

    app.use('/api/v1/tourrating/', require('./route.rate.js'));

    app.use('/api/v1/tourcomment/', require('./route.comment.js'));
};