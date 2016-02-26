(function () {
    'use strict';

    angular
        .module('mainApp')
        .controller("NextController1", ["ScopeService", "$scope", "SampleService", "SetSampleService", "$state", "hotkeys",
            function (ScopeService, $scope, SampleService, SetSampleService, $state, hotkeys) {
                var x = ScopeService.getScope().Sample;
            
                var x = ScopeService.getScope();
                $scope.SampleTypes = x.SampleTypes;
                $scope.SampleColumns = x.SampleColumns;
                var Samples = x.Samples;
                var Accounts = x.Accounts;
                var Sample = x.Sample;
                var Account = x.Account;
                var Messages = x.Messages;
                var SubSampleInfos = x.SubSampleInfos;            

                var stn = Sample.SampleTypeNumber;
                var bn = Sample.BatchNumber;
                var ln = Sample.LabNumber;

                if (!$scope.disableNext) {
                    $scope.disablePrev = false;
                    var found = false;
                    var y = 0;
                    if (angular.isDefined(x.Counter)) {
                        y = x.Counter;
                    } else {
                        y = 0;
                    }
                    while (!found && y >= 0) {
                        if (Samples[y].LabNumber == ln) {
                            found = true;
                        }
                        y--;
                    }
                    if (found && y >= 0) {
                        SetSampleService.setGenericValues(y, Samples, Accounts, Messages);
                        if (stn == 1 || stn == 14) {
                            SetSampleService.setSoilValues(y)
                        } else if (stn == 2 || stn == 3 || stn == 4 || stn == 5 || stn == 6 || stn == 7 || stn == 9 || stn == 12) {
                            SetSampleService.setSubValues(SubSampleInfos[y], SubSampleInfos);
                        }
                        bn = Samples[y].BatchNumber;
                        ln = Samples[y].LabNumber;
                        ScopeService.setCounter(y);
                    } else {
                        SampleService.next(stn, bn, ln).then(function (result) {
                            if (angular.isDefined(result.data) && result.data != null && result.data != "") {
                                y = result.data.GenericInfo.Samples.length - 1;
                                SetSampleService.setGenericValues(y, result.data.GenericInfo.Samples, result.data.GenericInfo.Accounts, result.data.GenericInfo.Messages);
                                bn = result.data.GenericInfo.Samples[y].BatchNumber;
                                ln = result.data.GenericInfo.Samples[y].LabNumber;
                                ScopeService.setCounter(y);
                            } else {
                                $scope.disableNext = true;
                                y = 0;
                            }
                        });
                    }
                }
                $state.go("app.sample.next2", { stn: stn, bn: bn, ln: ln });
            }])       
})();