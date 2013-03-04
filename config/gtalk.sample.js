/*
 * Foodwatcher Bot
 *
 * "A little Google Talk bot which delivers the information from the Foodwatcher service.
 *
 * Copyright(c) 2013 André König <andre.koenig@gmail.com>
 * MIT Licensed
 *
 */

module.exports = {
    common: {
        gtalk: {
            status: "nom nom nom",
            client: {
                jid: "foodwatcher.bot@gmail.com"
                password: "INSERT_YOUR_PASSWORD_HERE""",
                host: "talk.google.com",
                port: 5222,
                reconnect: true
            },
            autoSubscribe: true,
            commandSeparator: : /\s*\;\s*/
        }
    },
    production: {
        gtalk: {
            status: "nom nom nom",
            client: {
                jid: "foodwatcher.bot@gmail.com"
                password: "INSERT_YOUR_PASSWORD_HERE""",
                host: "talk.google.com",
                port: 5222,
                reconnect: true
            },
            autoSubscribe: true,
            commandSeparator: : /\s*\;\s*/
        }
    }
};