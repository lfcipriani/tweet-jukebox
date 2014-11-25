'use strict';

var config = require('../config');
var _ = require('underscore');
_.str = require('underscore.string');

module.exports = function(musicController) {

    var ENABLED_COMMANDS = {};
    _.each(config.commands, function(cmd) {
        if (cmd.enabled) {
            ENABLED_COMMANDS[_.str.swapCase(cmd.name)] = require('./commands/'+ cmd.name +'_command')(musicController, cmd);
        }
    });

    return {
        getCommand: function(cmd) {
            return ENABLED_COMMANDS[cmd];
        }
    };

};
