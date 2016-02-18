(function () {
    'use strict';

    angular
        .module("mainApp", ["ui.router"])
        .config(function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/');

            $stateProvider
                .state('app', {
                    url: '/',
                    template: '<h1>This is the index page</h1>'
                });
        })
        .run (function($state){ console.log($state.get()); });
})();