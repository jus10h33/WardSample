(function () {
    'use strict';

    angular
        .module("mainApp", ["ui.router"])
        .config(function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/');

            $stateProvider
                .state('app', {
                    url: '/',
                    template: '<h1> This is the index page</h1>'
                })
                .state('app.sample', {
                    url: 'sample',
                    templateUrl: '/app/modules/sample/entry/sample.html'
                })
                .state('app.sample.entry', {
                    url: 'entry',
                    views: {
                        'sampleInfo@': {
                            templateUrl: '/app/modules/sample/entry/info.html'
                        },
                        'sampleChain@': {
                            templateUrl: '/app/modules/sample/entry/chain.html'
                        },
                    }
                });
        })

})();