/**
 * Created by kira on 3/17/17.
 */

var db = require('../../helpers/db');
var jsonUtil = require('../../helpers/json');

var Place = {
    //get place image by cruise detail
    getPlaceImageByCruise: function (cruises) {
        var _cruisevalues = [];
        if (cruises instanceof Array) {
            _cruisevalues.push(jsonUtil.toArrayValues(cruises, 'PlaceId'));
        } else {
            _cruisevalues.push(cruises);
        }

        return db.get().collection('dbo.PlaceImage').find({PlaceId: {$in: _cruisevalues}}).toArray();
    }
};

module.exports = Place;