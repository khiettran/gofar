/**
 * Created by kira on 3/11/17.
 */
'use strict';

var db = require('../helpers/db');

module.exports.selectHotTrip = function (res, hot_trip, page_size) {
    page_size = Number(page_size);
    if (hot_trip) {

        return db.get().collection('dbo.TourOfficial').find({}).sort({BookNumber: -1}).
            limit(page_size).toArray(function (err, docs) {
                if (docs) {
                    res.status(200).jsonp(docs);
                }
            });
    } else {
        return db.get().collection('dbo.TourOfficial').find({}).sort({CreateAt: -1}).
            limit(page_size).toArray(function (err, docs) {
                if (docs) {
                    res.status(200).jsonp(docs);
                }
            });
    }
};

module.exports.getTourDetailByIdTour = function (res, id) {
    return db.get().collection('dbo.TourOfficial').find({TourId: Number(id)}).toArray(function (err, docs) {
        console.log(docs);
        if (docs) res.status(200).jsonp(docs);
    });
}

module.exports.getRating = function (res, tourId, accountId) {
    return db.get().collection('dbo.TourOfficial').find({AccountId: Number(id)}).toArray(function (err, docs) {
        console.log(docs);
        if (docs) res.status(200).jsonp(docs);
    });
}

//module.exports.create = function (BookNumber, CreateAt, CreatedBy, DateStart, Id, ogc_fid, PriceAdult, PriceChild,
//                           PriceInfant, PromotionRate, StatusId, TotalSeat, TourId, UpdateAt, UpdateBy, ViewNumber) {
//
//    let TourOfficial = {
//        "BookNumber": BookNumber,
//        "CreatedAt": CreateAt,
//        "CreatedBy": CreatedBy,
//        "DateStart": DateStart,
//        "Id": Id,
//        "ogc_fid": ogc_fid,
//        "PriceAdult": PriceAdult,
//        "PriceChild": PriceChild,
//        "PriceInfant": PriceInfant,
//        "PromotionRate": PromotionRate,
//        "StatusId": StatusId,
//        "TotalSeat": TotalSeat,
//        "TourId": TourId,
//        "UpdatedAt": UpdateAt,
//        "UpdatedBy": UpdateBy,
//        "ViewNumber": ViewNumber
//    };
//
//    //noinspection JSUnresolvedFunction
//    //dbConfig.Co(function*() {
//    //    // Connection URL
//    //    //var db = yield dbConfig.MongoClient.connect(dbUrl);
//    //
//    //    // Insert a single document
//    //    var r = yield dbConnection.collection('TourOfficial').insertOne(TourOfficial);
//    //    dbConfig.Assert.equal(1, r.insertedCount);
//    //
//    //    // Close connection
//    //    db.close();
//    //    console.log('Successfully create TourOfficial!')
//    //}).catch(function (err) {
//    //    console.log(err.stack);
//    //});
//};
//
//var findHotTrip = function (db, hot_trip, page_size, callback) {
//    var collection = db.collection('dbo.TourOfficial');
//    if (hot_trip == true) {
//        collection.find({}).sort({BookNumber: -1}).limit(page_size).toArray(function (err, docs) {
//            if (err) throw err;
//            callback(docs);
//        });
//    } else {
//        collection.find({}).sort({CreateAt: -1}).limit(page_size).toArray(function (err, docs) {
//           callback(docs);
//        });
//    }
//};