'use strict';

var config = require('../config');
var _ = require('underscore');

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

    extractUrl: function(tweet) {
        if (tweet["entities"] && tweet["entities"]["urls"]) {
            var urlList = tweet["entities"]["urls"];
            for (var u = 0; u < urlList.length; u++) {
                // SPOTIFY
                //https://embed.spotify.com/?uri=spotify:track:4v0tapCyBcdyEbIpd1zZGU"
                //spotify:track:4v0tapCyBcdyEbIpd1zZGU
                //http://open.spotify.com/track/4v0tapCyBcdyEbIpd1zZGU
                //https://play.spotify.com/track/4v0tapCyBcdyEbIpd1zZGU?play=true&utm_source=open.spotify.com&utm_medium=open
                var re = /spotify\.com\/track\/([^\&\?\/]+)|spotify:track:([^\&\?\/]+)/
                var result = urlList[u].expanded_url.match(re);
                result = _.reject(result, function(v) {return v == undefined;})
                if (result.length > 1) {
                    return {"spotify": result[1]};
                }

                // YOUTUBE
                // youtube.com/watch?v=, youtube.com/embed/, youtube.com/v/, youtu.be/
                var re = /youtube\.com\/watch\?v=([^\&\?\/]+)|youtube\.com\/embed\/([^\&\?\/]+)|youtube\.com\/v\/([^\&\?\/]+)|youtu\.be\/([^\&\?\/]+)/;
                var result = urlList[u].expanded_url.match(re);
                result = _.reject(result, function(v) {return v == undefined;})
                if (result.length > 1) {
                    return {"youtube": result[1]};
                }

                // SOUNDCLOUD
                // https://soundcloud.com/johnherrman/can-i-unfollow-please-at-zumba
                var re = /soundcloud\.com\/([^\&\?\/]+)\/([^\&\?\/]+)/
                var result = urlList[u].expanded_url.match(re);
                result = _.reject(result, function(v) {return v == undefined;})
                if (result.length > 1) {
                    return {"soundcloud": result[1] + "/" + result[2]};
                }
            }
        }
        return null;
    },

    extractSearch: function(tweet) {
        var text = tweet.text;
        text = text.replace("@"+config.twitter.jukebox, ""); // cleaning reply mention

        var terms = text.split(/\bby\b/);
        var param = {};
        var any = terms[0].match(/^\s(?:play\s)?(.*)/);
        if (any && any[1] != "") {
            param["any"] = [any[1]]; 
        } 
        if (terms.length > 1) {
            param["artist"] = terms[1];
        }

        return (_.isEmpty(param) ? null : param);
    }
};

module.exports = {
    parse: function(tweet) {
        var type = null;
        var param = null;

        // checking if this is a token user verification 
        param = parseUtil.extractToken(tweet);
        if (param) {
            type = "TOKEN";
        }

        // checking if user want to play an URL
        if (!type) {
            param = parseUtil.extractUrl(tweet);
            if (param) {
                type = "LINK";
            }
        }

        // checking if user want to search and play
        if (!type) {
            param = parseUtil.extractSearch(tweet);
            if (param) {
                type = "SEARCH";
            } else {
                return null;
            }
        }

        var via = "tweet";
        var fromUser = tweet.user.screen_name;
        var tweetId = tweet.id_str;

        return new TweetRequest(type, via, fromUser, tweetId, param);
    }
};


