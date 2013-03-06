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
        logger: {
            mail: {
                from:    "FoodWatcher Bot - Logs ✔ <foodwatcher.bot@gmail.com>",
                to:      "foodwatcher.bot+logs@gmail.com",
                subject: "Daily logs",
                service: "Gmail",
                host:    "smtp.gmail.com",
                auth: {
                    user: "foodwatcher.bot@gmail.com",
                    pass: "INSERT_PASSWORD_HERE"
                },
                interval: 86400000// Once a day.
            }
        }
    },
    production: {
        logger: {
            mail: {
                from:    "FoodWatcher Bot - Logs ✔ <foodwatcher.bot@gmail.com>",
                to:      "foodwatcher.bot+logs@gmail.com",
                subject: "Daily logs",
                service: "Gmail",
                host:    "smtp.gmail.com",
                auth: {
                    user: "foodwatcher.bot@gmail.com",
                    pass: "INSERT_PASSWORD_HERE"
                },
                interval: 86400000// Once a day.
            }
        }
    }
};