'use strict';

var config = require('../config');
var music = require('../libs/music_controller');

function execute() {
    music.search({"query": {"artist": ["madonna"]}, "uris": ["spotify:", "youtube:"] }, function(result) {
        console.log(result);
    });
}

setTimeout(execute, 2000);

