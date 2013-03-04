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

	const COMMANDS = ['mensen'];

	var privates = {},
		mensen = [
			{id: 'air', description: 'Mensa am Standort Flughafenallee'},
			{id: 'bhv', description: 'Mensa in Bremerhaven'},
			{id: 'gw2', description: 'Caféteria GW2'},
			{id: 'hsb', description: 'Mensa am Standort Neustadtswall'},
			{id: 'uni', description: 'Mensa am Uniboulevard'},
			{id: 'wer', description: 'Mensa am Standort Werderstrasse'}
		];

	return {
		isValid : function (command) {
			return ((COMMANDS.indexOf(command)) !== -1);
		},
		getValidCommands : function () {
			return COMMANDS;
		},
		execute : function (command, callMe) {
			switch (command.type) {
				case COMMANDS[0]:
					callMe(JSON.stringify(mensen));
				break;
			}
		}
	}
};