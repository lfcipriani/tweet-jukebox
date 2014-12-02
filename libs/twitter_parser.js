'use strict';

var config = require('../config');
var _ = require('underscore');
_.str = require('underscore.string');

var TwitterRequest = function(type, via, fromUser, id, param) {
    this.type = type;
    this.via = via;
    this.fromUser = fromUser;
    this.id = id;
    this.param = param;
}

var spaceIt = function(str, startIndex, endIndex) {
    return str.slice(0, startIndex) 
        + _.str.repeat(" ", endIndex - startIndex) 
        + str.slice(endIndex, str.length);
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
                    return {source: "spotify", "uri_part": result[1]};
                }

                // YOUTUBE
                // youtube.com/watch?v=, youtube.com/embed/, youtube.com/v/, youtu.be/
                var re = /youtube\.com\/watch\?v=([^\&\?\/]+)|youtube\.com\/embed\/([^\&\?\/]+)|youtube\.com\/v\/([^\&\?\/]+)|youtu\.be\/([^\&\?\/]+)/;
                var result = urlList[u].expanded_url.match(re);
                result = _.reject(result, function(v) {return v == undefined;})
                if (result.length > 1) {
                    return {source: "youtube", "uri_part": result[1]};
                }

                // SOUNDCLOUD
                // https://soundcloud.com/johnherrman/can-i-unfollow-please-at-zumba
                var re = /soundcloud\.com\/([^\&\?\/]+)\/([^\&\?\/]+)/
                var result = urlList[u].expanded_url.match(re);
                result = _.reject(result, function(v) {return v == undefined;})
                if (result.length > 1) {
                    return {source: "soundcloud", "uri_part": result[1] + "/" + result[2]};
                }
            }
        }
        return null;
    },

    extractSearch: function(tweet) {
        var text = tweet.text;

        var param = { "query": null, "uris": null };

        // cleaning text
        var uris = [];
        if (tweet["entities"] && tweet["entities"]["hashtags"]) {
            var hashtags = tweet["entities"]["hashtags"];
            for (var i = 0; i < hashtags.length; i++) {
                if (_.contains(["spotify", "youtube", "soundcloud"], hashtags[i]["text"])) {
                    uris.push(hashtags[i]["text"] + ":");
                    text = spaceIt(text, hashtags[i]["indices"][0], hashtags[i]["indices"][1]); 
                }
            }
        }

        if (tweet["entities"] && tweet["entities"]["urls"]) {
            var urls = tweet["entities"]["urls"];
            for (var i = 0; i < urls.length; i++) {
                text = spaceIt(text, urls[i]["indices"][0], urls[i]["indices"][1]); 
            }
        }

        if (tweet["entities"] && tweet["entities"]["user_mentions"]) {
            var mentions = tweet["entities"]["user_mentions"];
            for (var i = 0; i < mentions.length; i++) {
                text = spaceIt(text, mentions[i]["indices"][0], mentions[i]["indices"][1]); 
            }
        }

        text = _.str.clean(text);
        text = _.str.unescapeHTML(text);
        text = _.str.slugify(text).replace(/-/g," ");

        // building search
        var terms = text.split(/\bby\b/i);
        var any = terms[0];
        var query = {};
        if (any && any != "") {
            query["any"] = [any]; 
        } 
        if (terms.length > 1) {
            query["artist"] = [terms[1].trim()];
        }

        if (_.isEmpty(query)) { query = null }
        if (_.isEmpty(uris)) { uris = null }

        if (query || uris) {
            return { "query": query, "uris": uris };
        } else {
            return null;
        }
    },

    extractHashCommand: function(str) {
        var result = str.match(/^#(\S+)\s?(\S+)?/i);
        if (result) {
            var obj = {};
            obj.cmd = result[1];
            obj.param = (result[2] ? result[2].split(",") : null);
            return obj;
        } else {
            return null;
        }
    }
};

module.exports = {
    replaceWithSpaces: function(str, startIndex, endIndex) {
        return spaceIt(str, startIndex, endIndex);
    },

    parse: function(tweet) {
        var type = null;
        var param = null;
        var via = null;
        var fromUser = null;
        var id = null;

        if (tweet.direct_message) {

            via = "dm";
            fromUser = tweet.direct_message.sender_screen_name;
            id = tweet.direct_message.id_str;

            param = parseUtil.extractHashCommand(tweet.direct_message.text);
            if (param) {
                type = param.cmd; 
            } else {
                return null;
            }

        } else {

            via = "tweet";
            fromUser = tweet.user.screen_name;
            id = tweet.id_str;
        
            // checking if this is a token user verification 
            param = parseUtil.extractToken(tweet);
            if (param) {
                type = "token";
            }

            // checking if user want to play an URL
            if (!type) {
                param = parseUtil.extractUrl(tweet);
                if (param) {
                    type = "link";
                }
            }

            // checking if user want to search and play
            if (!type) {
                param = parseUtil.extractSearch(tweet);
                if (param) {
                    type = "search";
                } else {
                    return null;
                }
            }
        }

        return new TwitterRequest(type, via, fromUser, id, param);
    }
};


