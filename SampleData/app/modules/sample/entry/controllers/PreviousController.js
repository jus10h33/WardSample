(function () {
    'use strict';

    angular
        .module('mainApp')
        .config(function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/sample');
            $stateProvider
                .state('app.sample.previous', {
                    url: '/previous',
                    templateUrl: '/app/modules/sample/entry/entry.html',
                    controller: 'PreviousController'
                });
        })
        .controller("PreviousController", 
            ["ScopeService", "$scope", "SampleService", "SetSampleService", "$stateParams", 
             function(ScopeService, $scope, SampleService, SetSampleService, $stateParams) {

            var x = ScopeService.getScope();
            console.log(x);
            var Samples = x.Samples;
            var Accounts = x.Accounts;
            var Sample = x.Sample;
            var Account = x.Account;
            var Messages = x.Messages;
            var SubSampleInfos = x.SubSampleInfos;
            $scope.readonly = true;

            var stn = x.Sample.SampleTypeNumber;
            var bn = x.Sample.BatchNumber;
            var ln = x.Sample.LabNumber;
                           
            if (!$scope.disablePrev) {
                $scope.disableNext = false;
                var found = false;
                var y = $scope.counter;
                while (!found && y >= 0 && y < Samples.length) {
                    if (Samples[y].LabNumber == ln) {
                        found = true;
                    }
                    y++;
                }
                if (found && y < Samples.length) {
                    SetSampleService.setGenericValues(Samples[y], Accounts[y], Messages);
                    if (stn == 1 || stn == 14) {
                        SetSampleService.setSoilValues(y)
                    } else if (stn == 2 || stn == 3 || stn == 4 || stn == 5 || stn == 6 || stn == 7 || stn == 9 || stn == 12) {
                        SetSampleService.SetSubValues(SubSampleInfos[y], SubSampleInfos);
                    }
                } else {
                    SampleService.prev(stn, bn, ln).then(function (result) {
                        if (angular.isDefined(result.data) && result.data != null && result.data != "") {
                            y = 0
                            SetSampleService.setAllValues(result.data);
                        } else {
                            $scope.disablePrev = true;
                            y = Samples.length - 1;
                        }
                    });
                }
                $scope.counter = y;
                x = ScopeService.getScope();
                $scope.Samples = x.Samples;
                $scope.Sample = x.Sample;
                $scope.Accounts = x.Accounts;
                $scope.Account = x.Account;
                $scope.CropTypes = x.CropTypes;
                $scope.Messages = x.Messages;
                $scope.PastCrops = x.PastCrops;
                $scope.RecTypes = x.RecTypes;
                $scope.Recommendations = x.Recommendations;
                $scope.RecommendationsList = x.RecommendationsList;
                $scope.SampleChainsList = x.SampleChainsList;
                $scope.SampleChains = x.SampleChains;
                $scope.SampleChain = x.SampleChain;
                $scope.SampleColumns = x.SampleColumns;
                $scope.SampleRecs = x.SampleRecs;
                $scope.TopSoilsList = x.TopSoilsList;
                $scope.TopSoils = x.TopSoils;
                $scope.SampleTypes = x.SampleTypes;
            }
        }])    
})();