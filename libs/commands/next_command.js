'use strict';

var logger = require('../../logger');

module.exports = function(musicController, cmd) {
    return {
        run: function(request) {
            if (request.via == "dm") {
                musicController.next();
                logger.info("DM: next");
            }
        }
    };
};

