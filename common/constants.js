/**
 * Created by kira on 3/17/17.
 */
'use strict';

var Constants = {
    PASSWORD_LENGTH_MIN: 6,
    PASSWORD_LENGTH_MAX: 64,

    EMAIL_REGEX: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,

    STATUS_ID: {
        Active: 1,
        Inactive: 2,
        Locked: 3,
        Deleted: 4,
        Rejected: 5,
        AdminRemoved: 10,
        SelfRemoved: 11
    },

    DEVICES: {
        iOS: 1,
        Android: 2,
        Other: 3,
        Web: 4
    }
};

module.exports = Constants;