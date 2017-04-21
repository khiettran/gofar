/**
 * Created by kira on 4/12/17.
 */
'use strict';

const db = require('../helpers/db');
const co = require('Co');
const request = require('request');
const cheerio = require('cheerio');
const encodeURL = require('encodeurl');
const util = require('./utils');
const download = require('image-downloader');

let toutDetailImport = function () {
    co(function *() {
        try {
            let tours = yield db.get().collection('tour').find({}).toArray();

            const host = "https://travel.com.vn";
            if (tours.length > 0) {
                let i = 0;

                let interval = setInterval(function () {
                    if (i === tours.length - 1) {
                        clearInterval(interval);
                    }

                    let url = host + tours[i].href;
                    url = encodeURL(url);

                    request(url, function (err, response, body) {
                        if (response.statusCode !== 200) {
                            console.error('cannot load page with url:' + url);
                        } else {
                            let result = parseHtml(tours[i].id, body);
                            console.log('--Save to Database --');
                            try {
                                db.get().collection('tour-detail').insert(result.detailModel).then(function () {
                                    console.log('done inserting tours into db');
                                }, function (rejectedReason) {
                                    throw rejectedReason;
                                });
                            } catch (e) {
                                throw e.message;
                            }

                            console.log('-- Download file --');
                            let index = 0;
                            let interval1 = setInterval(function () {
                                let url1 = result.urlToDownload[index];
                                if (index == result.urlToDownload.length - 1) {
                                    clearInterval(interval1);
                                }

                                //add host for url that lack of host name
                                if (url1.indexOf('https') < 0) {
                                    url1 = host + url;
                                }

                                let options = {
                                    url: url1,
                                    dest: __dirname + '/../public/assets/images/tour/detail'
                                };

                                download.image(options).then(({filename, image}) => {
                                    console.log('downloaded file:' + filename);
                                }).catch((err) => {
                                    throw err.message
                                })
                            }, 5000);
                        }
                    });
                    i++;

                }, 10000);

            }
        } catch (e) {
            console.log(e.message)
        }
    });
};

function parseHtml(tour_id, content) {
    let urlsToDownload = [];
    // const path = __dirname + '/../public/assets/images/';
    const $ = cheerio.load(content);

    let detailModel = {};

    detailModel.tour_id = tour_id;

    const images = $('.slideShowImg').find('img');
    let slideImages = [];
    for (let i = 0; i < images.length; i++) {

        let src = $(images[i]).attr('src');
        urlsToDownload.push(src);

        slideImages.push({
            url: util.extractName(src),
            alt: $(images[i]).attr('alt').trim().replace(/\s\s+/g, ' ')
        });
    }

    detailModel.slide_images = slideImages;

    detailModel.total_seat = 100;
    detailModel.booked_seat = 0;

    let contents = $('.BoxContent').find('p');

    detailModel.start_location = $(contents[3]).find('b').text();
    detailModel.start_date = $(contents[2]).find('b').text();
    detailModel.dayNum = $(contents[1]).find('b').text().replace(' ngày', '');

    //this column will be removed soon.
    detailModel.tmp_available_seat = $(contents[4]).find('b').text();

    // TODO: download list dates
    // detailModel.list_dates_url = $(contents[2]).find('a').href;

    // tour detail content
    let tour_detail = $('.content.tour_detail');
    // let discount1 = $(tour_detail[2]).find('.price');
    // let discountObj = {
    //     itemDrop1: $(discount1[0]).innerHTML,
    //     itemDrop2: $(discount1[1]).innerHTML
    // }
    //
    // detailModel.discount1 = discountObj;
    //
    // let discount2 = $(tour_detail[3]).find('div');
    // let discount21 = $(discount2[1]).find('.price');
    // let discountObj = {
    //     description: $(discount2[0]).innerHTML,
    //     itemDrop1: $(discount21[0]).innerHTML,
    //     itemDrop2: $(discount21[1]).innerHTML
    // }
    //
    // detailModel.discount2 = discountObj;
    // detailModel.description = $($(tour_detail[0]).children()[2]).text();

    let contentHTML = $('.content');
    if (contentHTML.length === 9) {
        let div = $(contentHTML[1]).find('div');
        detailModel.original_price = $($(div[0]).children()[0]).text();
        detailModel.current_price = $($(div[1]).children()[0]).text();
        detailModel.description = $(tour_detail[3]).text();
    } else if (contentHTML.length === 7) {
        let div = $('.BoxPrice').find('div');
        detailModel.current_price = $($(div[0]).children()[0]).text();
    }

    let servicesHtml = $('.Service');
    let services = [];
    for (let i = 0; i < servicesHtml.length; i++) {

        let src = $(servicesHtml[i]).find('img').attr('src');
        urlsToDownload.push(src);

        let name = $(servicesHtml[i]).text();
        services.push({
            src: util.extractName(src),
            name: name.trim().replace(/\s\s+/g, ' ')
        });
    }

    detailModel.services = services;

    //days
    let daysHTML = $('#ChuongTrinhTour').find('li');
    let days = [];
    for (let i = 0; i < daysHTML.length; i++) {
        //remove style
        let name = $(daysHTML[i]).find('span').text();

        let img = $(daysHTML[i]).find('img');
        urlsToDownload.push(img.attr('src'));

        let image = {
            url: util.extractName(img.attr('src')),
            alt: img.attr('alt').trim().replace(/\s\s+/g, ' ')
        };

        days.push({
            name: name,
            image: image,
            description: $(daysHTML[i]).find('p').text().replace(/\s\s+/g, ' ')
        })
    }

    detailModel.days = days;

    // detail
    detailModel.detail = $('#ChiTietTour').html();

    //note
    detailModel.note = $('#ThongTinTour').text().trim().replace(/\s\s+/g, ' ');

    return {
        detailModel: detailModel,
        urlToDownload: urlsToDownload
    };
}

module.exports = toutDetailImport;