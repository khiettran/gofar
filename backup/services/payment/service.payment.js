/**
 * Created by kira on 3/19/17.
 */
'use strict';

const db = require('../../helpers/db');
var paypal = require('paypal-rest-sdk');

paypal.configure({
    'model': 'sandbox',
    'client_id': 'AWgNmeuQ2P4jpyRRsqPRK_uwNM-xwbZC48hIhLONGIEM8NFbBEilsJKCv6kVcCKatDjZiSyf2LaURNzw',
    'client_secret': 'ENr5zHGjEXL4dMbRYc0XCUFalHu1CL7o-qFWwJN0Bw1Jy4rLqMesuY6y3N3L2IZ4b6XSM7Oztthfr70D'
});

var PaymentService = {
    getAccessToken: function () {
        
    },
    createBill: function (pmodel) {

    }
};

module.exports = PaymentService;