var assert = require("assert");

var config = require('../config');
var Track = require("../libs/track_urls");

describe('libs/track_urls', function(){

  describe('getUrl', function(){

    it('should return spotify URLs', function() {
        var track = {"album":{"date":2006,"__model__":"Album","artists":[{"__model__":"Artist","name":"Various Artists","uri":"spotify:artist:0LyfQWJT6nXafLPZqxe9Of"}],"uri":"spotify:album:6OhixhDKgwVl5SxEPrPX61","name":"Samba Goal - Powered By R10"},"__model__":"Track","name":"Deixa A Vida Me Levar","uri":"spotify:track:3IGssOQU1XqizfaLUro3iE","length":275000,"track_no":3,"artists":[{"__model__":"Artist","name":"Zeca Pagodinho","uri":"spotify:artist:3qZ2n5keOAat1SoF6bHwmb"}],"date":2006,"bitrate":null};
        var result = Track.getUrl(track);

        assert.equal(result, "http://open.spotify.com/track/3IGssOQU1XqizfaLUro3iE");
    });

    it('should return youtube URLs', function() {
        var track = {"album":{"date":2006,"__model__":"Album","artists":[{"__model__":"Artist","name":"Various Artists","uri":"spotify:artist:0LyfQWJT6nXafLPZqxe9Of"}],"uri":"spotify:album:6OhixhDKgwVl5SxEPrPX61","name":"Samba Goal - Powered By R10"},"__model__":"Track","name":"Deixa A Vida Me Levar","comment": "h_oGYstQbjU","uri":"youtube:track:3IGssOQU1XqizfaLUro3iE","length":275000,"track_no":3,"artists":[{"__model__":"Artist","name":"Zeca Pagodinho","uri":"spotify:artist:3qZ2n5keOAat1SoF6bHwmb"}],"date":2006,"bitrate":null};
        var result = Track.getUrl(track);

        assert.equal(result, "https://www.youtube.com/watch?v=h_oGYstQbjU");
    });

    it('should return soundcloud URLs', function() {
        var track = {"album":{"date":2006,"__model__":"Album","artists":[{"__model__":"Artist","name":"Various Artists","uri":"spotify:artist:0LyfQWJT6nXafLPZqxe9Of"}],"uri":"spotify:album:6OhixhDKgwVl5SxEPrPX61","name":"Samba Goal - Powered By R10"},"__model__":"Track","name":"Deixa A Vida Me Levar","comment": "http://soundcloud.com/israelnovaes/israel-novaes-marrom-bombom","uri":"soundcloud:song/Israel Novaes - Marrom Bombom.90629780","length":275000,"track_no":3,"artists":[{"__model__":"Artist","name":"Zeca Pagodinho","uri":"spotify:artist:3qZ2n5keOAat1SoF6bHwmb"}],"date":2006,"bitrate":null};
        var result = Track.getUrl(track);

        assert.equal(result, "http://soundcloud.com/israelnovaes/israel-novaes-marrom-bombom");
    });

  });

});
