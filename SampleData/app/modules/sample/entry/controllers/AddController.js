(function () {
    'use strict';

    angular
        .module('mainApp')
        .config(function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/sample');
            $stateProvider
                .state('app.sample.entry', {
                    url: '/add',
                    views: {
                        '@app.sample': {
                            templateUrl: '/app/modules/sample/entry/entry.html',
                            controller: 'AddController'
                        }
                    }
                });
        })
        .controller("AddController", ["$scope", AddController])

    function AddController($scope) {
        $scope.AddSample = function () {
            $scope.SetSampleChainValues();

            Sample.add($scope.Sample, $scope.SampleChain, $scope.SampleRecs, $scope.SubSampleInfo).then(function (result) {
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