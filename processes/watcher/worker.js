'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    config = require(path.resolve('./config/env/development')),
    watch = require(path.resolve('./processes/watcher/watch'));

mongoose.connect(config.db.uri);

process.on('message', function(m) {
    console.log('CHILD got message:', m);
});

process.send({ foo: 'bar' });

watch.start();