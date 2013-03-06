/*
 * FoodWatcher Bot
 *
 * A little Google Talk bot which delivers the information from the FoodWatcher service.
 *
 * Copyright(c) 2013 André König <andre.koenig@gmail.com>
 * MIT Licensed
 *
 */

var winston = require('winston');

'use strict';

var logger = new (winston.Logger)({
    transports: [
	    new (winston.transports.Console)({ json: false, timestamp: true }),
	    new winston.transports.File({ filename: __dirname + '/logs/debug.log', json: false })
    ],
  	exceptionHandlers: [
	    new (winston.transports.Console)({ json: false, timestamp: true }),
	    new winston.transports.File({ filename: __dirname + '/logs/exceptions.log', json: false })
  	],
  	exitOnError: false
});

// Send the log files once a day to the foodwatch
/*setInterval(function () {
	
});*/

module.exports = logger;