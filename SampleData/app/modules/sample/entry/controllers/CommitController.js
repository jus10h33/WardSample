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
        $scope.SubmitForm = function (action) {
            console.log("Action: " + action);
            if (action == 'find') {
                if ($scope.entryForm.cboSampleType.$valid && $scope.entryForm.txtLabNumber.$valid) {
                    console.log("batchnumber: |" + $scope.Sample.BatchNumber + "|");
                    if (($scope.entryForm.txtBatchNumber.$invalid && angular.isUndefined($scope.Sample.BatchNumber)) || $scope.entryForm.txtBatchNumber.$valid) {
                        $scope.FindSample();
                        return;
                    } else {
                        $scope.DisplayPopover("txtBatchNumber", "Must be correct format [yyyymmdd]");
                        angular.element('#txtBatchNumber').addClass('has-error');
                    }
                } else {
                    if ($scope.entryForm.cboSampleType.$invalid) {
                        $scope.DisplayPopover("cboSampleTypeNumber", "Required field");
                        angular.element('#cboSampleTypeNumber').addClass('has-error');
                    }
                    if ($scope.entryForm.txtLabNumber.$invalid) {
                        $scope.DisplayPopover("txtLabNumber", "Must be numeric");
                        angular.element('#txtLabNumber').addClass('has-error');
                    }
                }
                return;
            }
            if (action == 'delete') {
                if ($scope.entryForm.txtAccountNumber.$valid && $scope.entryForm.txtBatchNumber.$valid && $scope.entryForm.txtLabNumber.$valid) {
                    $scope.DeleteSample();
                    return;
                } else {
                    if ($scope.entryForm.txtAccountNumber.$invalid) {
                        $scope.DisplayPopover("txtAccountNumber", "Must be numeric");
                        angular.element('#txtAccountNumber').addClass('has-error');
                    }
                    if ($scope.entryForm.txtBatchNumber.$invalid) {
                        $scope.DisplayPopover("txtBatchNumber", "Must be correct format [yyyymmdd]");
                        angular.element('#txtBatchNumber').addClass('has-error');
                    }
                    if ($scope.entryForm.txtLabNumber.$invalid) {
                        $scope.DisplayPopover("txtLabNumber", "Must be numeric");
                        angular.element('#txtLabNumber').addClass('has-error');
                    }
                    return;
                }
            }
            if ($scope.ValidateForm()) {
                if ($scope.Sample.SampleTypeNumber == 1 || $scope.Sample.SampleTypeNumber == 14) {
                    if ($scope.ValidateRecs()) {
                        $scope.sampleRecs = $scope.ConvertRecs();
                    }
                } else if ($scope.Sample.SampleTypeNumber == 2 || $scope.Sample.SampleTypeNumber == 3 || $scope.Sample.SampleTypeNumber == 4 || $scope.Sample.SampleTypeNumber == 6 || $scope.Sample.SampleTypeNumber == 7 || $scope.Sample.SampleTypeNumber == 9 || $scope.Sample.SampleTypeNumber == 12 || $scope.Sample.SampleTypeNumber == 5) {
                    $scope.SetSubSampleInfo();
                }
                if (action == 'add') {
                    $scope.AddSample();
                } else if (action == 'update') {
                    $scope.UpdateSample();
                }
                $scope.disabled = true;
                $scope.disabledUpdate = false;
            }
        };
    }
})();