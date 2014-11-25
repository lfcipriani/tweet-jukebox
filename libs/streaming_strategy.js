"use strict";

var config = require('../config');
var Twit = require('twit');

var T = new Twit(config.twitter.api_keys);
var userStream;

module.exports = {

    init: function() {
        userStream = T.stream('user', { "with": "user" });
    },

    onTweet: function(callback) {
        var that = this;
        userStream.on('tweet', function(tweet) {
            if (that.validReply(tweet)) {
                // TODO: implement rate limit
                callback(tweet);
            }
        });

        userStream.on('friends', function(friendsMsg) {
            console.log("Friends received... Capturing replies...");
        });
    },

    onDM: function(callback) {
        var that = this;
        userStream.on('direct_message', function(directMsg) {
            if (validDm(directMsg)) {
                callback(directMsg);
            }
        });
    },

    validReply: function(tweet) {
        return (!tweet.retweeted_status && 
                tweet.in_reply_to_screen_name && 
                tweet.in_reply_to_screen_name == config.twitter.jukebox);
    },

    validDm: function(dm) {
        var admins = config.twitter.admins;
        for (var i = 0; i < admins.length; i++) {
            if (dm["direct_message"]["sender_screen_name"] == admins[i]) {
                return true;
            }
        }
        return false;
    }
};

