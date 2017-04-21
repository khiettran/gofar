/**
 * Created by kira on 4/10/17.
 */
'use strict';

var baseRoute = function (app) {

    //home
    app.get('/', function (req, res) {
        res.sendFile(app.get('path').join(app.get('views'), 'index.html'));
    });

};

module.exports = baseRoute;