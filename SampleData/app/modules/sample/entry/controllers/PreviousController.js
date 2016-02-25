(function () {
    'use strict';

    angular
        .module('mainApp')
        .config(function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/sample');
            $stateProvider
                .state('app.sample.previous1', {
                    url: '/previous',
                    templateUrl: '/app/modules/sample/entry/entry.html',
                    controller: 'PreviousController1'
                })
            .state('app.sample.previous2', {
                url: '/previous/:stn/:bn/:ln',
                templateUrl: '/app/modules/sample/entry/entry.html',
                controller: 'SetScopeController'
            });
        })
        .controller("PreviousController1", ["ScopeService", "$scope", "SampleService", "SetSampleService", "$state", "hotkeys",
            function (ScopeService, $scope, SampleService, SetSampleService, $state, hotkeys) {

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

            if (!$scope.disablePrev) {
                $scope.disableNext = false;
                var found = false;
                var y = 0;
                if (angular.isDefined(x.Counter)) {
                    y = x.Counter;
                } else {
                    y = 0;
                }
                while (!found && y >= 0 && y < Samples.length) {
                    if (Samples[y].LabNumber == ln) {
                        found = true;
                    }
                    y++;
                }
                if (found && y < Samples.length) {
                    SetSampleService.setGenericValues(y, Samples, Accounts, Messages);
                    if (stn == 1 || stn == 14) {
                        SetSampleService.setSoilValues(y)
                    } else if (stn == 2 || stn == 3 || stn == 4 || stn == 5 || stn == 6 || stn == 7 || stn == 9 || stn == 12) {
                        SetSampleService.SetSubValues(SubSampleInfos[y], SubSampleInfos);
                    }
                    bn = Samples[y].BatchNumber;
                    ln = Samples[y].LabNumber;

                    ScopeService.setCounter(y);
                } else {
                    SampleService.prev(stn, bn, ln).then(function (result) {
                        if (angular.isDefined(result.data) && result.data != null && result.data != "") {
                            y = 0;
                            SetSampleService.setGenericValues(y, result.data.GenericInfo.Samples, result.data.GenericInfo.Accounts, result.data.GenericInfo.Messages);
                            bn = result.data.GenericInfo.Samples[y].BatchNumber;
                            ln = result.data.GenericInfo.Samples[y].LabNumber;
                            ScopeService.setCounter(y);
                        } else {
                            $scope.disablePrev = true;
                            y = Samples.length - 1;
                        }
                    });
                }
                $state.go("app.sample.previous2", { stn: stn, bn: bn, ln: ln });
            }
        }])     
})();