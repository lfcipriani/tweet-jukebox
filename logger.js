'use strict';

var fs = require('fs');
var config = require('./config');
var winston = require('winston'); 

var basePath = config.log_base_path;
if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath);
}

var logger = new (winston.Logger)({
    transports: [
	new (winston.transports.Console)()
        //new winston.transports.File({ json: false, filename: basePath + '/tweet_jukebox.log', level: config.log_level })
    ],
    exceptionHandlers: [
        new winston.transports.Console(),
        //new winston.transports.File({ json: false, filename: basePath + '/exceptions.log', level: config.log_level })
    ],
    exitOnError: false
  });

module.exports = logger;

