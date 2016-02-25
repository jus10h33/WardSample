(function () {
    'use strict';

    angular
        .module('mainApp')
        .config(function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/sample');
            $stateProvider
                .state('app.sample.find1', {
                    url: '/find',
                    templateUrl: '/app/modules/sample/entry/entry.html',
                    controller: 'FindController1'
                })
                .state('app.sample.find2', {
                    url: '/find/:stn/:bn/:ln',
                    templateUrl: '/app/modules/sample/entry/entry.html',
                    controller: 'FindController2'
                });
        })
        .controller("FindController1", ["$scope", "ScopeService", "$state", "$stateParams", "SampleService", "SetSampleService", function ($scope, ScopeService, $state, $stateParams, SampleService, SetSampleService) {

            var x = ScopeService.getScope();
            $scope.Sample = {};
            if (angular.isDefined(x.SampleTypes)) {
                $scope.SampleTypes = x.SampleTypes;
                $scope.SampleColumns = x.SampleColumns;
            } else {
                SampleService.loadSampleTypes().then(function (result) {
                    $scope.SampleTypes = result.data
                });
                SampleService.loadSampleColumns().then(function (result) {
                    $scope.Samplecolumns = result.data;
                });
            }
            if (angular.isDefined(x.Sample.SampleTypeNumber)) {
                $scope.Sample.SampleTypeNumber = x.Sample.SampleTypeNumber;
            } else {
                var x = 1;
                $scope.Sample.SampleTypeNumber = x.toString();
            }

            $scope.Commit = function () {
                if ($scope.entryForm.cboSampleType.$valid && $scope.entryForm.txtLabNumber.$valid) {
                    if (($scope.entryForm.txtBatchNumber.$invalid && angular.isUndefined($scope.Sample.BatchNumber)) || $scope.entryForm.txtBatchNumber.$valid) {
                        $state.go("app.sample.find2", { stn: $scope.Sample.SampleTypeNumber, bn: $scope.Sample.BatchNumber, ln: $scope.Sample.LabNumber });
                    } else {
                        DisplayPopover("txtBatchNumber", "Must be correct format [yyyymmdd]");
                        angular.element('#txtBatchNumber').addClass('has-error');
                    }
                } else {
                    if ($scope.entryForm.cboSampleType.$invalid) {
                        DisplayPopover("cboSampleTypeNumber", "Required field");
                        angular.element('#cboSampleTypeNumber').addClass('has-error');
                    }
                    if ($scope.entryForm.txtLabNumber.$invalid) {
                        DisplayPopover("txtLabNumber", "Must be numeric");
                        angular.element('#txtLabNumber').addClass('has-error');
                    }
                }
            };
            $scope.Cancel = function () {
                $state.go("app.sample.entry");
            };

            $scope.readonly = false;
            $scope.disabled = true;
            $scope.disabledFind = false;
            $scope.action = 'find';
            $scope.rightSide = false; // hide sample info and recommendations
            angular.element('#txtBatchNumber').focus();

            function ClearForm() {
                var stn = x;
                $scope.Sample = {};
                $scope.Sample.SampleTypeNumber = stn;
                $scope.Account = {};
                $scope.SampleChain = {};
                $scope.SampleChains = {};
                $scope.Recommendations = [];
                angular.element("#acoGrower").autocomplete({ source: [] });
            };            
        }])
    .controller("FindController2", ["$scope", "ScopeService", "$state", "$stateParams", "SampleService", "SetSampleService", function ($scope, ScopeService, $state, $stateParams, SampleService, SetSampleService) {

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