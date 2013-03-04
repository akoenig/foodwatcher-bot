/*
 * Foodwatcher Bot
 *
 * "A little Google Talk bot which delivers the information from the Foodwatcher service.
 *
 * Copyright(c) 2013 André König <andre.koenig@gmail.com>
 * MIT Licensed
 *
 */

module.exports = function () {

	'use strict';

	const COMMANDS = {
		'mensen':           ['mensen', 'mensas'],
		'today':            ['heute', 'today'],
		'tomorrow':         ['morgen', 'tomorrow'],
		'dayAfterTomorrow': ['übermorgen', 'day after tomorrow', 'dayaftertomorrow'],
		'monday':           ['montag', 'monday', 'mo', 'mon'],
		'tuesday':          ['dienstag', 'tuesday', 'di', 'tue'],
		'wednesday':        ['mittwoch', 'wednesday', 'mi', 'wed'],
		'thursday':         ['donnerstag', 'thursday', 'do', 'thu'],
		'friday':           ['freitag', 'friday', 'fr', 'fri'],
		'help':             ['hilfe', 'help']
	},
	SPLIT_CHR = " ",
	MENSEN = {

	};
/*

		mensen = [
			{id: 'air', description: 'Mensa am Standort Flughafenallee'},
			{id: 'bhv', description: 'Mensa in Bremerhaven'},
			{id: 'gw2', description: 'Caféteria GW2'},
			{id: 'hsb', description: 'Mensa am Standort Neustadtswall'},
			{id: 'uni', description: 'Mensa am Uniboulevard'},
			{id: 'wer', description: 'Mensa am Standort Werderstrasse'}
		];


*/

	return {
		parse : function (body) {
			var parts = body.split(SPLIT_CHR),
				type,
				mensa,
				error,
				tmp;

			// parts[0] = The command
			// parts[1] = The "mensa"

			search : for (tmp in COMMANDS) {
				if (COMMANDS.hasOwnProperty(tmp)) {
					if (COMMANDS[tmp].indexOf(parts[0] !== -1)) {
						type = tmp;

						break search;
					}
				}
			}

			if (!(/mensen|help/.test(type)) && parts.length < 2) {
				error = 'Naja. In welcher Mensa möchtest Du denn was essen?';
			} else {
				search : for (tmp in MENSEN) {
					if (MENSEN.hasOwnProperty()) {
						if (MENSEN[tmp].indexOf(parts[1] !== -1)) {
							mensa = tmp;

							break search;
						}
					}
				}
			}

			return {
				type: type,
				mensa: mensa,
				error: error
			};
		};
	};
};