/**
 * Created by kira on 3/18/17.
 */
'use strict';

var Password = {
    extractSalt: function (hashedPassword) {
        return hashedPassword.split('$')[3];
    },

    extractHashed: function (hashedPassword) {
      let arr = hashedPassword.split('$');
      return arr[0] + arr[1] + arr[2];
    }
};

module.exports = Password;