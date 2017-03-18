'use strict';

var MongoClient = require('mongodb').MongoClient

var state = {
    db: null
}

exports.connect = function (url, done) {
    if (state.db) return done();

    MongoClient.connect(url, function (err, db) {
        if (err) return done(err);
        state.db = db;
        done()
    })
};

exports.get = function () {
    return state.db
};

exports.close = function (done) {
    if (state.db) {
        state.db.close(function (err, result) {
            state.db = null;
            state.mode = null;
            done(err)
        })
    }
};

exports.getNextSequenceValue = function (db, collectionName, seq_name) {
    var sequenceDocument = db.get().collection(collectionName).findAndModify({
        query: {_id: seq_name},
        update: {$inc: {sequence_value: 1}},
        new: true
    });
    return sequenceDocument.sequence_value;
};