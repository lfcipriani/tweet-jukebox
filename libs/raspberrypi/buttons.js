"use strict";

var config = require('../../config');
var logger = require('../../logger');

if (config.hardware.buttons.enabled) {

    var Gpio = require('onoff').Gpio;

    var play       = new Gpio(18, 'in', "falling", { debounceTimeout: 200 });
    var skip       = new Gpio(23, 'in', "falling", { debounceTimeout: 200 });
    var volumeUp   = new Gpio(20, 'in', "falling", { debounceTimeout: 200 });
    var volumeDown = new Gpio(16, 'in', "falling", { debounceTimeout: 200 });
    var currentVolume = null;
    var increment = 5;

    module.exports = function(musicController) {

        var getVolume = function(callback) {
            if (currentVolume == null) {
                musicController.getMopidyObj().playback.getVolume({}).then(function(data){
                    logger.debug("Current volume: "+ data);
                    if (currentVolume == null) {
                        currentVolume = data;
                    }
                    callback(currentVolume);
                });
            } else {
                logger.debug("Current volume: "+ currentVolume);
                callback(currentVolume);
            }
        };

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
                getVolume(function(vol){
                    currentVolume = (vol + increment > 100 ? 100 : vol + increment);
                    musicController.getMopidyObj().playback.setVolume({"volume":currentVolume});
                });
            }
        });

        volumeDown.watch(function(err, value) {
            if (err) { 
                logger.error("Error when trying to push volume down");
            } else if (value == 0) {
                logger.debug("Volume down pressed!");
                getVolume(function(vol){
                    currentVolume = (vol - increment < 0 ? 0 : vol - increment);
                    musicController.getMopidyObj().playback.setVolume({"volume":currentVolume});
                });
            }
        });

    };

    process.on('SIGINT', function() {
        logger.info("cleaning button GPIOs");
        play.unexport();
        skip.unexport();
        volumeUp.unexport();
        volumeDown.unexport();
    });

} else {

    module.exports = function(musicController) {
        logger.info("Buttons disabled by configuration");
        return null;
    };

}
