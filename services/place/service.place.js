/**
 * Created by kira on 3/17/17.
 */

var db = require('../../helpers/db');
var jsonUtil = require('../../helpers/json');

var Place = {
    //get place image by cruise detail
    getPlaceImageByCruise: function (cruises) {
        var _cruise_values = [];
        if (cruises instanceof Array) {
            _cruise_values.push(jsonUtil.toArrayValues(cruises, 'PlaceId'));
        } else {
            _cruise_values.push(cruises);
        }

        return db.get().collection('dbo.PlaceImage').find({PlaceId: {$in: _cruise_values}}).toArray();
    }
};

module.exports = Place;