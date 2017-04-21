/**
 * Created by kira on 4/17/17.
 */
'use strict';

var phantomjs = require('phantomjs-prebuilt');
var program = phantomjs.exec(__dirname + '/load-data.js');
program.stdout.pipe(process.stdout);
program.stderr.pipe(process.stderr);
program.on('exit', code => {
    console.log('Phantom Browser ended!');
})