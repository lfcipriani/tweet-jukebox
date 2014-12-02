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

var line = newLine = ["Initializing...", ""];
var sliceStart = [0,0];

lcd.on('ready', function () {
    print();
});

function print() {
    lcd.setCursor(0,0);
    lcd.print(line[0].slice(sliceStart[0],sliceStart[0] + 16));

    lcd.once('printed', function(){
        lcd.setCursor(0, 1);
        lcd.print(line[1].slice(sliceStart[1],sliceStart[1] + 16));

        lcd.once("printed", function(){
            for(var i = 0; i < 2; i++) {
                sliceStart[i]++;
                if (sliceStart[i] + 16 > line[i].length) { sliceStart[i] = 0 }
            }

            setTimeout(function () {
                print();
            }, 300);
        });
    });
}

module.exports = {
    setLine: function(row, str) {
        if (str.length > 16) {
            str = str + " - " + str.slice(0,13);
        }
        newLine[row] = str;
    },
    getLine: function(row) {
        line[row];
    }
};

process.on('SIGINT', function() {
  logger.info("Closing LCD resources...");
  lcd.clear();
  lcd.close();
});
