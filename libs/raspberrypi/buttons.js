"use strict";

var Gpio = require('onoff').Gpio;
var logger = require('../../logger');

var play       = new Gpio(18, 'in', "falling", { debounceTimeout: 200 });
var skip       = new Gpio(23, 'in', "falling", { debounceTimeout: 200 });
var volumeUp   = new Gpio(20, 'in', "falling", { debounceTimeout: 200 });
var volumeDown = new Gpio(16, 'in', "falling", { debounceTimeout: 200 });
var currentVolume = null;
var increment = 5;

module.exports = function(musicController) {

    function getVolume(callback) {
        if (currentVolume == null) {
            musicController.playback.getVolume({}).then(function(data){
                logger.debug("Current volume: "+ data);
                if (currentVolume == null) {
                    currentVolume = data;
                }
                callback(currentVolume);
            });
        } else {
            callback(currentVolume);
        }
    }

    play.watch(function(err, value) {
        if (err) { 
            logger.error("Error when trying to push play");
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
            logger.error("Error when trying to push skip");
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
            logger.error("Error when trying to push volume up");
        } else if (value == 0) {
            logger.debug("Volume up pressed!");
            this.getVolume(function(vol){
                musicController.playback.setVolume({"volume":(vol+increment)});
            });
        }
    });

    volumeDown.watch(function(err, value) {
        if (err) { 
            logger.error("Error when trying to push volume down");
        } else if (value == 0) {
            logger.debug("Volume down pressed!");
            this.getVolume(function(vol){
                musicController.playback.setVolume({"volume":(vol-increment)});
            });
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
