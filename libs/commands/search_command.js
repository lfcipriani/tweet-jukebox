'use strict';

var _ = require('underscore');
var Twitter = require('../twitter_post');
var Track = require('../track_utils');
var logger = require('../../logger');

module.exports = function(musicController, cmd) {

    var mopidy = musicController.getMopidyObj();

    function success(request, data) {
        if (cmd.post_reply_on_success) {
            var next = data[0].tlid - musicController.getCurrentTrackId();
            var msg = null;
            if (musicController.getCurrentTrackId() == 0 || next == 0) {
                msg = "Playing " + Track.getUrl(data[0].track) + " right now";
            } else if (next == 1) {
                msg = "Next song will be " + Track.getUrl(data[0].track);
            } else {
                msg = "Will play " + Track.getUrl(data[0].track) + " after the next " + next + " songs";
            }
            Twitter.reply("Thanks! " + msg , request);
        }
    }

    function error(request) {
        if (cmd.post_reply_on_error) {
            Twitter.reply("Sorry! Not able to find music.", request);
        }
    }

    return {
        run: function(request) {

            // TODO: avoid accented chars when using soundcloud
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
                    logger.info("Music: " + resultTracks[0].name);
                    musicController.add(resultTracks[0].uri, function(data) {
                        success(request, data);
                    });
                } else {
                    error(request);
                } 
            });

        }
    };
};
