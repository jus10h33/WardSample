(function () {
    'use strict';

    angular
        .module("mainApp", ["ui.router"])
        .config(function ($stateProvider, $urlRouterProvider) {

           // $urlRouterProvider.otherwise('/');

            $stateProvider
                .state('mainApp', {
                    url: '/',
                    controller: 'MainCtlr'
                });
                //.state('sample', {
                //    url: '/sample',
                //    controller: 'SampleCtlr'
                //})
                //.state('sampleEntry', {
                //    url: '/sample/entry',
                //    controller: 'SampleEntryCtlr'
                //});
        })
        .controller("MainCtlr", ["$scope", MainCtlr])

        //.controller("SampleCtlr", ["$scope", SampleCtlr])

        //.controller("SampleEntryCtlr", ["$scope", SampleEntryCtlr])
    ;

    function MainCtlr($scope) {
        
        console.log("Main controller");
    };

    function SampleEntryCtlr($scope) {
        console.log("Sample Entry controller")
        $scope.readonly = true;
    };

    function SampleCtlr() {
        console.log("Sample controller");
    };

})();