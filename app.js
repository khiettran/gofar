/**
 * Created by kira on 3/11/17.
 */

'use strict';


var express = require('express')
    , http = require('http')
    , path = require('path')
    , reload = require('reload');

var app = express();
var router = express.Router();
//
//app.set('db_connection', 'mongodb://localhost:27017/travelmanagement');
app.set('views', __dirname + '/views');
app.set('root', __dirname);
app.set('path', path);
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(express.logger('dev'));
app.use(express.static(__dirname + '/public/'));
//app.use(app.router);
//
//app.configure('development', function () {
//    app.use(express.errorHandler());
//});
require('routes/tour/tour.route');

app.get('/', function (req, res) {
    res.sendFile(app.get('path').join(app.get('views'), 'index.html'));
});

//require('./routes');
let db = require('./helpers/db');


// require('./routes/home/route.home')(app);
// require('./routes/tour/route.official')(app);

// Connect to Mongo on start
db.connect('mongodb://localhost:27017/gofar_db', function (err) {
    if (err) {
        console.log('Unable to connect to Mongo.')
        process.exit(1)
    } else {
        var server = http.createServer(app);

        reload(server, app, true);

        server.listen(3000, function () {
            console.log('server started on port: 3000!');
            process.send({ event:'online', url:'http://localhost:3000/'});
        });


    }
});
