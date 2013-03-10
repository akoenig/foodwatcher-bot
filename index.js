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
    http     = require('http');

(function () {
    var config = {};

    try {
        config.gtalk = require(__dirname + '/config/gtalk.json');
        config.logger = require(__dirname + '/config/logger.json');

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