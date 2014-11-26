"use strict";

var config = require('../config');
var Twit = require('twit');

var T = new Twit(config.twitter.api_keys);

module.exports = {

    reply: function(status, request) {
        this.update( { 
            "status": "@" + request.fromUser + " " + status,
            in_reply_to_status_id: request.id
        });
    },

    update:function(param) {
        if (!config.twitter.deactivate_all_statuses_updates) {
            T.post('statuses/update', param, function(err, data, response) {
                if (err) {
                    console.log("Error sending tweet: " + err.message);
                } 
            });
        } else {
            console.log("Status update deactivated");
        }
    }

}

