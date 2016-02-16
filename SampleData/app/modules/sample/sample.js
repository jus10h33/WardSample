(function () {
    'use strict';

    angular
        .module("mainApp")
        .config(function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/');

            $stateProvider
                .state('app.sample', {
                    url: 'sample',
                    views: {
                        '@': {
                            templateUrl: '/app/modules/sample/sample.html'
                        }
                    }
                })
        })

})();