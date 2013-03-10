/*
 * FoodWatcher Bot
 *
 * A little Google Talk bot which delivers the information from the FoodWatcher service.
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
        API_ERROR:       "\n*Autsch! Das tut weh!*\n\n Die Datenschnittstelle, der FoodSupplier hat offensichtlich gerade technische Probleme. Wir arbeiten an der Behebung (HTTP StatusCode: {status} - Message: {message})",
        HELP:            "\n*Hey* ich bin der *FoodWatcher Bot* ... \n\nDie folgende Auflistung soll Dir helfen, wie Du mit mir interagieren kannst. \n Bitte beachte, dass der FoodWatcher immer die Daten der jeweils aktuellen Woche zur Verfügung stellen kann. Dies sind also meine Kommandos:\n\n*montag* _mensa-key_\nDer Speiseplan am Montag der aktuellen Woche in der spezifizierten Mensa.\n\n*dienstag* _mensa-key_\n Der Speiseplan am Dienstag der aktuellen Woche in der spezifizierten Mensa. \n\n*mittwoch* _mensa-key_\n Der Speiseplan am Mittwoch der aktuellen Woche in der spezifizierten Mensa. \n\n*donnerstag* _mensa-key_\n Der Speiseplan am Donnerstag der aktuellen Woche in der spezifizierten Mensa. \n\n*freitag* _mensa-key_\n Der Speiseplan am Freitag der aktuellen Woche in der spezifizierten Mensa. \n\n*übermorgen* _mensa-key_\n Liefert den Speiseplan, den Du übermorgen in der Mensa genießen darfst. \n\n*morgen* _mensa-key_\n Liefert den morgigen Speiseplan der jeweiligen Mensa. \n\n*heute* _mensa-key_\n Liefert Dir den _heutigen_ Speiseplan der angefragten Mensa. Zum Beispiel: _heute airport_ würde Dir den heutigen Speiseplan der Mensa der Hochschule Bremen am Flughafen liefern. \n\n*hilfe*\n Zeigt Dir diese Hilfe an. \n\n*mensen*\n Liefert Dir die verfügbaren _mensa-keys_."
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