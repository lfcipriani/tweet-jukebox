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

mopidy.on("event:trackPlaybackStarted", function (data) {
    console.log("NOW PLAYING: "+JSON.stringify(data));
});

mopidy.on("event:trackPlaybackEnded", function (data) {
    var lastTrack = data;
    mopidy.tracklist.getLength().then(function(data) {
        // are we on the last track of tracklist?
        if ((data - 1) == lastTrack.tl_track.tlid) {
            mopidy.tracklist.clear();
            console.log("cleaning playlist");
        }
    });
});

module.exports = {
    isOnline: mopidyOnline,
    getMopidyObj: function(){
        return mopidy;
    },

    play: function() {
        mopidy.playback.play();
    },

    pause: function() {
        mopidy.playback.pause();
    },

    next: function() {
        mopidy.playback.next();
    },

    clear: function() {
        mopidy.tracklist.clear();
    },

    add: function(uri, callback) {
        var that = this;
        mopidy.tracklist.add({"tracks": null, "at_position": null, "uri": uri}).then(function(data){
            if (data.length > 0) {
                console.log("Music added");
                that.getPlayerState(function(state){
                    if (state != "playing") {
                        that.play();
                    }
                });
                callback(data);
            } 
        });
    },

    getPlayerState: function(callback) {
        mopidy.playback.getState().then(function(data){
            console.log("Player state: "+ data);
            callback(data);
        });
    }
};

// ref.
// tracklist.next_track
// event:playbackStateChanged { old_state: 'stopped', new_state: 'playing' }
