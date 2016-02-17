(function () {
    'use strict';

    angular
        .module('mainApp')
        .config(function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/sample');
            $stateProvider
                .state('app.sample.add', {
                    url: '/add',
                    controller: 'AddController'
                });
        })
        .controller("AddController", ["$scope", AddController])

    function AddController($scope) {

        //$scope.SetSampleChainValues();

        SampleService.add($scope.Sample, $scope.SampleChain, $scope.SampleRecs, $scope.SubSampleInfo).then(function (result) {
            if (result.data != null) {
                //$scope.SetFormValues(result.data);
            } else {
                //$scope.Load($scope.Sample.SampleTypeNumber);
            }
            //$scope.ResetForm();
        });
    }
})();