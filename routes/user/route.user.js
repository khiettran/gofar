/**
 * Created by kira on 3/17/17.
 */

var constants = require('../../common/constants');

module.exports = function (app) {
    app.get('api/v1/access/loginmember', function (req, res) {
        var email = req.body.email;
        var password = req.body.password;

        //validate input
        if (!(password.length >= 6 && password.length <= 64)) {
            res.status(500).jsonp({error: 'password length must be in range[6-64]'});
            return;
        }

        if (!constants.EMAIL_REGEX.test(email)) {
            res.status(500).jsonp({error: 'email is invalid'});
            return;
        }


    })
}