'use strict';

var config = require('./config');
var Stream = require('./twitter/' + config.twitter.capture_strategy + '_strategy');
var TweetParser = require('./commands/tweet_parser');
var Music = require('./music_controller/mopidy');

Stream.init();

var currentTrack = 0;

Stream.onTweet(function(tweet) {
    var request = TweetParser.parse(tweet);

    console.log("Tweet: "+tweet.text);
    if (request) {
        console.log("Request from @"+ request.fromUser +": " + request.type + " " + JSON.stringify(request.param));
        if (request.type == "SEARCH") {
            var music = Music.search(request.param, function(m) {
                if (m) {
                    console.log("Music: " + m.name + "\n("+JSON.stringify(m)+")" );
                    Music.add(m.uri, function() {
                        Music.getPlayerState(function(state){
                            if (state != "playing") {
                                Music.play();
                            }
                        });
                    });
                } else {
                    console.log("Didn't find a music...");
                }
            });
        }
    }
});

