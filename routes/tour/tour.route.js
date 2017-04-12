/**
 * Created by kira on 4/10/17.
 */
'use strict';

let route = require('express').Router();
let tourService = require('../../services/tour/tour.service');

let Tour = function () {

    route.get('/api/v1/tour/filter', function (req, res) {
        tourService.selectHotTrip().then(function (value) {
            res.status(200).jsonp(value);
        })
    });

};

module.exports = Tour;