/**
 * Created by kira on 3/14/17.
 */
'use strict';

var MongoClient = require('mongodb').MongoClient,
    co = require('co'),
    assert = require('assert');
const connection_string = 'mongodb://localhost:27017/travelmanamgement';

module.exports.DBHelper = function () {

    return {
        MongoClient: MongoClient,
        Co: co,
        Assert: assert,
        Connection: connection_string
    }
}