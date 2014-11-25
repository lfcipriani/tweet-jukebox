'use strict';

var _ = require('underscore');

module.exports = function(musicController, cmd) {

    var mopidy = musicController.getMopidyObj();

    return {
        run: function(request, success, error) {

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
                        success();
                    });
                } else {
                    error();
                } 
            });

        }
    };
};
