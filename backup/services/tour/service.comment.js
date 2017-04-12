/**
 * Created by kira on 3/15/17.
 */

'use strict';

let db = require('../../helpers/db');
let co = require('Co');

var CommentService = {
    getTourComment: function (res, tourId, keyword, pageNumber, pageSize) {
        co (function* () {
            if (keyword.length != 0) {
                db.get().collection.createIndex({"$**": "text"}, {name: "TextIndex"}).then(function (r) {

                });
                var comments = yield db.get().collection('dbo.TourComment').find({
                    $text: {$search: keyword},
                    TourId: tourId
                }).skip(Number(pageNumber)).limit(Number(pageSize)).toArray();

                var _response = {Data: {}};
                _response.Data.Items = comments;
                _response.Data.TotalItemCount = comments.length;
                _response.Data.PageNumber = pageNumber;
                _response.Data.PageCount = Paging.calculatePageCount(comments.length, pageSize);
                _response.Data.PageSize = pageSize;

                res.status(200).jsonp(_response);

            } else {
                var comments = yield db.get().collection('dbo.TourComment').find({TourId: tourId}).limit(Number(pageSize)).toArray();
                if (comments.length > 0) {
                    res.status(200).jsonp(comments);
                } else {
                    res.status(200).jsonp({message: 'No found comment for this tour'});
                }
            }
        });
    },

    addComment: function (cmtModel) {
        return db.get().collection('dbo.TourComment').insertOne(cmtModel, function (err, insertedComment) {
            this.insertedComment;
        });
    },

    getInsertedComment: function () {
        return this.insertedComment;
    }
};

module.exports = CommentService;
