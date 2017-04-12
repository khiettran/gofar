/**
 * Created by kira on 3/14/17.
 */
'use strict';

module.exports = function (app) {
    app.get('/', function (req, res) {
        res.sendFile(app.get('path').join(app.get('views'), 'index.html'));
    });
};