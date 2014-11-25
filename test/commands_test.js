var assert = require("assert");

var config = require('../config');
var tweetParser = require("../libs/commands");

describe('libs/commands', function(){

  describe('getCommand', function(){
    var Music;
    var Commands;

    before(function() {
        Music = require('../libs/music_controller');
        Commands = require('../libs/commands')(Music);
    });

    it('should return the right command for an enabled command', function() {
        assert.notEqual(Commands.getCommand("SEARCH"), undefined);
    });

    it('should not return a non existent command', function() {
        assert.equal(Commands.getCommand("NONEXISTENT"), undefined);
    });

    it('should have a run method', function() {
        assert.notEqual(Commands.getCommand("SEARCH").run, undefined);
    });

  });

});

