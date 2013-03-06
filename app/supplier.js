/*
 * FoodWatcher Bot
 *
 * A little Google Talk bot which delivers the information from the FoodWatcher service.
 *
 * Copyright(c) 2013 André König <andre.koenig@gmail.com>
 * MIT Licensed
 *
 */

var moment   = require('moment'),
    messages = require('./messages')(),
    request  = require('request');

moment.lang('de');

module.exports = function () {

    'use strict';
    
    var mensen,
        privates = {},
        TIMESTAMP_FORMAT,
        SUPPLIER_URL;

    TIMESTAMP_FORMAT = 'YYYYMMDD';

    SUPPLIER_URL = "http://foodspl.appspot.com/mensa?id={mensa}&format=json&week={week}&year={year}";

    mensen = {
        'air': {
            ids: /^air$|^airport$|^flughafen$|^flughafenallee$/,
            description: 'Airport (Hochschule)',
            meals: {}
        },
        'bhv': {
            ids: /^bhv$|^bremerhaven$/,
            description: 'Bremerhaven (Hochschule)',
            meals: {}
        },
        'gw2': {
            ids: /^gw2$|^unigw2$/,
            description: 'Cafeteria GW 2 (Universität)',
            meals: {}
        },
        'hsb': {
            ids: /^hsb$|^neustadtswall$/,
            description: 'Neustadtswall (Hochschule)',
            meals: {}
        },
        'uni': {
            ids: /^uni$|^uniboulevard$|^unimensa$/,
            description: 'Uniboulevard (Universität)',
            meals: {}
        },
        'wer': {
            ids: /^wer$|^werderstrasse$|^uniboulevard$|^unimensa$/,
            description: 'Werderstrasse (Hochschule)',
            meals: {}
        }
    };

    // DOCME
    privates.loadMeals = function (weekDay, mensa, cb) {
        var date,
            url;

        date = moment().day(weekDay);

        url = messages.compile(SUPPLIER_URL, {
            mensa: mensa,
            week: date.format('w'),
            year: date.format('YYYY')
        });

        request.get({
            url: url,
            json: true
        }, function (err, res, data) {
            if (err) {
                cb(err);
            } else if (res.statusCode === 200) {
                data.menues.forEach(function (menu, index) {
                    var timestamp = moment().day(index + 1).format(TIMESTAMP_FORMAT);
                    mensen[mensa].meals[timestamp] = [];

                    menu.foods.forEach(function (food) {
                        mensen[mensa].meals[timestamp].push({
                            title: food.title,
                            description: food.desc,
                            studentprice: food.studentprice,
                            staffprice: food.staffprice
                        });
                    });
                });

                cb(null, mensen[mensa].meals[date.format(TIMESTAMP_FORMAT)]);
            } else {
                cb(messages.compile('API_ERROR', {status: res.statusCode}));
            }
        });
    };

    // DOCME
    privates.determineMensaKey = function (mensa) {
        var found = mensen[mensa],
            tmp;

        if (!found) {
            search : for (tmp in mensen) {
                if (mensen.hasOwnProperty(tmp)) {
                    if (mensen[tmp].ids.test(mensa)) {
                        mensa = tmp;
                        found = true;

                        break search;
                    }
                }
            }
        }

        if (!found) {
        	mensa = undefined;
        }

        return mensa;
    };

    // DOCME
    setInterval(function () {
        var tmp;

        console.log("CLEARING CACHE ... ");

        for (tmp in mensen) {
            if (mensen.hasOwnProperty(tmp)) {
                mensen[tmp].meals = {};
            }
        }

        console.log("... DONE");
    }, 86400000); // Clearing the cache once a day.

    return {
        getMeals : function (weekDay, mensa, cb) {
            var meals,
                prepareMenu;

            prepareMenu = function (mealEntries) {
                var message = "\n*" + mensen[mensa].description + "*" + "\n\n _" + moment().day(weekDay).format('dddd, DD. MMMM YYYY') + "_ \n\n";

                mealEntries.forEach(function (meal) {
                    message = message + "*" + meal.title + "*\n" + meal.description + "\n _" + meal.studentprice + " / " + meal.staffprice + "_ \n\n";
                });

                return message;
            };

            mensa = privates.determineMensaKey(mensa);

            if (!mensa) {
                cb(messages.get('MENSA_NOT_FOUND'));
            } else {

                // Check if we have a cached version of the requested data.
                meals = mensen[mensa].meals[moment().day(weekDay).format(TIMESTAMP_FORMAT)];

                if (!meals) {
                    privates.loadMeals(weekDay, mensa, function (err, results) {
                        if (err) {
                            cb(err);

                            return;
                        }

                        cb(null, prepareMenu(results));
                    });
                } else {
                    cb(null, prepareMenu(meals));
                }
            }
        },

        getMensen : function (cb) {
            var message = messages.get('MENSEN_HEADLINE'),
                tmp;

            for (tmp in mensen) {
                if (mensen.hasOwnProperty(tmp)) {
                    message = message + "*" + tmp + "*\n" + mensen[tmp].description + "\n\n";
                }
            }

            cb(null, message);
        }
    };    
};