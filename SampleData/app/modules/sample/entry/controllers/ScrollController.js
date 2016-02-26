(function () {
    'use strict';

    angular
        .module('mainApp')
        .controller("ScrollController", ["ScopeService", "$scope", "SampleService", "SetSampleService", "$state", "hotkeys",
            function (ScopeService, $scope, SampleService, SetSampleService, $state, hotkeys) {
                SetVars();
                if (true) {
                    if (!$scope.disablePrev) {
                        $scope.disableNext = false;
                        var found = false;
                        var index = 0;
                        if (angular.isDefined($scope.Counter)) {
                            index = $scope.Counter;
                        }
                        while (!found && index < $scope.Samples.length) {
                            if ($scope.Samples[index].LabNumber == $scope.Sample.LabNumber) {
                                found = true;
                            }
                            index++;
                        }
                        $scope.Counter = index;
                        if (found && $scope.Counter < $scope.Samples.length) {
                            SetForm();                        
                        } else {
                            SampleService.prev($scope.Sample.SampleTypeNumber, $scope.Sample.BatchNumber, $scope.Sample.LabNumber).then(function (result) {
                                if (angular.isDefined(result.data) && result.data != null && result.data != "") {
                                    $scope.Counter = 0;
                                    reset(result.data);
                                
                                } else {
                                    $scope.disablePrev = true;
                                    $scope.Counter = $scope.Samples.length - 1;
                                }
                            });
                        }
                        $state.go("app.sample.previous2", { stn: $scope.Sample.SampleTypeNumber, bn: $scope.Sample.BatchNumber, ln: $scope.Sample.LabNumber });
                    }
                } else {
                    if (!$scope.disableNext) {
                        $scope.disablePrev = false;
                        var found = false;
                        var index = 0;
                        if (angular.isDefined($scope.Counter)) {
                            index = $scope.Counter;
                        }
                        while (!found && index >= 0) {
                            if ($scope.Samples[index].LabNumber == $scope.Sample.LabNumber) {
                                found = true;
                            }
                            index--;
                        }
                        $scope.Counter = index;
                        if (found && $scope.Counter >= 0) {

                        } else {
                            SampleService.next($scope.Sample.SampleTypeNumber, $scope.Sample.BatchNumber, $scope.Sample.LabNumber).then(function (result) {
                                if (angular.isDefined(result.data) && result.data != null && result.data != "") {
                                    $scope.Counter = result.data.GenericInfo.Samples.length - 1;
                                    reset(result.data);
                                } else {
                                    $scope.disableNext = true;
                                    $scope.Counter = 0;
                                }
                            });
                        }
                    }
                    $state.go("app.sample.next2", { stn: $scope.Sample.SampleTypeNumber, bn: $scope.Sample.BatchNumber, ln: $scope.Sample.LabNumber });
                }
                function SetVars() {
                    var data = ScopeService.getScope();
                    $scope.SampleTypes = data.SampleTypes;
                    $scope.SampleColumns = data.SampleColumns;
                    $scope.Samples = data.Samples;
                    $scope.Accounts = data.Accounts;
                    $scope.Sample = data.Sample;
                    $scope.Account = data.Account;
                    $scope.Messages = data.Messages;
                    $scope.SubSampleInfos = data.SubSampleInfos;
                }
                function SetForm() {
                    SetSampleService.setGenericValues($scope.Counter, $scope.Samples, $scope.Accounts, $scope.Messages);
                    var stn = $scope.Sample.SampleTypeNumber;
                    if (stn == 1 || stn == 14) {
                        SetSampleService.setSoilValues($scope.Counter)
                    } else if (stn == 2 || stn == 3 || stn == 4 || stn == 5 || stn == 6 || stn == 7 || stn == 9 || stn == 12) {
                        SetSampleService.SetSubValues(SubSampleInfos[$scope.Counter], SubSampleInfos);
                    }
                    $scope.Sample.BatchNumber = $scope.Samples[$scope.Counter].BatchNumber;
                    $scope.Sample.LabNumber = $scope.Samples[$scope.Counter].LabNumber;

                    ScopeService.setCounter($scope.Counter);
                }
                function Reset(data) {
                    SetSampleService.setGenericValues($scope.Counter, data.GenericInfo.Samples, data.GenericInfo.Accounts, data.GenericInfo.Messages);
                    $scope.Sample.BatchNumber = result.data.GenericInfo.Samples[$scope.Counter].BatchNumber;
                    $scope.Sample.LabNumber = result.data.GenericInfo.Samples[$scope.Counter].LabNumber;
                    ScopeService.setCounter($scope.Counter);
                }
            }])
})();