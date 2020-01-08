'use strict';

// Declare app level module which depends on views, and core components
angular.module('myApp', [
    'ngRoute',
    'myApp.view1',
    'myApp.view2',
    'myApp.version'
]).

config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');
    $routeProvider.otherwise({ redirectTo: '/index' });
}]);

function checkSession() {
    let logged_timestamp = window.localStorage.getItem('logged_timestamp');
    let user_id = window.localStorage.getItem('id');
    if (logged_timestamp) {
        let now = Date.now();
        let session_time = 7; //Days
        //Compute log timestamp if more that 5 mins
        let diff = logged_timestamp - now;
        diff = diff + (((session_time * 24) * 60) * 1000); //7 days
        // diff = diff + (session_time * 1000); //5 secs
        const isTimeout = diff < 0;
        // console.log(diff);
        if (isTimeout && user_id) {
            window.localStorage.clear();
            window.location.href = "/index";
        }
    }
}
checkSession();
