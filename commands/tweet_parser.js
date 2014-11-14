'use strict';

var config = require('../config');

var TweetRequest = function(type, via, fromUser, tweetId, param) {
    this.type = type;
    this.via = via;
    this.fromUser = fromUser;
    this.tweetId = tweetId;
    this.param = param;
}

var parseUtil = {
    extractToken: function(tweet) {
        var re = new RegExp("^@"+ config.twitter.jukebox +" (\\d{4})$", "i"); 
        var result = tweet.text.match(re);
        if (result) { result = result[1] }
        return result;
    },
    extractHashCommand: function(tweet) {},
    extractUrl: function(tweet) {},
    extractSearch: function(tweet) {}
};

module.exports = {
    parse: function(tweet) {
        var type = null;

        // checking if this is a token user verification 
        var token = parseUtil.extractToken(tweet);
        if (token) {
            var type = "TOKEN";
            var param = token;
        }

        // checking if user want to play an URL
        if (!type) {
            return null;
        }

        var via = "tweet";
        var fromUser = tweet.user.screen_name;
        var tweetId = tweet.id_str;

        return new TweetRequest(type, via, fromUser, tweetId, param);
    }
};


