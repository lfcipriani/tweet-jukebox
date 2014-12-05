'use strict';

var config = require('../config');
var logger = require('../logger');
var Lcd    = require('../' + config.hardware.lcd.lib);
var Mopidy = require('mopidy');
var Twitter = require('./twitter_post');
var Track = require('./track_utils');
var status = require('./service_status');
var _ = require('underscore');
_.str = require('underscore.string');

var mopidy = new Mopidy({
    webSocketUrl: "ws://localhost:6680/mopidy/ws/",
    callingConvention: "by-position-or-by-name"
});

var mopidyOnline = false;
var currentTrackId = null;
var lastTrackIdAdded = null;
var tracksUser = {};

mopidy.on("state:online", function () {
    mopidyOnline = true; 
    Lcd.setLine(1,status.setMopidyStatus(true));
    logger.info("Mopidy Online");
    mopidy.playback.getCurrentTlTrack({}).then(function(data){
        if (data) {
            currentTrackId = data.tlid;
            logger.info("Current track: " + JSON.stringify(data));
        }
        mopidy.tracklist.getTlTracks({}).then(function(data){
            if (data.length > 0) {
                var tl_track = data[data.length - 1]; 
                lastTrackIdAdded = tl_track.tlid
                if (currentTrackId == null) {
                    currentTrackId = lastTrackIdAdded;
                } 
                lastTrackIdAdded = tl_track.tlid;
                logger.info("Last added track: " + JSON.stringify(tl_track));
                Lcd.setLine(1,status.setRemainingTracks(lastTrackIdAdded - currentTrackId));
                mopidy.playback.getState().then(function(data) {
                    if (data != "playing") {
                        module.exports.play();
                    } 
                    notifyNowPlaying(tl_track);
                });
            }
        });
    });
});

mopidy.on("state:offline", function () {
    Lcd.setLine(1,status.setMopidyStatus(false));
    mopidyOnline = false; 
    currentTrackId = null;
    lastTrackIdAdded = null;
});

mopidy.on("event:playbackStateChanged", function (data) {
    Lcd.alertLine(1,data.new_state);
    Lcd.setLine(1,status.setPlayerState(data.new_state));
    if (data.new_state == "stopped") {
        Lcd.setLine(0,"Tweet your request to @" + config.twitter.jukebox);
    }
});

mopidy.on("event:trackPlaybackStarted", function (data) {
    currentTrackId = data.tl_track.tlid;
    Lcd.setLine(1,status.setRemainingTracks(lastTrackIdAdded - currentTrackId));
    notifyNowPlaying(data.tl_track);
});

mopidy.on("event:trackPlaybackEnded", function (data) {
    // TODO; improve how to track end of tracklist
    var lastTrack = data;
    delete tracksUser[data.tl_track.tlid];
    if (data.tl_track.tlid == lastTrackIdAdded) {
        mopidy.tracklist.clear();
        logger.info("cleaning playlist");
    }
});

function notifyNowPlaying(tl_track) {
    var track  = Track.getString(tl_track.track);
    var url    = Track.getUrl(tl_track.track); 
    var source = Track.getSource(tl_track.track);
    var user   = "";
    if (tracksUser[tl_track.tlid]) {
        user  = "@" + tracksUser[tl_track.tlid];
    } 

    logger.info("NOW PLAYING: " + track + " (" + user + ") " + url);
    Lcd.setLine(0, track + " (" + user + ") from " + source);
    if (config.music.now_playing_tweets_enabled) {
        var tweet = [
            "#NowPlaying",
            _.str.prune(track, 140 - (11 + 25 + user.length + 3)),
            url,
            user
        ];
        Twitter.update({ 
            "status": tweet.join(" ")
        });
    }
}

module.exports = {
    isOnline: mopidyOnline,
    getCurrentTrackId: function(){
        return currentTrackId;
    },
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

    add: function(uri, fromUser, callback) {
        var that = this;
        mopidy.tracklist.add({"tracks": null, "at_position": null, "uri": uri}).then(function(data){
            if (data.length > 0) {
                lastTrackIdAdded = data[0].tlid;
                tracksUser[lastTrackIdAdded] = fromUser;
                Lcd.setLine(1,status.setRemainingTracks(lastTrackIdAdded - currentTrackId));
                logger.info("Music added");
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
            logger.debug("Player state: "+ data);
            callback(data);
        });
    }
};

