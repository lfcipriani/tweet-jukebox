'use strict';

var config = require('../../config');
var logger = require('../../logger');
var Lcd = require('lcd');
var _ = require('underscore');
_.str = require('underscore.string');

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

lcd.on('ready', function () {
    print();
});

function print() {
    lcd.setCursor(0,0);
    if (nextAlerts[0][0]) {
        if (tempLine[0] == null) { tempLine[0] = line[0] }
        newLine[0] = setupStr(nextAlerts[0][0]);
    } 
    line[0] = newLine[0];
    lcd.print(line[0].slice(sliceStart[0],sliceStart[0] + 16));

    lcd.once('printed', function(){
        lcd.setCursor(0, 1);
        if (nextAlerts[1][0]) {
            if (tempLine[1] == null) { tempLine[1] = line[1] }
            newLine[1] = setupStr(nextAlerts[1][0]);
        } 
        line[1] = newLine[1];
        lcd.print(line[1].slice(sliceStart[1],sliceStart[1] + 16));

        lcd.once("printed", function(){
            for(var i = 0; i < 2; i++) {
                sliceStart[i]++;
                if (sliceStart[i] + 16 >= line[i].length) { sliceStart[i] = 0 }
            }

            setTimeout(function () {
                print();
            }, 300);
        });
    });
}

function setupStr(str) {
    if (str.length > 16) {
        str = str + " - " + str.slice(0,12);
    }
    return str;
}


module.exports = {
    setLine: function(row, str) {
        str = setupStr(str);
        newLine[row] = str;
    },
    getLine: function(row) {
        line[row];
    },
    alertLine: function(row, str, ms) {
        nextAlerts[row].push(str);
        setTimeout(function() {
            nextAlerts[row].shift();
            if (nextAlerts[row].length == 0) {
                line[row] = tempLine[row];
                tempLine[row] = null;
            }
        }, ms);
    }
};

process.on('SIGINT', function() {
  logger.info("Closing LCD resources...");
  lcd.clear();
  lcd.close();
});
