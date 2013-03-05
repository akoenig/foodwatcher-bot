/*
 * Foodwatcher Bot
 *
 * "A little Google Talk bot which delivers the information from the Foodwatcher service.
 *
 * Copyright(c) 2013 André König <andre.koenig@gmail.com>
 * MIT Licensed
 *
 */

var moment = require('moment'),
    request = require('request');

module.exports = function () {
    
    var mensen,
        privates = {},
        TIMESTAMP_FORMAT,
        SUPPLIER_URL;

    TIMESTAMP_FORMAT = 'YYYYMMDD';

    SUPPLIER_URL = function (data) {
        var s,
            p;

        s = 'http://foodspl.appspot.com/mensa?id={mensa}&format=json&week={week}&year={year}'

        for (p in data) {
          s = s.replace(new RegExp('{'+p+'}','g'), data[p]);
        }

        return s;
    };

    mensen = {
        'air': {
            ids: /^air$|^airport$|^flughafen$|^flughafenallee$/,
            description: '*air* - Airport (Hochschule).',
            meals: {}
        },
        'bhv': {
            ids: /^bhv$|^bremerhaven$/,
            description: '*bhv* - Bremerhaven (Hochschule).',
            meals: {}
        },
        'gw2': {
            ids: /^gw2$|^unigw2$/,
            description: '*gw2* - Cafeteria GW 2 (Universität)',
            meals: {}
        },
        'hsb': {
            ids: /^hsb$|^neustadtswall$/,
            description: '*hsb* - Neustadtswall (Hochschule)',
            meals: {}
        },
        'uni': {
            ids: /^uni$|^uniboulevard$|^unimensa$/,
            description: '*uni* - Uniboulevard (Universität)',
            meals: {}
        },
        'wer': {
            ids: /^wer$|^werderstrasse$|^uniboulevard$|^unimensa$/,
            description: '*wer* - Werderstrasse (Hochschule)',
            meals: {}
        }
    };

    // DOCME
    privates.loadMeals = function (weekDay, mensa, cb) {
        var date,
            url;

        date = moment().day(weekDay);

        url = SUPPLIER_URL({
            mensa: mensa,
            week: date.format('w'),
            year: date.format('YYYY')
        });

        request.get({
            url: url,
            json: true
        }, function (err, response, data) {
        	if (err) {
        		cb(err);
        		return;
        	}

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
        });

    };

    // DOCME
    setInterval(function () {
        var tmp;

        for (tmp in mensen) {
            if (mensen.hasOwnProperty(tmp)) {
                mensen[tmp].meals = {};
            }
        }
    }, 3000000);

    return {
        getMeals : function (weekDay, mensa, cb) {
            var meals,
            	prepareMenu;

            prepareMenu = function (mealEntries) {

            	var message = "_" + mensen[mensa].description + "(" + moment().day(weekDay).format() + ")_\n\n";

            	mealEntries.forEach(function (meal) {
            		message = message + "*" + meal.title + "*\n" + meal.description + "_(" + meal.studentprice + "/" + meal.staffprice + ")_\n\n"
            	});

            	return message;
            };

            if (!mensen[mensa]) {
                cb('_Mensa existiert nicht._\n\n Die angegebene Mensa ist mir nicht bekannt. Schau noch mal über den Befehl: *mensen* nach.');
            } else {
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
            var message = "_Die Mensen in Bremen_\n\n",
                tmp;

            for (tmp in mensen) {
                if (mensen.hasOwnProperty(tmp)) {
                    message = message + mensen[tmp].description + "\n\n";
                }
            }

            cb(null, message);
        }
    };    
};