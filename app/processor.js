/*
 * FoodWatcher Bot
 *
 * A little Google Talk bot which delivers the information from the FoodWatcher service.
 *
 * Copyright(c) 2013 André König <andre.koenig@gmail.com>
 * MIT Licensed
 *
 */

var messages = require('./messages')(),
    moment   = require('moment'),
    pkg      = require(__dirname + '/../package.json');
	supplier = require('./supplier')();

module.exports = function () {
	'use strict';

	var privates = {};

	privates.executeServiceCommand = function (command, cb) {
		switch (command.type) {
			case 'mensen':
				supplier.getMensen(cb);
			break;

			case 'help':
				cb(null, messages.get('HELP'));
			break;

			case 'version':
				cb(null, pkg.version);
			break;
		}
	};

	privates.executeMealCommand = function (command, cb) {
		var day = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'].indexOf(command.type),
			currentDay = moment().day(),
			isNextWeek = false;

		// If the user entered a weekday, like 'monday', 'tuesday' etc., everything
		// is fine. Otherwise we have to determine the day of the week by interpreting
		// the 'today', 'tomorrow', 'dayAfterTomorrow' keyword.
		if (day === -1) {
			switch (command.type) {
				case 'today':
					day = moment().day();
				break;

				case 'tomorrow':
					day = moment().day(currentDay + 1).format('d');
					isNextWeek = (currentDay + 1) > 6;
				break;

				case 'dayAfterTomorrow':
					day = moment().day(currentDay + 2).format('d');
					isNextWeek = (currentDay + 2) > 6;
				break;
			}
		}

		// Check if the specified day is a Saturday or Sunday.
		if (/0|6/.test(day)) {
			cb(messages.get('CLOSED'));

		// Check if the requested day is in the next week.
		// The food supplier interface provides just data
		// for the current week.
		} else if (isNextWeek) {
			cb(messages.get('NO_DATA'));
		} else {
			supplier.getMeals(day, command.mensa, cb);
		}
	};

	return {
		treat : function (command, cb) {
			if (/^help$|^mensen$|^version$/.test(command.type)) {
				privates.executeServiceCommand(command, cb);
			} else {
				privates.executeMealCommand(command, cb);
			}
		}
	};
};