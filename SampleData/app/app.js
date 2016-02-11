(function () {
    'use strict';

    //var mainCtlr = function ($scope, $http, $filter) {

    //}

    angular
        .module("mainApp", ["ui.router"])
        .config(function ($stateProvider, $urlRouterProvider) {

            $urlRouterProvider.otherwise('/');

        })
        //.controller("mainCtrl", [$scope, $http, $filter, mainCtlr])
})();