'use strict';

var config = require('../config');
var Mopidy = require('mopidy');
var _ = require('underscore');
_.str = require('underscore.string');

var mopidy = new Mopidy({
    webSocketUrl: "ws://localhost:6680/mopidy/ws/",
    callingConvention: "by-position-or-by-name"
});

var mopidyOnline = false;

mopidy.on("state:online", function () {
    mopidyOnline = true; 
});

mopidy.on("state:offline", function () {
    mopidyOnline = true; 
});

module.exports = {
    isOnline: mopidyOnline,

    play: function() {
        mopidy.playback.play();
    },

    pause: function() {
        mopidy.playback.pause();
    },

    add: function(uri) {
        mopidy.tracklist.add({"uri": uri}).then(function(data){
            if (data.result && data.result.length > 0) {
                // added
                console.log("added");
            } else {
                // not added
                console.log("not added");
            }
        });
    },

    search: function(query, callback) {
        mopidy.library.search(query).then(function(data) {
            var resultTracks = [];

            _.each(["spotify", "youtube", "soundcloud"], function(source){
                _.each(data, function(result) {
                    if (_.str.startsWith(result.uri, source)) {
                        if (result.tracks) {
                            _.each(result.tracks, function(t) {
                                resultTracks.push(t);
                            });
                            //console.log(_.map(result.tracks, function(d){ return d["uri"] + " > " + d["name"] }));
                        }
                    }
                });
            });

            if (resultTracks.length > 0) {
                callback(resultTracks[0]);
            } else {
                callback(null);
            } 
        }); 
    }

    next: function() {
        mopidy.playback.next();
    },

    clear: function() {
        mopidy.tracklist.clear();
    }
};

// tracklist.get_length 
// playback.get_current_tl_track
// tracklist.next_track
// core.playback.get_state, stopped, paused, playing on result

