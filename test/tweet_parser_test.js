var assert = require("assert");

var config = require('../config');
var tweetParser = require("../commands/tweet_parser");

describe('commands/tweet_parser', function(){

  describe('token verification', function(){

    it('should parse token verification requests', function() {
        tweet = {
            text: "@" + config.twitter.jukebox + " 1234",
            user: { screen_name: "lfcipriani"},
            id_str: "1234567"
        };

        var result = tweetParser.parse(tweet);

        assert.equal(result.type, "TOKEN");
        assert.equal(result.param, "1234");
    });

    it('should parse links from youtube', function() {
        tweet = {
            text: "@" + config.twitter.jukebox + " play ",
            user: { screen_name: "lfcipriani"},
            id_str: "1234567",
            "entities": {
                "urls": [
                    {
                        "indices": [76,97],
                        "display_url": "dev.twitter.com/terms/display-…",
                        "expanded_url": "https://www.youtube.com/watch?v=wZZ7oFKsKzY",
                        "url": "https://t.co/Ed4omjYs"
                    }
                ]
            }
        };

        var result = tweetParser.parse(tweet);

        assert.equal(result.type, "LINK");
        assert.equal(result.param["youtube"], "wZZ7oFKsKzY");
    });

    it('should parse links from spotify', function() {
        tweet = {
            text: "@" + config.twitter.jukebox + " play ",
            user: { screen_name: "lfcipriani"},
            id_str: "1234567",
            "entities": {
                "urls": [
                    {
                        "indices": [76,97],
                        "display_url": "dev.twitter.com/terms/display-…",
                        "expanded_url": "http://open.spotify.com/track/4v0tapCyBcdyEbIpd1zZGU",
                        "url": "https://t.co/Ed4omjYs"
                    }
                ]
            }
        };

        var result = tweetParser.parse(tweet);

        assert.equal(result.type, "LINK");
        assert.equal(result.param["spotify"], "4v0tapCyBcdyEbIpd1zZGU");
    });

    it('should parse links from soundcloud', function() {
        tweet = {
            text: "@" + config.twitter.jukebox + " play madonna",
            user: { screen_name: "lfcipriani"},
            id_str: "1234567",
            "entities": {
                "urls": [
                    {
                        "indices": [76,97],
                        "display_url": "dev.twitter.com/terms/display-…",
                        "expanded_url": "https://soundcloud.com/lfcipriani/beastie-boys-i-dontt-know",
                        "url": "https://t.co/Ed4omjYs"
                    }
                ]
            }
        };

        var result = tweetParser.parse(tweet);

        assert.equal(result.type, "LINK");
        assert.equal(result.param["soundcloud"], "lfcipriani/beastie-boys-i-dontt-know");
    });

    it('should parse search requests for music', function() {
        tweet = {
            text: "@" + config.twitter.jukebox + " play like a virgin by madonna",
            user: { screen_name: "lfcipriani"},
            id_str: "1234567",
            "entities": {
                "hashtags": [{ "text": "ftw" }]
            }
        };
        var result = tweetParser.parse(tweet);

        assert.equal(result.type, "SEARCH");
        assert.notEqual(result.param["query"]["any"][0].indexOf("like a virgin"), -1);
        assert.notEqual(result.param["query"]["artist"].indexOf("madonna"), -1);

        tweet = {
            text: "@" + config.twitter.jukebox + " play like a virgin",
            user: { screen_name: "lfcipriani"},
            id_str: "1234567"
        };
        var result = tweetParser.parse(tweet);

        assert.equal(result.type, "SEARCH");
        assert.notEqual(result.param["query"]["any"][0].indexOf("like a virgin"), -1);
        assert.equal(result.param["query"]["artist"], undefined);

        tweet = {
            text: "@" + config.twitter.jukebox + " play by madonna",
            user: { screen_name: "lfcipriani"},
            id_str: "1234567"
        };
        var result = tweetParser.parse(tweet);

        assert.equal(result.type, "SEARCH");
        assert.equal(result.param["query"]["any"], undefined);
        assert.notEqual(result.param["query"]["artist"].indexOf("madonna"), -1);

        tweet = {
            text: "@" + config.twitter.jukebox + " play like a virgin by madonna",
            user: { screen_name: "lfcipriani"},
            id_str: "1234567",
            "entities": {
                "hashtags": [{ "text": "youtube" }]
            }
        };
        var result = tweetParser.parse(tweet);

        assert.equal(result.type, "SEARCH");
        assert.notEqual(result.param["uris"][0].indexOf("youtube"), -1);

        tweet = {
            text: "@" + config.twitter.jukebox + " play like a virgin by madonna",
            user: { screen_name: "lfcipriani"},
            id_str: "1234567",
            "entities": {
                "hashtags": [{ "text": "youtube" }, { "text": "soundcloud" }]
            }
        };
        var result = tweetParser.parse(tweet);

        assert.equal(result.type, "SEARCH");
        assert.notEqual(result.param["uris"][0].indexOf("youtube"), -1);
        assert.equal(result.param["uris"].length, 2);

        tweet = {
            text: "@" + config.twitter.jukebox + "",
            user: { screen_name: "lfcipriani"},
            id_str: "1234567"
        };
        var result = tweetParser.parse(tweet);

        assert.equal(result, null);

    });

  });

});
