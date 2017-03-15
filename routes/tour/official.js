/**
 * Created by kira on 3/15/17.
 */
'use strict';
var TourOfficial = require('../../services/TourOfficial');

module.exports = function (app) {

    app.get('/api/v1/tour/filter', function (req, res) {
        TourOfficial.selectHotTrip(res ,req.query.HotTrip, req.query.PageSize);
    });

    app.get('/api/v1/tour/:tourId/detail', function (req, res) {
        TourOfficial.getTourDetailByIdTour(res, req.params.tourId);
    });

    app.use('/api/v1/tourrating/', require ('./rate'));

    app.use('/api/v1/tourcomment/', require('./route.comment'))
};