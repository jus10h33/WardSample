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
                    resolve: {
                        PreviousState: [
                            "$state",
                            function ($state) {
                                var currentStateData = {
                                    Name: $state.current.name,
                                    Params: $state.params,
                                    URL: $state.href($state.current.name, $state.params)
                                };
                                return currentStateData;
                            }
                        ]
                    },
                    controller: 'DeleteController'
                });
        })
        .controller("DeleteController", ["$scope", "ScopeService", "$state", "SampleService", "SetSampleService", "PreviousState", "hotkeys", 
            function ($scope, ScopeService, $state, SampleService, SetSampleService, PreviousState, hotkeys) {

                if (PreviousState.Name != "app.sample.entry") {
                    $state.go("app.sample.entry");
                }

                var x = ScopeService.getScope();
                console.log(x);
                $scope.Sample = x.Sample;
                $scope.SampleTypes = x.SampleTypes;
                $scope.Sample.SampleTypeNumber = x.Sample.SampleTypeNumber.toString();
                $scope.Account = x.Account;
                $scope.readonly = false;
                $scope.disabled = true;
                $scope.disabledFind = true;
                $scope.disabledUpdate = true;
                $scope.action = 'delete';
                angular.element('#btnCommit').focus();

                $scope.Commit = function () {
                    SampleService.remove($scope.Sample.SampleTypeNumber, $scope.Sample.BatchNumber, $scope.Sample.LabNumber).then(function (result) {
                        if (result.data != null) {
                            ScopeService.setScope(result.data);
                            $state.go("app.sample.entry");
                        }
                    });
                };
                $scope.Cancel = function () {
                    console.log($scope.Sample);
                    console.log($scope.holdSample);
                    if (angular.equals($scope.Sample, $scope.holdSample)) {
                        $state.go("app.sample.entry");
                    } else {
                        alert("data has changed");
                    }
                };
                hotkeys.bindTo($scope)
                .add({
                    combo: 'enter',
                    description: 'Commit',
                    callback: function () { $scope.Commit(); }
                })
                .add({
                    combo: 'esc',
                    description: 'Cancel',
                    callback: function () { $scope.Cancel(); }
                });
            }])
})();