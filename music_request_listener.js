'use strict';

var config = require('./config');
var Stream = require('./libs/' + config.twitter.capture_strategy + '_strategy');
var TwitterParser = require('./libs/twitter_parser');
var Music = require('./libs/music_controller');
var Commands = require('./libs/commands')(Music);

Stream.init();

Stream.onTweet(function(tweet) {
    console.log("Tweet: " + tweet.text);
    execute(tweet);
});

Stream.onDM(function(dm) {
    console.log("DM: " + dm.direct_message.text);
    execute(dm);
});

function execute(entity) {
    var request = TwitterParser.parse(entity);
    if (request) {
        console.log("Request: " + JSON.stringify(request));
        var cmd = Commands.getCommand(request.type)
        if (cmd) { 
            cmd.run(request); 
        } else {
            console.log("Disabled/Invalid command: " + request.type);
        }
    } else {
        console.log("Not able to understand the request: " + JSON.stringify(entity));
    }
}
