/**
 * Created by kira on 3/15/17.
 */
'use strict';

var router = require('express').Router();
var TourRating = require('../../services/TourRating');

router.get('/detail/:tourId/:accountId', function (req, res) {
    TourRating.getByTourAndAccount(res, req.params.tourId, req.params.accountId);
});

module.exports = router;

