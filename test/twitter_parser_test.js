var assert = require("assert");

var config = require('../config');
var tweetParser = require("../libs/twitter_parser");

describe('libs/twitter_parser', function(){

  describe('token verification', function(){

    it('should parse token verification requests', function() {
        tweet = {
            text: "@" + config.twitter.jukebox + " 1234",
            user: { screen_name: "lfcipriani"},
            id_str: "1234567"
        };

        var result = tweetParser.parse(tweet);

        assert.equal(result.type, "token");
        assert.equal(result.param, "1234");
        assert.equal(result.via, "tweet");        
    });

  });

  describe('URL parsing', function(){
    
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

        assert.equal(result.type, "link");
        assert.equal(result.param.source, "youtube");
        assert.equal(result.param.uri_part, "wZZ7oFKsKzY");
        assert.equal(result.via, "tweet");        
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

        assert.equal(result.type, "link");
        assert.equal(result.param.source, "spotify");
        assert.equal(result.param.uri_part, "4v0tapCyBcdyEbIpd1zZGU");
        assert.equal(result.via, "tweet");        
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

        assert.equal(result.type, "link");
        assert.equal(result.param.source, "soundcloud");
        assert.equal(result.param.uri_part, "lfcipriani/beastie-boys-i-dontt-know");
        assert.equal(result.via, "tweet");        
    });

  });

  describe('Search', function(){

    it('replaceWithSpaces', function() {
        var result = tweetParser.replaceWithSpaces("@testando_123 play like a virgin by madonna",0,13);
        assert.equal(result, "              play like a virgin by madonna");
    
        var result = tweetParser.replaceWithSpaces("@testando_1234play5like a virgin by madonna",14,18);
        assert.equal(result, "@testando_1234    5like a virgin by madonna");

        var result = tweetParser.replaceWithSpaces("@testando_123 play like a virgin by madonna",36,43);
        assert.equal(result, "@testando_123 play like a virgin by        ");
    });

    it('should parse search requests for music', function() {
        tweet = {
            text: "@" + config.twitter.jukebox + " like a virgin by madonna",
            user: { screen_name: "lfcipriani"},
            id_str: "1234567",
            entities: {
                "urls": [],
                "user_mentions": [
                {
                    "indices": [0,13],
                    "id_str": "76140129",
                    "id": 76140129,
                    "name": "Testando 1, 2, 3",
                    "screen_name": "testando_123"
                }
                ],
                "symbols": [],
                "hashtags": []
            }
        };
        var result = tweetParser.parse(tweet);

        assert.equal(result.type, "search");
        assert.notEqual(result.param["query"]["any"][0].indexOf("like a virgin by madonna"), -1);
        assert.equal(result.param["query"]["artist"], undefined);
        //assert.equal(result.param["query"]["artist"][0].indexOf("madonna"), -1);
        assert.equal(result.via, "tweet");        

        tweet = {
            text: "@" + config.twitter.jukebox + " play like a virgin",
            user: { screen_name: "lfcipriani"},
            id_str: "1234567",
            entities: {
                "urls": [],
                "user_mentions": [
                {
                    "indices": [0,13],
                    "id_str": "76140129",
                    "id": 76140129,
                    "name": "Testando 1, 2, 3",
                    "screen_name": "testando_123"
                }
                ],
                "symbols": [],
                "hashtags": []
            }
        };
        var result = tweetParser.parse(tweet);

        assert.equal(result.type, "search");
        assert.notEqual(result.param["query"]["any"][0].indexOf("play like a virgin"), -1);
        assert.equal(result.param["query"]["artist"], undefined);
        assert.equal(result.via, "tweet");        

        tweet = {
            text: "@" + config.twitter.jukebox + " play by madonna",
            user: { screen_name: "lfcipriani"},
            id_str: "1234567",
            entities: {
                "urls": [],
                "user_mentions": [
                {
                    "indices": [0,13],
                    "id_str": "76140129",
                    "id": 76140129,
                    "name": "Testando 1, 2, 3",
                    "screen_name": "testando_123"
                }
                ],
                "symbols": [],
                "hashtags": []
            }
        };
        var result = tweetParser.parse(tweet);

        assert.equal(result.type, "search");
        assert.equal(result.param["query"]["any"], "play by madonna");
        assert.equal(result.param["query"]["artist"], undefined);
        assert.equal(result.via, "tweet");        

        tweet = {
            text: "@" + config.twitter.jukebox + " play like a virgin by madonna",
            user: { screen_name: "lfcipriani"},
            id_str: "1234567",
            "entities": {
                "urls": [],
                "user_mentions": [
                {
                    "indices": [
                    0,
                    13
                    ],
                    "id_str": "76140129",
                    "id": 76140129,
                    "name": "Testando 1, 2, 3",
                    "screen_name": "testando_123"
                }
                ],
                "symbols": [],
                "hashtags": [
                {
                    "indices": [
                    44,
                    52
                    ],
                    "text": "youtube"
                }
                ]
            },
        };

        var result = tweetParser.parse(tweet);

        assert.equal(result.type, "search");
        assert.notEqual(result.param["uris"][0].indexOf("youtube"), -1);
        assert.equal(result.via, "tweet");        

        tweet = {
            text: "@" + config.twitter.jukebox + " play like a virgin by madonna",
            user: { screen_name: "lfcipriani"},
            id_str: "1234567",
            "entities": {
                "urls": [],
                "user_mentions": [
                {
                    "indices": [
                    0,
                    13
                    ],
                    "id_str": "76140129",
                    "id": 76140129,
                    "name": "Testando 1, 2, 3",
                    "screen_name": "testando_123"
                }
                ],
                "symbols": [],
                "hashtags": [
                {
                    "indices": [
                    44,
                    52
                    ],
                    "text": "youtube"
                },
                {
                    "indices": [
                    53,
                    64
                    ],
                    "text": "soundcloud"
                }
                ]
            },
        };
        var result = tweetParser.parse(tweet);

        assert.equal(result.type, "search");
        assert.notEqual(result.param["uris"][0].indexOf("youtube"), -1);
        assert.equal(result.param["uris"].length, 2);
        assert.equal(result.via, "tweet");        

        tweet = {
            text: "@" + config.twitter.jukebox + "",
            user: { screen_name: "lfcipriani"},
            id_str: "1234567",
            entities: {
                "urls": [],
                "user_mentions": [
                {
                    "indices": [0,13],
                    "id_str": "76140129",
                    "id": 76140129,
                    "name": "Testando 1, 2, 3",
                    "screen_name": "testando_123"
                }
                ],
                "symbols": [],
                "hashtags": []
            }
        };
        var result = tweetParser.parse(tweet);

        assert.equal(result, null);

    });

  });

  describe('DM commands', function(){

    it('should parse a hash command via DM', function() {
        dm = {
            "direct_message": {
                "id": 537050416513826800,
                "id_str": "537050416513826816",
                "text": "#ban lfcipriani,twitterapi",
                "sender_id": 2304673544,
                "sender_id_str": "2304673544",
                "sender_screen_name": config.twitter.admins[0],
                "recipient_id": 76140129,
                "recipient_id_str": "76140129",
                "recipient_screen_name": config.twitter.jukebox,
            }
        }

        var result = tweetParser.parse(dm);

        assert.equal(result.type, "ban");
        assert.equal(result.param.param[0], "lfcipriani");
        assert.equal(result.param.param[1], "twitterapi");
        assert.equal(result.via, "dm");
    });

    it('should parse a hash command via DM without parameters', function() {
        dm = {
            "direct_message": {
                "id": 537050416513826800,
                "id_str": "537050416513826816",
                "text": "#play",
                "sender_id": 2304673544,
                "sender_id_str": "2304673544",
                "sender_screen_name": config.twitter.admins[0],
                "recipient_id": 76140129,
                "recipient_id_str": "76140129",
                "recipient_screen_name": config.twitter.jukebox,
            }
        }

        var result = tweetParser.parse(dm);

        assert.equal(result.type, "play");
        assert.equal(result.param.param, null);
    });

    it('should not accept an invalid command', function() {
        dm = {
            "direct_message": {
                "id": 537050416513826800,
                "id_str": "537050416513826816",
                "text": "play blabla #hashtag",
                "sender_id": 2304673544,
                "sender_id_str": "2304673544",
                "sender_screen_name": config.twitter.admins[0],
                "recipient_id": 76140129,
                "recipient_id_str": "76140129",
                "recipient_screen_name": config.twitter.jukebox,
            }
        }

        var result = tweetParser.parse(dm);

        assert.equal(result, null);
    });

  });


});
