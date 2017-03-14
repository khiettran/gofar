/**
 * Created by kira on 3/11/17.
 */
'use strict';

var dbConfig = required('../helpers/dbHelper');
var dbConnection = dbConfig.DBConnection;

exports.create = function (BookNumber, CreateAt, CreatedBy, DateStart, Id, ogc_fid, PriceAdult, PriceChild,
                           PriceInfant, PromotionRate, StatusId, TotalSeat, TourId, UpdateAt, UpdateBy, ViewNumber) {

    let TourOfficial = {
        "BookNumber": BookNumber,
        "CreatedAt": CreateAt,
        "CreatedBy": CreatedBy,
        "DateStart": DateStart,
        "Id": Id,
        "ogc_fid": ogc_fid,
        "PriceAdult": PriceAdult,
        "PriceChild": PriceChild,
        "PriceInfant": PriceInfant,
        "PromotionRate": PromotionRate,
        "StatusId": StatusId,
        "TotalSeat": TotalSeat,
        "TourId": TourId,
        "UpdatedAt": UpdateAt,
        "UpdatedBy": UpdateBy,
        "ViewNumber": ViewNumber
    };

    //noinspection JSUnresolvedFunction
    dbConfig.Co(function*() {
        // Connection URL
        //var db = yield dbConfig.MongoClient.connect(dbUrl);

        // Insert a single document
        var r = yield dbConnection.collection('TourOfficial').insertOne(TourOfficial);
        dbConfig.Assert.equal(1, r.insertedCount);

        // Close connection
        db.close();
        console.log('Successfully create TourOfficial!')
    }).catch(function (err) {
        console.log(err.stack);
    });
};

exports.getByIdLimited = function (id, limited) {
    var tour_officials = [];
    //noinspection JSUnresolvedFunction
    dbConfig.Co(function*() {
        // Connection URL
        //var db = yield dbConfig.MongoClient.connect(dbUrl);

        // Get the collection
        var col = dbConnection.collection('TourOfficial');

        // Get first two documents that match the query
        var results = yield col.find({Id: id}).sort({BookNumber: -1}).limit(limited).toArray();
        db.close();
        console.log('Ended getTourOfficial By ID: ' + id);

        return Promise.resolve(results);

    }).then(function (values) {
        tour_officials = values;
        console.log('result:' + values);
    }, function (error) {
        console.log(error);
    });

    return tour_officials;
};

exports.getHotTrip = function (hot_trip, limited) {
    var tour_officials = [];
    dbConfig.Co(function*() {
        //var db = yield dbConfig.MongoClient.connect(dbUrl);
        var col = dbConnection.collection('TourOfficial');

        var results = null;
        if (hot_trip == true) {
            results = yield col.find({}).sort({BookNumber: -1}).limit(limited).toArray();
        } else {
           results = yield col.find({}).sort({CreatedAt: -1}).limit(limited).toArray();
        }
        Promise.resolve(results);
    }).then(function (values) {
        tour_officials = values;
    }, function (err) {
        console.log(err);
    });
    return tour_officials;
};