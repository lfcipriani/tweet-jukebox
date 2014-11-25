var assert = require("assert");

var config = require('../config');
var tweetParser = require("../libs/streaming_strategy");

describe('libs/streaming_strategy', function(){

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

  describe('dm validation', function(){

    it('should validate if DMs are coming from admins', function() {
        dm = {
            "direct_message": {
                "id": 537050416513826800,
                "id_str": "537050416513826816",
                "text": "olá amigo #ban http://t.co/cBRTm4zse1",
                "sender_id": 2304673544,
                "sender_id_str": "2304673544",
                "sender_screen_name": config.twitter.admins[0],
                "recipient_id": 76140129,
                "recipient_id_str": "76140129",
                "recipient_screen_name": config.twitter.jukebox,
                "created_at": "Tue Nov 25 01:09:31 +0000 2014",
                "entities": {
                    "hashtags": [{
                        "text": "ban",
                        "indices": [10, 14]
                    }],
                    "symbols": [],
                    "user_mentions": [],
                    "urls": [{
                        "url": "http://t.co/cBRTm4zse1",
                        "expanded_url": "http://t.co/fabric",
                        "display_url": "t.co/fabric",
                        "indices": [15, 37]
                    }]
                }
            }
        }

        assert.equal(tweetParser.validDm(dm), true);
    });

    it('should validate if DMs are NOT coming from admins', function() {
        dm = {
            "direct_message": {
                "id": 537050416513826800,
                "id_str": "537050416513826816",
                "text": "olá amigo #ban http://t.co/cBRTm4zse1",
                "sender_id": 2304673544,
                "sender_id_str": "2304673544",
                "sender_screen_name": "nonexistentuser",
                "recipient_id": 76140129,
                "recipient_id_str": "76140129",
                "recipient_screen_name": config.twitter.jukebox,
                "created_at": "Tue Nov 25 01:09:31 +0000 2014",
                "entities": {
                    "hashtags": [{
                        "text": "ban",
                        "indices": [10, 14]
                    }],
                    "symbols": [],
                    "user_mentions": [],
                    "urls": [{
                        "url": "http://t.co/cBRTm4zse1",
                        "expanded_url": "http://t.co/fabric",
                        "display_url": "t.co/fabric",
                        "indices": [15, 37]
                    }]
                }
            }
        }

        assert.equal(tweetParser.validDm(dm), false);
    });


  });
});
