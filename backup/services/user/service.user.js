/**
 * Created by kira on 3/17/17.
 */
'use strict';

var db = require('../../helpers/db');
var secret = require('password-hash-and-salt');
var PasswordUtil = require('../../helpers/password');
var auth = require('tokens')();
var constants = require('../../common/constants');

var UserService = {
    login: function (email) {
        return db.get().collection('dbo.Account').find({Email: email}).toArray();
    },

    signUp: function (email, password) {
        var AccountInstance = {
            Id: -1,
            PasswordSalt: '',
            HashedPassword: '',
            Email: '',
            RoleId: 2,
            CreateAt: Date.now
        };
        AccountInstance.Email = email;

        secret(password).hash(function (error, hash) {
            if (error) throw new Error('something went wrong!');

            AccountInstance.passwordSalt = PasswordUtil.extractSalt(hash);
            AccountInstance.HashedPassword = PasswordUtil.extractHashed(hash);

            secret('hack').verifyAgainst(hash, function (error, verified) {
                if (error) throw new Error('Oops!, something went wrong!');
            });
        });
        AccountInstance.Id = db.getNextSequenceValue(db, 'dbo.Account', 'Id');

        return db.get().collection('dbo.Account').insertOne(AccountInstance, function (err, insertedObjected) {
            if (err) throw err;

            this.insertedAccount = insertedObjected;
        });
    },

    signUpFB: function (account) {
        var id = db.getNextSequenceValue(db, 'dbo.Account', 'Id');
        var newAccount = {
            Id: id,
            FacebookId: account.FacebookId,
            CreateAt: Date.now
        };

        return db.get().collection('dbo.Account').insertOne(newAccount, function (err, insDocs) {
            this.insertedAccount = insDocs;
        });
    },

    saveSessionToken: function () {
        var accountInstance = this.insertedAccount;
        auth.createSession(function (response) {

            var AccountSession = {
                Id: db.getNextSequenceValue(db, 'dbo.AccountSession', 'Id'),
                DeviceTypeId: constants.DEVICES.Web,
                AccountId: accountInstance.Id,
                ExpirationAt: response.expirationDateTime,
                SessionTokenGuid: response.sessionToken
            };

            return db.get().collection('dbo.AccountSession').insertOne(AccountSession, function (err, insertedObject) {
                if (err) throw err;
                this.insertedAccountSession = insertedObject;
            });
        }, function (err) {
            throw err;
        })
    },

    logOut: function () {
        var updatedSession = this.insertedAccountSession;
        if (!updatedSession) return true;

        updatedSession.SessionTokenGuid = '';
        updatedSession.ExpirationAt = Date.now;
        return db.get().collection('dbo.AccountSession').findOneAndUpdate(this.insertedAccountSession, {$set: updatedSession},
            function (err, updatedDoc) {
                if (err) throw err;
                console.log('doc AccountSession:' + updatedDoc + ' was updated');
            });
    },

    saveProfile: function () {
        var newAccount = {
            Id: this.insertedAccount.Id,
            CreatedAt: Date.now,
            LastOnlineAt: Date.now
        }
        db.get().collection('dbo.AccountProfile').insertOne(newAccount, function (err, ins) {
            this.insertedProfile = ins;
        }).then(function (r) {
            if (r) console.log('inserted profile');
        });
    },

    saveProfileParams: function (username, fullname) {
        if (!id) id = db.getNextSequenceValue(db, 'dbo.AccountProfile', 'Id');
        let profile = {
            Id: this.getInsertedAccount().Id,
            Username: username,
            FullName: fullname
        }

        db.get().collection('dbo.AccountProfile').insertOne(profile, function (err, insertedProfile) {
            if (err) throw err;
            this.insertedProfile = insertedProfile;
        }).then(function (r) {

        })
    },

    getInsertedAccount: function () {
        return this.insertedAccount;
    },

    getAccountSession: function () {
        return this.insertedAccountSession;
    },

    getInsertedProfile: function () {
        return this.insertedProfile;
    }
};

module.exports = UserService;
