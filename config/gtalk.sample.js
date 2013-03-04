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
            status: "Don't get hungry, keep watching! With FoodWatcher!",
            client: {
                jid: "foodwatcher.bot@gmail.com",
                password: "INSERT_YOUR_PASSWORD_HERE",
                host: "talk.google.com",
                port: 5222,
                reconnect: true
            },
            autoSubscribe: true,
            keepAlive: 10000,
            commandSeparator: " "
        }
    },
    production: {
        gtalk: {
            status: "Don't get hungry, keep watching! With FoodWatcher!",
            client: {
                jid: "foodwatcher.bot@gmail.com",
                password: "INSERT_YOUR_PASSWORD_HERE",
                host: "talk.google.com",
                port: 5222,
                reconnect: true
            },
            autoSubscribe: true,
            keepAlive: 10000,
            commandSeparator: " "
        }
    }
};