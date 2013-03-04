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
    privates.becomeFriends = function (stanza) {
    	var $subscriber;

    	if (stanza.is('presence') && stanza.attrs.type === 'subscribe') {
    	    $subscriber = new xmpp.Element('presence', {
    	        to: stanza.attrs.from,
    	        type: 'subscribed'
    	    });
			connection.send($subscriber);
    	    privates.sendMessage(stanza.attrs.from, 'Hello mate!');
    	}
    };

    // DOCME
    privates.sendMessage = function (recipient, message) {
    	var $elm = new xmpp.Element('message', { to: recipient, type: 'chat' })
    	                 .c('body').t(message);
    	connection.send($elm);

    	console.log('[message] SENT: ' + $elm.up().toString());
    };

    // DOCME
    privates.dispatch = function (config) {
    	return function (message) {
    		var command;

    		if (message.attrs.type === 'error') {
    		    console.log('[ERROR] ' + message.toString());
    		} else if (message.is('message')) {
    			command = (function () {
                    // The command structure:
                    // [0] -> command; [...] arguments
                    // e.g. mensen
                    // e.g. heute airport
    				var parts = message.getChildText('body').split(config.commandSeparator)

    				if (backend.isValid(parts[0])) {
                        return {
                            type: parts[0],
                            args: parts.slice(1, parts.length - 1)
                        }
    				} else {
    					return;
    				}
    			}());

    			if (!command) {
	    			privates.sendMessage(message.attrs.from, 'unknown command');
    			} else {
                    backend.execute(command, function (result) {
                        privates.sendMessage(message.attrs.from, result);
                    });
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
            	connection.addListener('stanza', privates.becomeFriends);
            }

            connection.addListener('stanza', privates.dispatch(config))
        }
    }
}