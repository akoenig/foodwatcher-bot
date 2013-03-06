/*
 * FoodWatcher Bot
 *
 * A little Google Talk bot which delivers the information from the FoodWatcher service.
 *
 * Copyright(c) 2013 André König <andre.koenig@gmail.com>
 * MIT Licensed
 *
 */

var fs         = require('fs'),
	nodemailer = require('nodemailer'),
    winston    = require('winston');

module.exports = function () {
    'use strict';

    var privates = {},
    	directory;

    directory = __dirname + "/../logs/";

    privates.deleteLogs = function () {
    	if (fs.existsSync(directory + 'debug.log')) {
    	    fs.writeFile(directory + 'debug.log', "");
    	}
    	if (fs.existsSync(directory + 'exceptions.log')) {
    	    fs.writeFile(directory + 'exceptions.log', "");
    	}
    };

    return {
        create : function (config) {
            var logger;

            privates.deleteLogs();

            logger = new (winston.Logger)({
                transports: [
                    new (winston.transports.Console)({ json: false, timestamp: true }),
                    new winston.transports.File({ filename: directory + "debug.log", json: false })
                ],
                exceptionHandlers: [
                    new (winston.transports.Console)({ json: false, timestamp: true }),
                    new winston.transports.File({ filename: directory + "exceptions.log", json: false })
                ],
                exitOnError: false
            });

            setInterval(function () {
            	var smtp = nodemailer.createTransport("SMTP", config.mail),
            		mailOpts;

            	mailOpts = config.mail;
            	mailOpts.attachments = [
            		{
            			filePath: directory + 'debug.log'
            		},
            		{
            			filePath: directory + 'exceptions.log'
            		}
            	];

            	smtp.sendMail(mailOpts, function(error, response) {
            	    if (error) {
            	        logger.error("[EMAIL] Tried to send the log files. " + error);
            	    } else {
            	        logger.debug("[EMAIL] Sent the log files.");

            	        privates.deleteLogs();
            	    }

            	    smtp.close();
            	});
            }, config.mail.interval);

            return logger;
        }
    };
};