/**
 * Created by kira on 3/15/17.
 */
var router = require('express').Router();
var CommentService = require('../../services/tour/service.comment');

router.get('/filter/:tourId', function (req, res) {
    CommentService.getTourComment(res, req.params.tourId, req.query.keyword, Number(req.query.pageNumber), Number(req.query.pageSize));
});

module.exports = router;