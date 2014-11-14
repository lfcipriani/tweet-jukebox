'use strict';

var config = require('./config');
var Stream = require('./twitter/' + config.twitter.capture_strategy + '_strategy');

Stream.init();

Stream.onTweet(function(tweet) {
   console.log(tweet.text); 
});
