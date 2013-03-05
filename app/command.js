/*
 * Foodwatcher Bot
 *
 * "A little Google Talk bot which delivers the information from the Foodwatcher service.
 *
 * Copyright(c) 2013 André König <andre.koenig@gmail.com>
 * MIT Licensed
 *
 */

var moment = require('moment');
console.log(/0|6/.test(moment().day(moment().day() + 2).format('d')));
module.exports = function () {

	'use strict';

	var COMMANDS = {
		'mensen':           /^mensen$|^mensas$|^mensa$/,
		'today':            /^heute$|^today$/,
		'tomorrow':         /^morgen$|^tomorrow$/,
		'dayAfterTomorrow': /^übermorgen$|^day\safter\stomorrow$|^dayaftertomorrow$/,
		'monday':           /^montag$|^monday$|^mo$|^mon$/,
		'tuesday':          /^dienstag$|^tuesday$|^di$|^tue$/,
		'wednesday':        /^mittwoch$|^wednesday$|^mi$|^wed$/,
		'thursday':         /^donnerstag$|^thursday$|^do$|^thu$/,
		'friday':           /^freitag$|^friday$|^fr$|^fri$/,
		'help':             /^hilfe$|^help$/
	},
	MESSAGES = {
		MENSA_MISSING: "_OHOHOH!_\n\nAngabe der Mensa fehlt! In welcher Mensa möchtest Du denn was essen?\n\nFür eine Übersicht nutze den Befehl: *mensen*",
		CLOSED:        "_WOCHENENDE!!_\n\nDie Mensa ist zum angefragten Zeitpunkt leider geschlossen.",
		CLOSED_TODAY:  "_WOCHENENDE!!_\n\nDie Mensa ist heute geschlossen. Genieße das Wochenende!"
	},
	SPLIT_CHR = " ";
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
				console.log(type);
				// Check if the current day is a Saturday or Sunday.
				if (/today/.test(type) && /0|6/.test(moment().day(moment().day()).format('d'))) {
					error = MESSAGES.CLOSED_TODAY;

				// Check if tomorrow is a Saturday or Sunday.
				} else if (/tomorrow/.test(type) && /0|6/.test(moment().day(moment().day() + 1).format('d'))) {
					error = MESSAGES.CLOSED;

				// Check if the day after tomorrow is a Saturday or Sunday.
				} else if (/dayAfterTomorrow/.test(type) && /0|6/.test(moment().day(moment().day() + 2).format('d'))) {
					error = MESSAGES.CLOSED;

				// If the command is one which requires a mensa argument, check
				// if it is there.
				} else if (!(/mensen|help/.test(type)) && parts.length < 2) {
					error = MESSAGES.MENSA_MISSING;
				}
			}

			return {
				type: type,
				error: error
			};
		}
	};
};