/*
 * FoodWatcher Bot
 *
 * A little Google Talk bot which delivers the information from the FoodWatcher service.
 *
 * Copyright(c) 2013 André König <andre.koenig@gmail.com>
 * MIT Licensed
 *
 */

var command   = require('./command')(),
    messages  = require('./messages')(),
    processor = require('./processor')(),
    xmpp      = require('node-xmpp');

module.exports = function () {

    'use strict';

    var connection,
        privates = {};

    // DOCME
    privates.setStatusMessage = function (message) {
        var $presence = new xmpp.Element('presence', {});

        $presence.c('show').t('chat').up().c('status').t(message);

        connection.send($presence);
    };

    // DOCME
    privates.requestGoogleRoster = function () {
        var $roster = new xmpp.Element('iq', {
            from: connection.jid,
            type: 'get',
            id: 'google-roster'
        });

        $roster.c('query', {
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

    // DOCME
    privates.sendPresence = function (recipient, type) {
        var $response = new xmpp.Element('presence', {
            from: connection.jid,
            to: recipient,
            type: type
        });

        connection.send($response);

        console.log('[presence] SENT: ' + $response.up().toString());
    };

    // DOCME
    privates.dispatch = function (stanza) {
        var cmd,
            recipient;

        recipient = stanza.attrs.from;

        // Something bad happened
        if('error' === stanza.attrs.type) {
            console.log("[ERROR] " + stanza.toString());

            return;
        }

        // Subscription
        if (stanza.is('presence')) {
            switch (stanza.attrs.type) {
                case 'subscribe':
                    privates.sendPresence(recipient, 'subscribed');

                    privates.sendMessage(recipient, messages.get('HELP'));
                break;

                case 'unavailable':
                    // TODO: Find a way to identify a leaving user.
                break;
            }

        // Chat message
        } else if (stanza.is('message')) {

            switch (stanza.attrs.type) {
                case 'chat':
                    cmd = stanza.getChildText('body');

                    if (cmd) {
                        cmd = command.parse(cmd);

                        if (cmd.error) {
                            privates.sendMessage(recipient, cmd.error);
                        } else {
                            processor.treat(cmd, function (err, result) {
                                if (err) {
                                    result = err;
                                }

                                privates.sendMessage(recipient, result);
                            });
                        }
                    }
                break;
            }
        }
    };

    return {
        startup : function (config) {
            connection = new xmpp.Client(config.gtalk.client);
            connection.socket.setTimeout(0);
            connection.socket.setKeepAlive(true, config.gtalk..keepAlive);

            connection.on('online', function () {
                privates.setStatusMessage(config.gtalk..status);

                // Preventing timeouts
                setInterval(function() {
                    connection.send(' ');
                }, 30000);
            });

            connection.on('error', function (stanza) {
                console.log("[ERROR] " + stanza.toString());
            });

            if (config.gtalk.autoSubscribe) {
                // Enable the bot to respond to subscription requests
                connection.addListener('online', privates.requestGoogleRoster);
            }

            connection.addListener('stanza', privates.dispatch);
        }
    };
};