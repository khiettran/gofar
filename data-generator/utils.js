/**
 * Created by kira on 4/10/17.
 */
'use strict';



var Utils =  {
    // readTours: function () {
    //     var data = '';
    //     reader(__dirname + '/data/tours.html', 'utf8', function (err, content) {
    //         data = content;
    //     });
    //
    //     return data;
    // }

    extractName: function (url) {
        if (!url) return '';

        const __url = url.split('/');
        const length = __url.length;

        if (length < 1) return '';

        return __url[length - 1];
    }
};

module.exports = Utils;