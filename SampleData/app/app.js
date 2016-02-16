(function () {
    'use strict';
    console.log("inside app.js");
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

})();