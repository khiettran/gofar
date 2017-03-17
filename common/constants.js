/**
 * Created by kira on 3/17/17.
 */
'use strict';

var Constants = {
    PASSWORD_LENGTH_MIN: 6,
    PASSWORD_LENGTH_MAX: 64,

    EMAIL_REGEX: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
};

module.exports = Constants;