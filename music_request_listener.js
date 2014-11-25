'use strict';

var config = require('./config');
var Stream = require('./libs/' + config.twitter.capture_strategy + '_strategy');
var TwitterParser = require('./libs/twitter_parser');
var Music = require('./libs/music_controller');
var Commands = require('./libs/commands')(Music);

Stream.init();

Stream.onTweet(function(tweet) {
    var request = TwitterParser.parse(tweet);

    console.log("Tweet: "+tweet.text);
    if (request) {
        console.log("Request from @"+ request.fromUser +": " + request.type + " " + JSON.stringify(request.param));

        Commands.getCommand(request.type).run(request, 
            function(){ console.log("cmd success") }, 
            function(){ console.log("cmd error") }
        );
    }
});

Stream.onDM(function(dm) {
    // direct_message
    //  sender_screen_name
    //  text
    //  recipient_screen_name
    //  entities
    var request = TwitterParser.parse(dm);
    console.log(JSON.stringify(dm));
});

