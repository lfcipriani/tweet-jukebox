'use strict';

var _ = require('underscore');
var Twitter = require('../twitter_post');

module.exports = function(musicController, cmd) {

    var mopidy = musicController.getMopidyObj();

    function success(request) {
        if (cmd.post_reply_on_success) {
            Twitter.reply("status1", request);
        }
    }

    function error(request) {
        if (cmd.post_reply_on_error) {
            Twitter.reply("status2", request);
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
                    musicController.add(resultTracks[0].uri, function() {
                        musicController.getPlayerState(function(state){
                            if (state != "playing") {
                                musicController.play();
                            }
                        });
                        success(request);
                    });
                } else {
                    error(request);
                } 
            });

        }
    };
};
