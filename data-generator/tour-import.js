/**
 * Created by kira on 4/10/17.
 */
'use strict';

// const request = require('request');
// const readerUtils = require('../util')
const read = require('read-file');
const cheerio = require('cheerio');
// const data = readerUtils.readTours();
// const $ = cheerio.load(data);
const download = require('image-downloader');
const db = require('../helpers/db');
// const Promise = require('bluebird');
const encodeURL = require('encodeurl');

var tourImport = function () {

    console.log('start importing tours into db');

    read(__dirname + '/data/tours.html', function (err, buffer) {
        if (err) throw err;
        let $ = cheerio.load(buffer);

        let tour_list = [];
        const item_list = $('#ulTours').find($('.tour-item'));

        for (let i = 0; i < item_list.length; i++) {
            let tourModel = {};
            let img = {};
            img.alt = $(item_list[i]).find('img').attr('alt');

            tourModel.href = $($(item_list[i]).find('a')[0]).attr('href');
            tourModel.id = tourModel.href.split('/')[1].replace('tour', '');
            img.src = $(item_list[i]).find('img').attr('src');
            tourModel.img = img;
            // tourModel.days = $($(item_list[i]).find($('.songay'))).text().trim().split(' ')[0];
            //
            // tourModel.started_date = $($(item_list[i]).find('a')[1]).text().trim();
            // let origin_price = $($(item_list[i]).find('del')).text();

            // origin_price = origin_price ? origin_price : '';
            // tourModel.origin_price = origin_price.trim().replace(' đ', '');
            // tourModel.price = $($(item_list[i]).find($('.giaban'))).text().trim().replace(' đ', '');

            tourModel.createdAt = new Date().toDateString();

            //Math.floor(Math.random() * (max - min + 1)) + min;
            tourModel.bookNum = Math.floor(Math.random() * (101));

            tourModel.status = "Active";

            tourModel.urlToDownload = $(item_list[i]).find('img').attr('src');
            let arr_url = tourModel.urlToDownload.split('/');
            img.src = arr_url[arr_url.length - 1];
            tourModel.img = img;

            tour_list.push(tourModel);
        }

        // let i = 0;
        // let interval = setInterval(function () {
        //     if (i === tour_list.length - 1) {
        //         clearInterval(interval);
        //         console.log('Total: ' + i + ' images');
        //
        //     }
        //
        //     let url = encodeURL(tour_list[i].urlToDownload);
        //
        //     const options = {
        //         url: url,
        //         dest: __dirname + '/../public/assets/images/tour/'
        //     };
        //
        //     download.image(options).then(({filename, image}) => {
        //         console.log('downloaded file:' + filename);
        //         i++;
        //
        //     }).catch((err) => {
        //         console.log(err.message);
        //     });
        // }, 1000);

        try {
            db.get().collection('tour').insertMany(tour_list).then(function () {
                console.log('done inserting tours into db');
            }, function (rejectedReason) {
                throw rejectedReason;
            });
        } catch (e) {
            console.log(e)
        }
    });
};

module.exports = tourImport;