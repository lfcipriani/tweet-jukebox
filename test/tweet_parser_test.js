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

  });

});
