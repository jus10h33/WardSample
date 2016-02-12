(function () {
    'use strict';

    angular
        .module('sampleFind', ["ui.router"])
        .config(function ($stateProvider, $urlRouterProvider) {

            $stateProvider
                .state('find', {
                    url: '/sample/entry/find',
                    controller: 'findSampleCtlr1'
                })
                .state('find.sample', {
                    url: '/:stn/:bn/:ln',
                    controller: 'findSampleCtlr2'
                });
        })
        .controller('FindSampleCtlr1', ["$scope", FindSampleCtlr1])
        .controller('FindSampleCtlr2', ["$scope", FindSampleCtlr2])

    function FindSampleCtlr1() {

    }

    function FindSampleCtlr2() {

    }

})();