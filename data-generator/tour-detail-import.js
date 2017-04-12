/**
 * Created by kira on 4/12/17.
 */
'use strict';

const db = require('../helpers/db');
const co = require('Co');
const request = require('request');
const cheerio = require('cheerio');
const encodeURL = require('encodeurl');

let toutDetailImport = function () {
    co(function *() {
        try {
            let tours = yield db.get().collection('tour').find({}).toArray();
            const host = "https://travel.com.vn";
            if (tours) {
                let i = 0;

                var interval = setInterval(function () {
                    if (i === tours.length - 1) {
                        clearInterval(interval);
                    }

                    let url = host + tours[i].href;
                    url = encodeURL(url);

                    request(url, function (err, response, body) {
                        if (response.statusCode !== 200) {
                            console.error('cannot load page with url:' + url);
                        } else {
                            parseHtml(tours[i].id, body);
                        }
                    });
                    i++;

                }, 1000);
            }
        } catch (e) {
            console.log(e.message)
        }
    });
};

function parseHtml(tour_id, content) {
    const path = __dirname + '/../public/assets/images/';
    const $ = cheerio.load(content);

    var details = [];
    var detailModel = {};

    detailModel.tour_id = tour_id;

    const images = $('.slideShowImg').find('img');
    let slideImages = [];
    for (let i = 0; i < images.length; i ++) {
        let src = $(images[i]).attr('src').split('/');
        // let length ==
        slideImages.push({
            //TODO: download image
            downloadURL: $(images[i]).attr('src'),
            url: '',
            alt: $(images[i]).attr('alt')
        });
    }

    detailModel.slide_images = slideImages;

    detailModel.total_seat = 100;
    detailModel.booked_seat = 0;

    let contents = $('.BoxContent').find('p');

    detailModel.start_location = $(contents[3]).find('b').innerHTML;

    //this column will be removed soon.
    detailModel.tmp_available_seat = $(contents[4]).find('b').innerHTML;

    //TODO: download list dates
    detailModel.list_dates_url = $(contents[2]).find('a').href;

    // tour detail content
    let tour_detail = $('.content.tour_detail').find('div');
    let discount1 = $(tour_detail[2]).find('.price');
    let discountObj = {
        itemDrop1: $(discount1[0]).innerHTML,
        itemDrop2: $(discount1[1]).innerHTML
    }

    detailModel.discount1 = discountObj;

    let discount2 = $(tour_detail[3]).find('div');
    let discount21 = $(discount2[1]).find('.price');
    let discountObj = {
        description: $(discount2[0]).innerHTML,
        itemDrop1: $(discount21[0]).innerHTML,
        itemDrop2: $(discount21[1]).innerHTML
    }

    detailModel.discount2 = discountObj;
    detailModel.description = $(tour_detail[4]).innerHTML;

    let servicesHtml = $('.service');
    let services = [];
    for (let i = 0; i < services.length; i++) {
        //todo: download image
        let src = $(servicesHtml[i]).find('img').src;
        let name = $(servicesHtml[i]).innerHTML;
        services.push({
           src: src,
            name: name
        });
    }

    detailModel.services = services;

    //days
    let daysHTML = $('#ChuongTrinhTour').find('li');
    let days = [];
    for (let i = 0; i < daysHTML.length; i ++) {
        //remove style
        let name = $(daysHTML[i]).find('#ngay' + i);
        name.attr('style', '');

        let img = $(daysHTML[i]).find('img');
        let length = img.attr('src').split('/').length;
        let url = __dirname + '/../public/assets/images/tour/days/' + img.attr('src').split('/')[length - 1];
        let image = {
            //TODO: download image
            downloadURL: img.attr('src'),
            url: url,
            alt: img.attr('alt')
        };

        //remove all src and href refer to travel.com.vn
        img.attr('src', url);

        let tag_a = $(daysHTML[i]).find('a');
        for (let j = 0; j < tag_a.length; j ++) {
            $(tag_a[j]).attr('href', '#');
        }

        days.push({
            name: name.html(),
            image: image,
            description: $(daysHTML[i]).html()
        })
    }
}

module.exports = toutDetailImport;