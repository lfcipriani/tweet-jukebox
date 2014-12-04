'use strict';

var _ = require('underscore');
_.str = require('underscore.string');

var isMopidyOnline = false;
var isTwitterStreamingOnline = false;
var remainingTracks = 0;
var currentState = "s";
var states = {
    "playing": ">",
    "paused": "p",
    "stopped": "s"
};

module.exports = {

    setMopidyStatus: function(bool) {
        isMopidyOnline = bool;
        return this.toLcdString();
    },
    setTwitterStreamingStatus: function(bool) {
        isTwitterStreamingOnline = bool;
        return this.toLcdString();
    },
    setPlayerState: function(state) {
        currentState = states[state];
        if (!currentState) { currentState = "?" }
        return this.toLcdString();
    },
    setRemainingTracks: function(count) {
        remainingTracks = count;
        return this.toLcdString();
    },
    toLcdString: function() { 
        return _.str.sprintf("tracks:%s  [%s%d%d]", 
                _.str.pad(remainingTracks,2,"0"), 
                currentState,
                (isMopidyOnline ? 1 : 0),
                (isTwitterStreamingOnline ? 1 : 0));
    }

};
