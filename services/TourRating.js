/**
 * Created by kira on 3/15/17.
 */

var db = require('../helpers/db');

module.exports.getByTourAndAccount = function (res, tourId, accountId) {
    //TODO: remove constant value
    db.get().collection('dbo.TourRating').find({TourId: 2, AccountId: 39}).toArray(function (err, docs) {
        if (docs) res.status(200).jsonp(docs)
    })
}