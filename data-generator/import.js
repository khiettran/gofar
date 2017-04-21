/**
 * Created by kira on 4/10/17.
 */
/**
 * Created by kira on 3/11/17.
 */

'use strict';


var express = require('express')
    , http = require('http')
    , path = require('path');

// var bodyParser = require('body-parser');
var app = express();
var db = require('../helpers/db');


app.set('views', __dirname + '/views');
app.set('root', __dirname);
app.set('path', path);
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(express.logger('dev'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

// app.use('/import-tour', require('./tour-import'));

// require('./tour-import')();

const td = require('./tour-detail-import');
// require('test');

// Connect to Mongo on start
db.connect('mongodb://localhost:27017/gofar-db', function (err) {
    if (err) {
        console.log('Unable to connect to Mongo.');
        // process.exit(1)
    } else {
        console.log('connected to mongo db');

        td();

        var server = http.createServer(app);
        // reload(server, app, true);

        server.listen(3001, function () {
            console.log('importing server started on port: 3001!');
            // process.send({ event:'online', url:'http://localhost:3000/'});
        });
    }
});
