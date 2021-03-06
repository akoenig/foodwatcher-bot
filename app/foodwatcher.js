/*
 * FoodWatcher Bot
 *
 * A little Google Talk bot which delivers the information from the FoodWatcher service.
 *
 * Copyright(c) 2013 André König <andre.koenig@gmail.com>
 * MIT Licensed
 *
 */

var request   = require('./request')(),
    logger    = require('./logger')(),
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
        var $elm,
            supportsMarkdown;

        supportsMarkdown = (/\/gmail|TalkGadget/.test(recipient));

        $elm = new xmpp.Element('message', {
            from: connection.jid,
            to: recipient,
            type: 'chat'
        });

        // Remove the markdown if the client does not have the
        // possibility to display it correctly.
        if (!supportsMarkdown) {
            message = message.replace(/\*|_/g, "");
        }

        $elm.c('body').t(message);

        connection.send($elm);

        logger.debug(messages.compile("[RESPONSE] Sent message. Recipient: {recipient}", {recipient: recipient}));
    };

    // DOCME
    privates.sendPresence = function (recipient, type) {
        var $response = new xmpp.Element('presence', {
            from: connection.jid,
            to: recipient,
            type: type
        });

        connection.send($response);
    };

    // DOCME
    privates.dispatch = function (stanza) {
        var req,
            recipient,
            command;

        recipient = stanza.attrs.from;

        // Something bad happened
        if('error' === stanza.attrs.type) {
            logger.error("[DISPATCH] Something bad happened while dispatching message: " + stanza.toString());

            return;
        }

        // Subscription
        if (stanza.is('presence')) {
            switch (stanza.attrs.type) {
                case 'subscribe':
                    logger.info(messages.compile("[SUBSCRIBE] ({recipient})", {recipient: recipient}));

                    privates.sendPresence(recipient, 'subscribed');

                    privates.sendMessage(recipient, messages.get('HELP'));
                break;

                case 'unavailable':
                    // TODO: Find a way to identify a leaving user.
                    // logger.info(messages.compile("[UNAVAILABLE] ({recipient})", {recipient: recipient}));
                break;
            }

        // Chat message
        } else if (stanza.is('message')) {

            switch (stanza.attrs.type) {
                case 'chat':
                    command = stanza.getChildText('body');

                    if (command) {
                        command = command.toLowerCase();

                        req = request.parse(command);

                        if (req.error) {
                            logger.debug(messages.compile("[PARSING] Wrong command structure. Recipient: {recipient} - Request: {request}", {recipient: recipient, request: request}));

                            privates.sendMessage(recipient, req.error);
                        } else {
                            logger.debug(messages.compile("[REQUEST] Recipient: {recipient} - Request: {request}", {recipient: recipient, request: req.type}));

                            processor.treat(req, function (err, result) {
                                if (err) {
                                    logger.error("[PROCESSOR] Error occured while processing command: " + JSON.stringify(err));
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
            // Creating the logger
            logger = logger.create(config.logger);
            logger.info("[BOOT] Let's go ...");

            connection = new xmpp.Client(config.gtalk.client);
            connection.socket.setTimeout(0);
            connection.socket.setKeepAlive(true, config.gtalk.keepAlive);

            connection.on('online', function () {
                privates.setStatusMessage(config.gtalk.status);
                logger.info("[BOOT] Ready to roll! Status: " + config.gtalk.status);

                // Preventing timeouts
                setInterval(function() {
                    connection.send(' ');
                }, 30000);
            });

            connection.on('error', function (stanza) {
                logger.error("[CONNECTION] Something bad happened while a user tried to connect: " + stanza.toString());

                return;
            });

            if (config.gtalk.autoSubscribe) {
                // Enable the bot to respond to subscription requests
                connection.addListener('online', privates.requestGoogleRoster);
            }

            connection.addListener('stanza', privates.dispatch);
        }
    };
};