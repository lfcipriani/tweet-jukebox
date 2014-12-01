"use strict";

var Gpio = require('onoff').Gpio;
var logger = require('../../logger');

var play       = new Gpio(18, 'in', "falling", { debounceTimeout: 200 });
var skip       = new Gpio(23, 'in', "falling", { debounceTimeout: 200 });
var volumeUp   = new Gpio(20, 'in', "falling", { debounceTimeout: 200 });
var volumeDown = new Gpio(16, 'in', "falling", { debounceTimeout: 200 });
var currentVolume = 100;

module.exports = function(musicController) {

    play.watch(function(err, value) {
        if (err) { 
            logger.debug("Error when trying to push play");
        } else if (value == 0) {
            logger.debug("Play pressed!");
            musicController.getPlayerState(function(state){
                switch (state) {
                    case "playing":
                        musicController.pause();
                        break;
                    case "paused":
                        musicController.play();
                        break;
                    case "stopped":
                        musicController.play();
                        break;
                    default:
                        musicController.play();
                }
            });
        }
    });

    skip.watch(function(err, value) {
        if (err) { 
            logger.debug("Error when trying to push skip");
        } else if (value == 0) {
            logger.debug("Skip pressed!");
            musicController.getPlayerState(function(state){
                switch (state) {
                    case "playing":
                        musicController.next();
                        break;
                    case "paused":
                        musicController.play();
                        musicController.next();
                        break;
                    case "stopped":
                        musicController.play();
                        musicController.next();
                        break;
                    default:
                        musicController.play();
                        musicController.next();
                }
            });
        }
    });

    volumeUp.watch(function(err, value) {
        if (err) { 
            logger.debug("Error when trying to push volume up");
        } else if (value == 0) {
            logger.debug("Volume up pressed!");
        }
    });

    volumeDown.watch(function(err, value) {
        if (err) { 
            logger.debug("Error when trying to push volume down");
        } else if (value == 0) {
            logger.debug("Volume down pressed!");
        }
    });

};

function exit() {
    logger.info("cleaning button GPIOs");
    play.unexport();
    skip.unexport();
    volumeUp.unexport();
    volumeDown.unexport();
}

process.on('SIGINT', exit);
