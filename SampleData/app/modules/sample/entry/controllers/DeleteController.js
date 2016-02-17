(function () {
    'use strict';

    angular
        .module('mainApp')
        .config(function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/sample');
            $stateProvider
                .state('app.sample.delete', {
                    url: '/delete',
                    controller: 'DeleteController'
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