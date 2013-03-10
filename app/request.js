/*
 * FoodWatcher Bot
 *
 * A little Google Talk bot which delivers the information from the FoodWatcher service.
 *
 * Copyright(c) 2013 André König <andre.koenig@gmail.com>
 * MIT Licensed
 *
 */

var messages = require('./messages')();

module.exports = function () {

    'use strict';

    var COMMANDS = {
        'mensen':           /^mensen$|^mensas$|^mensa$/,
        'today':            /^heute$|^today$/,
        'tomorrow':         /^morgen$|^tomorrow$/,
        'dayAfterTomorrow': /^übermorgen$|^day after tomorrow$|^dayaftertomorrow$/,
        'monday':           /^montag$|^monday$|^mo$|^mon$/,
        'tuesday':          /^dienstag$|^tuesday$|^di$|^tue$/,
        'wednesday':        /^mittwoch$|^wednesday$|^mi$|^wed$/,
        'thursday':         /^donnerstag$|^thursday$|^do$|^thu$/,
        'friday':           /^freitag$|^friday$|^fr$|^fri$/,
        'help':             /^hilfe$|^help$/,
        'version':          /^version$|^ver$/
    },
    SPLIT_CHR = " ";

    return {
        parse : function (body) {
            var parts = body.split(SPLIT_CHR),
                type,
                error,
                tmp;

            // parts[0] = The command
            // parts[1] = The "mensa"

            search : for (tmp in COMMANDS) {
                if (COMMANDS.hasOwnProperty(tmp)) {
                    if (COMMANDS[tmp].test(parts[0])) {
                        type = tmp;

                        break search;
                    }
                }
            }

            if (type) {
                // If the command is one which requires a mensa argument,
                // check if it is there.
                if (!(/^mensen$|^help$|^version$/.test(type)) && parts.length < 2) {
                    error = messages.get('MISSING_MENSA');
                }
            } else {
                error = messages.get('UNKNOWN_COMMAND');
            }

            // Lower case for the "mensa" argument (if it is available).
            if (parts[1]) {
                parts[1] = parts[1].toLowerCase();
            }

            return {
                type: type,
                mensa: parts[1],
                error: error
            };
        }
    };
};