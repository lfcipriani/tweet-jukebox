var assert = require("assert");

var config = require('../config');
var tweetParser = require("../twitter/streaming_strategy");

describe('twitter/streaming_strategy', function(){

  describe('tweet validation', function(){

    it('should validate if tweets is really a reply for the proper user', function() {
        tweet = {
            in_reply_to_screen_name: config.twitter.jukebox,
            text: "@" + config.twitter.jukebox + " 1234",
            user: { screen_name: "lfcipriani"},
            id_str: "1234567"
        };

        assert.equal(tweetParser.validReply(tweet), true);
    });

  });

});
