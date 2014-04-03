/*
 * Copyright (c) 2014 Ruben Kleiman under Creative Commons Attribution-ShareAlike 4.0 International License.
 *
 * This work is licensed under the Creative Commons Attribution-ShareAlike 4.0 International License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-sa/4.0/ or send a letter
 * to Creative Commons, 444 Castro Street, Suite 900, Mountain View, California, 94041, USA.
 *
 */

// SERVER SIDE --------------------------------------------------------------------------------------------

'use strict';

var io = require('socket.io');

/**
 * Initializes socket io communication.
 * The names of the sockets are cached in the app locals
 * with keys 'notificationSocketName' and 'txSocketName' for
 * the names of the notification and transaction sockets, respectively.
 *
 * @param app   The express app
 * @param sessionSockets    The websocket session manager
 * @param server    The http server.
 * @param ioLogLevel  The log level for socket.io
 * @return Sets into the app the 'sockets' object (to get it: app.get('sockets'))
 * containing a sockets object with interesting sockets for use, including:
 * noteSocket: a socket for communicating errors to the client
 */
exports.init = function (app, sessionSockets, server, ioLogLevel) {

    io = io.listen(server);
    io.set('log level', ioLogLevel);

    /* notificationSocketName: Name of socket used for notifications to the client */
    var notificationSocketName = 'note';
    app.set('notificationSocketName', notificationSocketName);

    /* txSocketName: Name of socket used for transactions between client and server */
    var txSocketName = 'tx';
    app.set('txSocketName', txSocketName);

    /* socketNames: the names of supported sockets */
    var socketNames = [notificationSocketName, txSocketName];


    /**
     * Checks whether the socket name is supported.
     * @param name The socket's name
     * @throws Fatal error if the socket name is not supported
     */
    function checkSocketName(name) {
        if (socketNames.indexOf(name) === -1) {
            throw {type: 'fatal', msg: 'Invalid socket named ' + name};
        }
    }

    /**
     * Caches socket/session associations.
     * key := session id, value := <socketMap>
     * <socketMap> := (key := socket type, value := the socket)
     * TODO IMPORTANT: this is a memory sink: persist overflow to disk or limit # simul sessions per server
     */
    var socketCache = {};

    /**
     * Returns the socket for the given type and socket id.
     * @param session   The session
     * @param socketName  The socket's name.
     * @throws Transient error if there is no socket of the given type.
     * Considering it transient because it might be due to a race
     * condition. Transients get logged.
     */
    var getSocket = function (session, socketName) {
        checkSocketName(socketName);
        if (typeof session === 'undefined') {
            throw {type: 'trans', msg: 'No session exists'};
        }
        var sessionSockets = socketCache[session.id];
        if (typeof sessionSockets === 'undefined') {
            throw {type: 'trans', msg: 'Session not cached'};
        }
        var socket = sessionSockets[socketName];
        if (!socket) {
            throw {type: 'trans', msg: 'Failed to find expected socket named ' + socketName + ' for session id ' + sessionSockets.id};
        }
        return socket;
    };

    app.set('sockets', {getSocket: getSocket});

    io.configure(function () {
        io.set('authorization', function (handshakeData, callback) {
            if (handshakeData.xdomain) {
                callback('Cross-domain connections are not allowed');
            } else {
                callback(null, true);
            }
        });
    });

    /**
     * Associates the socket with the session.
     * @param socketName  The socket's name
     * @param session   The session
     * @param socket    The socket
     */
    function addSocketToSession(socketName, session, socket) {
        checkSocketName(socketName);
        if (typeof session === 'undefined' || typeof socket === 'undefined') {
            throw {type: 'fatal', msg: 'No session and/or socket passed'};
        }
        if (!socketCache[session.id]) {
            socketCache[session.id] = {};
        }
        socketCache[session.id][socketName] = socket;
        console.log('Session id %s associated with %s socket id %', session.id, socketName, socket.id);
    }

    /**
     * Removes a socket/session association.
     * @param socketName  The socket's name.
     * @param session   The session
     */
    function removeSocketFromSession(socketName, session) {
        checkSocketName(socketName);
        if (typeof session !== 'undefined') {
            if (socketCache[session.id]) {
                delete socketCache[session.id][socketName];
                if (Object.keys(socketCache[session.id]).length === 0) {
                    delete socketCache[session.id];
                }
                console.log('Session id %s dissociated from %s socket', session.id, socketName);
            }
        }
    }

    io.of('/note').on('connection',function (noteSocket) {
        sessionSockets.getSession(noteSocket, function (err, session) {
            if (err) {
                // TODO send trans error to client
                console.trace('Failed to get session from noteSocket. [%s]', JSON.stringify(err));
                return;
            }
//            console.log('%s total connections', Object.keys(io.connected).length);
            addSocketToSession(notificationSocketName, session, noteSocket);
        });

        noteSocket.on('disconnect', function () {
            var theSocket = this;
            if (typeof theSocket.emit === 'undefined') {
                console.trace('Disconnect "this" is not the disconnected socket!');
                return;
            }
            sessionSockets.getSession(theSocket, function (err, session) {
                if (err) {
                    console.trace('Failed to disconnect from socket: %s', err);
                    return;
                }
                removeSocketFromSession(notificationSocketName, session);
//                console.log('%s total connections', Object.keys(io.connected).length);
            });
        });
    }).on('connect_failed',function () {
            console.warn('Connect noteSocket failed');
        }).on('error', function () {
            console.warn('Error on noteSocket');
        });


    io.of('/tx').on('connection', function (txSocket) {
        sessionSockets.getSession(txSocket, function (err, session) {
            if (err) {
                // TODO send trans error to client
                console.trace('Failed to get session from txSocket (%s)', JSON.stringify(err));
                return;
            }
            addSocketToSession(txSocketName, session, txSocket);
//            console.log('%s total connections', Object.keys(io.connected).length);
        });

        txSocket.on('disconnect', function () {
            var theSocket = this; // TODO always true? this is a flaky API should at least do a check on class type
            if (typeof theSocket.emit === 'undefined') {
                console.trace('Disconnect "this" is not the disconnected socket!');
                return;
            }
            sessionSockets.getSession(theSocket, function (err, session) {
                if (err) {
                    console.trace('Failed to disconnect from socket');
                    return;
                }
                removeSocketFromSession(txSocketName, session);
//                console.log('%s total connections', Object.keys(io.connected).length);
            });
        });
    });
};