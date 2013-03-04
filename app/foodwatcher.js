/*
 * Foodwatcher Bot
 *
 * "A little Google Talk bot which delivers the information from the Foodwatcher service.
 *
 * Copyright(c) 2013 André König <andre.koenig@gmail.com>
 * MIT Licensed
 *
 */

var backend = require('./backend')(),
    xmpp = require('node-xmpp');

module.exports = function () {

    var connection,
        privates = {};

    // DOCME
    privates.setStatusMessage = function (message) {
        var $presence = new xmpp.Element('presence', { })
                        .c('show').t('chat').up()
                        .c('status').t(message);

        connection.send($presence);
    };

    // DOCME
    privates.requestGoogleRoster = function () {
    	var $roster = new xmpp.Element('iq', {
    		from: connection.jid,
    		type: 'get',
    		id: 'google-roster'
    	}).c('query', {
    		xmlns: 'jabber:iq:roster',
    		'xmlns:gr': 'google:roster',
    		'gr:ext': '2' 
    	});

    	connection.send($roster);
    };

    // DOCME
    privates.sendMessage = function (recipient, message) {
    	var $elm = new xmpp.Element('message', {
            from: connection.jid,
            to: recipient,
            type: 'chat'
        });

        $elm.c('body').t(message);

    	connection.send($elm);

    	console.log('[message] SENT: ' + $elm.up().toString());
    };

    privates.sendPresence = function (recipient, type) {
        $response = new xmpp.Element('presence', {
            from: connection.jid,
            to: recipient,
            type: type
        });

        connection.send($response);

        console.log('[presence] SENT: ' + $elm.up().toString());
    }

    // DOCME
    privates.dispatch = function (config) {
    	return function (stanza) {
            var recipient = stanza.attrs.from;

            // Something bad happened
            if('error' === stanza.attrs.type) {
                console.log("[ERROR] " + stanza.toString());
                return;
            }

            // Subscription
            if (stanza.is('presence')) {
                if ('subscribe' === stanza.attrs.type) {
                    privates.sendPresence(recipient, 'subscribed');
                }

            // Chat message
            } else if (stanza.is('message')) {
                if ('chat' === stanza.attrs.type) {
                    privates.sendMessage(recipient, 'Hello world')
                }
            }
    	};
    };

    return {
        startup : function (config) {
            connection = new xmpp.Client(config.client);
            connection.socket.setTimeout(0);
            connection.socket.setKeepAlive(true, config.keepAlive);

            connection.on('online', function () {
                privates.setStatusMessage(config.status)

                // Preventing timeouts
                setInterval(function() {
                    connection.send(' ');
                }, 30000);
            });

            connection.on('error', function (stanza) {
            	console.log("[ERROR] " + stanza.toString());
            });

            if (config.autoSubscribe) {
            	// Enable the bot to respond to subscription requests
            	connection.addListener('online', privates.requestGoogleRoster);
            }

            connection.addListener('stanza', privates.dispatch(config))
        }
    };
};