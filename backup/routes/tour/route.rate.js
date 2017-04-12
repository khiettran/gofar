/**
 * Created by kira on 3/15/17.
 */
'use strict';

var router = require('express').Router();
var RatingService = require('.././tour/service.rating');

router.get('/detail/:tourId/:accountId', function (req, res) {
    RatingService.getByTourAndAccount(res, req.params.tourId, req.params.accountId);
});

router.get('api/v1/tourrating/add', function (req, res){
    RatingService.addRate(req.body).then(function (r) {
        let insertedRate = RatingService.getInsertedRate();
        res.status(200).jsonp(insertedRate);
    });
});

router.get('tourRatingUpdate', function (req, res) {

})
module.exports = router;

