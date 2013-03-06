/*
 * FoodWatcher Bot
 *
 * A little Google Talk bot which delivers the information from the FoodWatcher service.
 *
 * Copyright(c) 2013 André König <andre.koenig@gmail.com>
 * MIT Licensed
 *
 */

'use strict';

var bot      = require('./app/foodwatcher')(),
    http     = require('http'),
    Settings = require('settings');

(function () {
    var config = {};

    try {
        config.gtalk = new Settings(__dirname + '/config/gtalk.js').gtalk;
        config.logger = new Settings(__dirname + '/config/logger.js').logger;

        bot.startup(config);
         
        http.createServer(
          function (request, response) {
            response.writeHead(200, {'Content-Type': 'text/plain'});
            response.end('FoodWatcher Bot\n');
          }
        ).listen(process.env.PORT);
    } catch (e) {
        console.log(e);
        console.log('[ERROR] Application is not configured. Verify your config directory.');
        return;
    }
}());