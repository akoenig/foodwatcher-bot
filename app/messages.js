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

	var MESSAGES = {
		MISSING_MENSA:   "\n*OHOHOH!*\n\nAngabe der Mensa fehlt! In welcher Mensa möchtest Du denn was essen?\n\nFür eine Übersicht nutze den Befehl: *mensen*",
		NO_DATA:         "\n*Keine Daten verfügbar!*\n\nFür den angefragten Zeitraum liegen im Moment noch keine Daten vor. Versuche es später noch einmal.",
		CLOSED:          "\n*WOCHENENDE!!*\n\nDie Mensa ist zum angefragten Zeitpunkt leider geschlossen. Genieße das Wochenende!",
		UNKNOWN_COMMAND: "\n*Hmmmm..*\n\nVerstehe den Befehl nicht. Wie Du mit mir kommunizierst findest Du über den Befehl *hilfe* heraus.",
		MENSEN_HEADLINE: "\n*Die Mensen in Bremen*\n\nUm die jeweiligen Speisepläne abrufen zu können, benötigst Du die folgenden fettgedruckten Kürzel. Dieses Kürzel kannst Du an den entsprechenden Befehl anhängen (z. B. *heute air*).\n\n",
		MENSA_NOT_FOUND: "\n*Mensa existiert nicht.*\n\n Die angegebene Mensa ist mir nicht bekannt. Schau noch mal über den Befehl: *mensen* nach.",
		API_ERROR:       "\n*Autsch! Das tut weh!*\n\n Die Datenschnittstelle, der FoodSupplier hat offensichtlich gerade technische Probleme. Wir arbeiten an der Behebung (HTTP StatusCode: {status})"
	};

	return {
		compile : function (key, data) {
			var compiled,
			    placeholder;

			compiled = MESSAGES[key] || key;

			for (placeholder in data) {
			    if (data.hasOwnProperty(placeholder)) {
			        compiled = compiled.replace(new RegExp('{'+placeholder+'}','g'), data[placeholder]);
			    }
			}

			return compiled;
		},
		get : function (key) {
			return MESSAGES[key];
		}
	};
};