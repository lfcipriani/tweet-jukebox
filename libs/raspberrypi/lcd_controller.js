'use strict';

var config = require('../../config');
var logger = require('../../logger');
var _ = require('underscore');
_.str = require('underscore.string');

if (config.hardware.lcd.enabled) {

    var Lcd = require('lcd');

    var lcd = new Lcd({
        rs: 12,
        e: 21,
        data: [5, 6, 13, 26],
        cols: 16,
        rows: 2
    });

    var line = ["Initializing...", ""];
    var newLine = ["Initializing...", ""];
    var sliceStart = [0,0];
    var tempLine = [null,null];
    var nextAlerts = [[],[]];
    var loop = null;
    var alertLoop = null;

    lcd.on('ready', function () {
        print();
    });

    var print = function() {
        lcd.setCursor(0,0);
        if (nextAlerts[0][0]) {
            if (tempLine[0] == null) { tempLine[0] = line[0] }
            newLine[0] = nextAlerts[0][0];
        }
        if (newLine[0] != line[0]) { sliceStart[0] = 0 }
        line[0] = newLine[0];
        lcd.print(line[0].slice(sliceStart[0],sliceStart[0] + 16));

        lcd.once('printed', function(){
            lcd.setCursor(0, 1);
            if (nextAlerts[1][0]) {
                if (tempLine[1] == null) { tempLine[1] = line[1] }
                newLine[1] = setupStr(nextAlerts[1][0]);
            }
            if (newLine[1] != line[1]) { sliceStart[1] = 0 }
            line[1] = newLine[1];
            lcd.print(line[1].slice(sliceStart[1],sliceStart[1] + 16));

            lcd.once("printed", function(){
                for(var i = 0; i < 2; i++) {
                    sliceStart[i]++;
                    if (sliceStart[i] + 16 >= line[i].length) { sliceStart[i] = 0 }
                }

                loop = setTimeout(function () {
                    print();
                }, 300);
            });
        });
    };

    var setupStr = function(str) {
        if (str.length > 16) {
            str = str + " - " + str.slice(0,16);
        } else {
            str = str + _.str.repeat(" ", 16 - str.length);
        }
        return str;
    }

    module.exports = {
        setLine: function(row, str) {
            str = setupStr(str);
            if (nextAlerts[row][0]) {
                tempLine[row] = str;
            } else {
                newLine[row] = str;
            }
        },
        alertLine: function(row, str, ms) {
            nextAlerts[row].push(setupStr(str));
            alertLoop = setTimeout(function() {
                nextAlerts[row].shift();
                if (nextAlerts[row].length == 0) {
                    newLine[row] = tempLine[row];
                    tempLine[row] = null;
                }
            }, ms);
        }
    };

    process.on('SIGINT', function() {
    if (loop) { clearTimeout(loop) }
    if (alertLoop) { clearTimeout(alertLoop) }
    logger.info("Closing LCD resources...");
    lcd.clear();
    lcd.close();
    });

} else {

    module.exports = {
        setLine: function(row, str) {
            logger.debug(str);
        },
        alertLine: function(row, str, ms) {
            logger.debug(str);
        }
    };

}
