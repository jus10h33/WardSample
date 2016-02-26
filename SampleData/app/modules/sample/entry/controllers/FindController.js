(function () {
    'use strict';

    angular
        .module('mainApp')
        .controller("FindController", ["$scope", "ScopeService", "$state", "$stateParams", "SampleService", "SetSampleService", function ($scope, ScopeService, $state, $stateParams, SampleService, SetSampleService) {

            var stn = $stateParams.stn;
            var bn = $stateParams.bn;
            var ln = $stateParams.ln;

            var x = ScopeService.getScope();
            $scope.SampleTypes = x.SampleTypes;
            $scope.SampleColumns = x.SampleColumns;
            $scope.Sample = {};

                SampleService.find(stn, bn, ln).then(function (result) {
                    if (result.data != null) {
                        console.log(result.data);
                        $scope.SampleColumns = result.data.GenericMasters.SampleColumns;
                        $scope.SampleTypes = result.data.GenericMasters.SampleTypes;
                        $scope.Sample = result.data.GenericInfo.Samples[0];
                        $scope.Account = result.data.GenericInfo.Accounts[0];
                        SetSampleService.setAllValues(result.data);
                        $state.go("app.sample.entry1", { stn: $scope.Sample.SampleTypeNumber, bn: $scope.Sample.BatchNumber, ln: $scope.Sample.LabNumber })
                    } else {
                        angular.element("#txtLabNumber").focus();
                    }
                });
        }])
})();