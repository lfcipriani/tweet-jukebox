'use strict';

var _ = require('underscore');
_.str = require('underscore.string');

module.exports = {
    getUrl:function(track) {
        var type = track.uri.match(/^(.*?):/)[1];
        switch(type) {
            case "spotify":
                return "http://open.spotify.com/track/" + track.uri.match(/spotify:track:([^\&\?\/]+)/)[1];
            case "youtube":
                return "https://www.youtube.com/watch?v=" + track.comment;
            case "soundcloud":
                return track.comment;
            default:
                return null;
        }
    },
    getString: function(track) {
        var str = track.name;
        if (track.artists) {
            str = str.concat(" by ");
            str = str.concat(track.artists[0].name);
        }
        return str;
    },
    getSource: function(track) {
        return track.uri.match(/^(.*?):/)[1];
    }
};
