(function () {
    'use strict';

    angular
        .module('mainApp')
        .config(function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/sample');
            $stateProvider
                .state('app.sample.cancel', {
                    url: '/Cancel',
                    controller: 'CancelController'
                });
        })
        .controller("CancelController", ["$scope", CancelController])

    $scope.CancelAction = function () {
        console.log("CancelAction called");
        if ($scope.action == 'add' || $scope.action == 'update') {
            if (!angular.equals($scope.Sample, $scope.holdSample) || (angular.isDefined($scope.holdSampleChain) && !angular.equals($scope.SampleChain, $scope.holdSampleChain)) || (angular.isDefined($scope.Recommendtations) && !angular.equals($scope.Recommendations, $scope.holdRecommendations)) || (angular.isDefined($scope.holdSubSampleInfo) && !angular.equals($scope.SubSampleInfo, $scope.holdSubSampleInfo))) {
                $('#discardChangesModal').modal('show');
            } else {
                $scope.ResetForm();
                $scope.Load(1); // Change to load last sampletype in cache            
            }
        } else {
            $scope.ResetForm();
            $scope.Load(1); // Change to load last sampletype in cache            
        }
    };

    $state.go('');
})();