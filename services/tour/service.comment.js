/**
 * Created by kira on 3/15/17.
 */
var db = require('../../helpers/db');

module.exports.getTourComment = function (res, tourId, keyword, pageNumber, pageSize) {
    if (keyword.length != 0) {
        db.get().collection.createIndex({"$**": "text"}, {name: "TextIndex"});
        db.get().collection('dbo.TourComment').find({$text: {$search: keyword}, TourId: tourId}).skip(Number(pageNumber)).limit(Number(pageSize)).toArray(function (err, docs) {
            if (docs) res.status(200).jsonp(docs);
        });
    } else {
        db.get().collection('dbo.TourComment').find({TourId: tourId}).limit(Number(pageSize)).toArray(function (err, docs) {
            if (docs) res.status(200).jsonp(docs);
        })
    }
};
