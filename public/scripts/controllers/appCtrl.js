/*
 *The MIT License (MIT)
 *
 *Copyright (c) 2014 Ruben Kleiman
 *
 *Permission is hereby granted, free of charge, to any person obtaining a copy of this software
 *and associated documentation files (the "Software"), to deal in the Software without restriction,
 *including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
 *and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
 *subject to the following conditions:
 *
 *The above copyright notice and this permission notice shall be included in all copies or
 *substantial portions of the Software.
 *
 *THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 *INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 *PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 *LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 *TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR
 *THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// CLIENT SIDE --------------------------------------------------------------------------------------------

/**
 * This is the toplevel controller for the client.
 * All global-like behavior should be encapsulated here.
 */

'use strict';

// DBG type := {true|false} true is http, false is sockets
var debug = true;
if (debug) {
    $('#httpDebug').css('display', 'inline');
    $('#socketDebug').css('display', 'inline');
}

horaceApp.debug = function (obj, type) {
    if (debug) {
        var dbg = (typeof type === 'undefined' || type) ? $('#httpDebug') : $('#socketDebug')
        dbg.css('display', 'inline');
        if ('undefined' !== typeof dbg) {
            if (obj.type === 'trans') {
                dbg.css('color', 'blue');
            } else if (obj.type === 'ack') {
                dbg.css('color', 'green');
            } else {
                dbg.css('color', 'red');
            }
            dbg[0].innerHTML = '<b>' + JSON.stringify(obj) + '</b>';
        }
    }
};

horaceApp.controller('AppCtrl', function ($scope, $rootScope, SocketsService) {

    $rootScope.$on('$stateChangeStart',
        function (event, toState, toParams, fromState, fromParams) {
            console.info(event);
//            event.preventDefault();
        });

    // Connect websockets when client is (re-)loaded
    SocketsService.connectSockets();

    $scope.app =
    {
        menubar: 'views/menubarOffline.html'
    };

});
/* End AppCtrl */