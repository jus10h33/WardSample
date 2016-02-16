(function () {
    'use strict';

    angular
        .module('mainApp')
        .config(function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/sample');
            $stateProvider
                .state('app.sample.entry', {
                    url: '/find',
                    controller: 'FindController'
                });
        })
        .controller("FindController", ["$scope", FindController])

    function FindController($scope) {
        $scope.FindSample = function () {
            Sample.find($scope.Sample.SampleTypeNumber, $scope.Sample.LabNumber, $scope.Sample.BatchNumber).then(function (result) {
                console.log(result);
                if (result.data != null) {
                    $scope.SetFormValues(result.data);
                    $scope.SetRecLayout();
                    $scope.ResetForm();
                } else {
                    angular.element("#txtLabNumber").focus();
                }
            });
        };
    }
})();