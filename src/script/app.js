/**
 * Created by Richard on 7/28/15.
 */
'use strict';
var angular = require('angular');

require('angular-route');

require('angular-qrcode');

var app = angular.module('BarcodeApp', ['monospaced.qrcode','ngRoute']);
app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: './script/view/barcode.html',
            controller: 'barcodeCtrl'
        })
        .otherwise({redirectTo: '/'});
})
.controller('barcodeCtrl', require('./controller/barcodeCtrl'));

angular.bootstrap(document, ['BarcodeApp']);

