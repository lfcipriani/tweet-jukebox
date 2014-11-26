'use strict';

var _ = require('underscore');
var Twitter = require('../twitter_post');
var Track = require('../track_urls');

module.exports = function(musicController, cmd) {

    var mopidy = musicController.getMopidyObj();

    function success(request, data) {
        if (cmd.post_reply_on_success) {
            Twitter.reply("Thanks! Will be playing " + Track.getUrl(data[0].track) + " soon", request);
        }
    }

    function error(request) {
        if (cmd.post_reply_on_error) {
            Twitter.reply("Sorry! Not able to find music.", request);
        }
    }

    return {
        run: function(request) {

            mopidy.library.search(request.param).then(function(data) {
                var resultTracks = [];

                _.each(["spotify", "youtube", "soundcloud"], function(source){
                    _.each(data, function(result) {
                        if (_.str.startsWith(result.uri, source)) {
                            if (result.tracks) {
                                _.each(result.tracks, function(t) {
                                    resultTracks.push(t);
                                });
                            }
                        }
                    });
                });

                if (resultTracks.length > 0) {
                    console.log("Music: " + resultTracks[0].name);
                    musicController.add(resultTracks[0].uri, function(data) {
                        musicController.getPlayerState(function(state){
                            if (state != "playing") {
                                musicController.play();
                            }
                        });
                        success(request, data);
                    });
                } else {
                    error(request);
                } 
            });

        }
    };
};
