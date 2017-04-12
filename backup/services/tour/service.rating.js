/**
 * Created by kira on 3/15/17.
 */

let db = require('../../helpers/db');
let co = require('Co');

var TourRating = {
    getByTourAndAccount: function (res, tourId, accountId) {
        co (function* () {
            let rates = yield db.get().collection('dbo.TourRating').find({TourId: tourId, AccountId: accountId}).toArray();
            if (rates.length > 0) {
                res.status(200).jsonp(rates);
            } else {
                res.status(200).jsonp({message: 'No found rating for this tour'});
            }
        });

    },

    addRate: function (ratModel) {
        return db.get().collection('dbo.TourRating').insertOne(ratModel, function (err, insertedRate) {
            this.insertedRate = insertedRate;
        });
    },

    getInsertedRate: function () {
        return this.insertedRate;
    },

    uodateRate: function (ratModel) {
        //not implemented yet
    }
};
module.exports = TourRating;