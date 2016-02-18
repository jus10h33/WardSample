(function () {
    'use strict';

    angular
        .module('mainApp')
        .config(function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/sample');
            $stateProvider
                .state('app.sample.delete', {
                    url: '/delete',
                    templateUrl: '/app/modules/sample/entry/entry.html',
                    controller: 'DeleteController'
                });
        })
        .controller("DeleteController", ["$scope", "ScopeService", "$state", "SampleService", "SetSampleService", 
            function ($scope, ScopeService, $state, SampleService, SetSampleService) {

                var x = ScopeService.getScope();
                console.log(x);
                console.log("SampleTypeNumber:  " + x.Sample.SampleTypeNumber.toString());
                $scope.Sample = x.Sample;
                $scope.Account = x.Account;

                $scope.readonly = false;
                $scope.disabled = true;
                $scope.action = 'delete';
                angular.element('#btnCommit').focus();

                $scope.commit = function () {
                    SampleService.remove($scope.Sample.SampleTypeNumber, $scope.Sample.BatchNumber, $scope.Sample.LabNumber).then(function (result) {
                        if (result.data != null) {
                            ScopeService.setScope(result.data);
                            $state.go("app.sample.entry");
                        }
                    });
                };
                $scope.Cancel = function () {
                    $state.go("app.sample.entry");
                };
            }])
})();