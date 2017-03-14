/**
 * Created by kira on 3/14/17.
 */
'use strict';

var MongoClient = require('mongodb').MongoClient,
    co = require('co'),
    assert = require('assert');

exports.DbConfig = function () {
    var db = null;
    //noinspection JSUnresolvedFunction
    co(function*() {
        db = yield MongoClient.connect(dbUrl);
        return Promise.resolve(db);
    }).then(function (dbConnection) {
        db = dbConnection;
    }, function (err) {
        console.log(err);
    });


    return {
        MongoClient: MongoClient,
        Co: co,
        Assert: assert,
        DBConnection: db
    }
}