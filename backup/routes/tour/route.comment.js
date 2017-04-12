/**
 * Created by kira on 3/15/17.
 */
'use strict';

var router = require('express').Router();
var CommentService = require('.././tour/service.comment');
var Paging = require('../../helpers/paging');

router.get('/filter/:tourId', function (req, res) {
    CommentService.getTourComment(res, req.params.tourId, req.query.keyword, Number(req.query.pageNumber), Number(req.query.pageSize));
});

router.get('api/v1/tourcomment/add', function (req, res) {
    CommentService.addComment(req.body).then(function (r) {
        res.status(200).jsonp({message: 'inserted comment'});
    });
});

module.exports = router;