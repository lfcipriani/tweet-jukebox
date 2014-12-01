'use strict';

var config = require('./config');
var logger = require('./logger');
var Stream = require('./libs/' + config.twitter.capture_strategy + '_strategy');
var TwitterParser = require('./libs/twitter_parser');
var Music = require('./libs/music_controller');
var Commands = require('./libs/commands')(Music);
var Buttons = require('./libs/raspberrypi')(Music);

Stream.init();

Stream.onTweet(function(tweet) {
    logger.info("Tweet: " + tweet.text);
    execute(tweet);
});

Stream.onDM(function(dm) {
    logger.info("DM: " + dm.direct_message.text);
    execute(dm);
});

function execute(entity) {
    var request = TwitterParser.parse(entity);
    if (request) {
        logger.info("Request: " + JSON.stringify(request));
        var cmd = Commands.getCommand(request.type)
        if (cmd) { 
            cmd.run(request); 
        } else {
            logger.error("Disabled/Invalid command: " + request.type);
        }
    } else {
        logger.error("Not able to understand the request: " + JSON.stringify(entity));
    }
}

process.on('SIGINT', function () {
  logger.info('Exiting...');
  process.exit(0);
});
