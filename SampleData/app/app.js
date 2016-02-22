(function () {
    'use strict';

    angular
        .module("mainApp", ["ui.router", "cfp.hotkeys"])
        .config(function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/');

            $stateProvider
                .state('app', {
                    url: '/',
                    template: '<h1>This is the index page</h1>',
                    controller: 'mainController'
                })
        })
        .controller('mainController', ["$scope", function ($scope) {

        }]);
        //.run (function($state){ console.log($state.get()); });
})();

