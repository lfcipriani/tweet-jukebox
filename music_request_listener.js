'use strict';

var config = require('./config/config');
var Stream = require('./twitter/' + config.twitter.capture_strategy + '_strategy');

Stream.init();

Stream.onTweetRequest(function(tweet) {
   console.log(tweet.text); 
});
