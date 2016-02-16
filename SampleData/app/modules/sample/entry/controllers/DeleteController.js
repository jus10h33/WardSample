(function () {
    'use strict';

    angular
        .module('mainApp')
        .config(function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/sample');
            $stateProvider
                .state('app.sample.entry', {
                    url: '/delete',
                    views: {
                        '@app.sample': {
                            templateUrl: '/app/modules/sample/entry/entry.html',
                            controller: 'DeleteController'
                        }
                    }
                });
        })
        .controller("DeleteController", ["$scope", DeleteController])

    function DeleteController($scope) {
        $scope.DeleteSample = function () {
            Sample.remove($scope.Sample.SampleTypeNumber, $scope.Sample.BatchNumber, $scope.Sample.LabNumber).then(function (result) {
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