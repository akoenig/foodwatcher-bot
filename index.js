/*
 * Foodwatcher Bot
 *
 * "A little Google Talk bot which delivers the information from the Foodwatcher service.
 *
 * Copyright(c) 2013 André König <andre.koenig@gmail.com>
 * MIT Licensed
 *
 */

var bot      = require('./app/foodwatcher')(),
	Settings = require('settings');

(function () {
	var config;

	try {
		config = new Settings('./config/environment.js').gtalk;

		bot.startup(config);
	} catch (e) {
		console.log(e);
		console.log('[ERROR] Application is not configured. Verify your config directory.');
		return;
	}
}());