/**
 * Created by kira on 3/17/17.
 */

var constants = require('../../common/constants');
var userService = require('.././user/service.user');

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

        userService.login(email).then(function (user) {
            if (!user) res.status(404).jsonp({error: 'email does not exists'});
            else {
                if (user[0].StatusId != constants.STATUS_ID.Active) {
                    res.status(500).jsonp({error: 'User was ' + user[0].StatusId});
                } else {
                    res.status(200).jsonp(user[0]);
                }
            }
        }, function (err) {
            throw err;
        })
    });


    app.get('api/v1/user/signup', function (req, res) {
        var account = req.body.model;
        userService.login(account.Email).then(function (user) {
            var error = '';
            if (user) {
                error.concat('Email is already exists \n');
            } else {
                if (!constants.EMAIL_REGEX.test(account.Email))
                    error.concat('Email format is invalid \n');

                if (account.Password != account.RePassword)
                    error.concat('Password does not match \n');
                if (!(account.Password.length >=6 && account.length <=64))
                    error.concat('Password length must be in range [6-64]');
            }

            if (error == '') {
                userService.signUp(account.Email, account.Password).then(function (r) {
                    let account = userService.getInsertedAccount();
                    userService.saveProfile();
                    userService.saveSessionToken();
                    account.AccountProfile = userService.getInsertedProfile();
                    res.status(200).jsonp(account);
                })
            }
        });
    });

    app.get('api/v1/access/logout', function (req, res) {
        userService.logOut().then(function (r) {
            res.status(200).jsonp({message: 'User logged out'});
        })
    });

    app.get('api/v1/user/signupfb', function (req, res) {
        var account = req.body;
        userService.signUpFB(account).then(function (r) {
            if (r < 1) throw 'ERROR: cannot login Facebook';
            userService.saveSessionToken();
            userService.saveProfileParams(account.AccountProfile.Username, account.AccountProfile.FullName);
            let _account = userService.getInsertedAccount();
            _account.AccountProfile = userService.getInsertedProfile();
            _account.SessionToken = userService.getAccountSession().SessionTokenGuid;
            res.status(200).jsonp(_account);
        });
    })
};