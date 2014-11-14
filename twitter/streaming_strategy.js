"use strict";

var config = require('../config/config');
var Twit = require('twit');

var T = new Twit(config.twitter.api_keys);
var userStream;

module.exports = {

    init: function() {
        userStream = T.stream('user', { "with": "user" });
    },

    onTweet: function(callback) {
        userStream.on('tweet', function(tweet) {
            console.log(tweet);
            if (validReply(tweet)) {
                // TODO: implement rate limit
                callback(tweet);
            }
        });

        userStream.on('friends', function(friendsMsg) {
            console.log("Friends received... Capturing replies...");
        });
    }

};

function validReply(tweet) {
    return (!tweet.retweeted_status && 
            tweet.in_reply_to_screen_name && 
            tweet.in_reply_to_screen_name == config.twitter.jukebox);
}

