/**
 * Created by kira on 4/17/17.
 */
'use strict';

var page = require('webpage').create();
console.log('runnnn');
page.open('https://travel.com.vn/du-lich-viet-nam-p1.aspx', function (status) {
    page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js", function () {
        page.evaluate(function () {
            let length = $('.ShowMore').length;
            console.log(length);
        });
        phantom.exit()
    });
});