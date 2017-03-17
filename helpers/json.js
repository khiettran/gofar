/**
 * Created by kira on 3/17/17.
 */
'use strict';

var jsonUtil;
jsonUtil = {
    toArrayValues: function (arr, _key) {
        var values = [];
        arr.forEach(j => {
           Object.keys(j).find(function (key) {
               if (key == _key)
                   values.push(j[key]);
           })
        });

        return values;
    }
};

module.exports = jsonUtil;