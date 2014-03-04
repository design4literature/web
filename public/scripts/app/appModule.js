/*
 The MIT License (MIT)

 Copyright (c) 2014 Ruben Kleiman

 Permission is hereby granted, free of charge, to any person obtaining a copy of
 this software and associated documentation files (the "Software"), to deal in
 the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// CLIENT SIDE --------------------------------------------------------------------------------------------

'use strict';


/**
 * This is the client application's angular module.
 * Angular configuration (esp. routes) is done here.
 */

var horaceApp = angular.module('horaceApp', [
    'ngRoute',
    'angularFileUpload',
    'ui.bootstrap'
]);
/* End horaceApp module */

horaceApp.config(function ($routeProvider, $locationProvider) {

    $routeProvider
        .when('/', {
            controller: 'SigninCtrl',
            templateUrl: '/views/signin.html'
        })
        .when('/signup/', {
            controller: 'SignupCtrl',
            templateUrl: '/views/signup.html'
        })
        .when('/home/', {
            controller: 'HomeCtrl',
            templateUrl: '/views/home.html'
        })
        .when('/browse/', {
            controller: 'EditorCtrl',
            templateUrl: '/views/browse.html'
        })
        .when('/edit/:order_id    ', {
            controller: 'EditCtrl',
//            templateUrl: 'templates/editor.html',
            templateUrl: 'catalog/edit'
        })
        .when('/catalog/', {
            controller: 'CatalogCtrl',
            templateUrl: '/views/catalog.html'
        })
        .otherwise({
            redirectTo: '/'
        });

    // configure html5 to get links working on jsfiddle
//    $locationProvider.html5Mode(true);

});
/* End horaceApp Route Config */
