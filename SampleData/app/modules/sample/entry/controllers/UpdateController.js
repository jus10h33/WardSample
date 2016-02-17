(function () {
    'use strict';

    angular
        .module('mainApp')
        .config(function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/sample');
            $stateProvider
                .state('app.sample.update', {
                    url: '/update',
                    controller: 'UpdateController'
                });
        })
        .controller("UpdateController", ["$scope", UpdateController])

    function UpdateController($scope) {
        $scope.UpdateSample = function () {
            $scope.SetSampleChainValues();

            Sample.update($scope.Sample, $scope.SampleChain, $scope.SampleRecs, $scope.SubSampleInfo).then(function (result) {
                console.log(result);
                if (result.data != null) {
                    $scope.SetFormValues(result.data);
                } else {
                    $scope.Load($scope.Sample.SampleTypeNumber);
                }
                $scope.ResetForm();
            });
        };
    }
})();