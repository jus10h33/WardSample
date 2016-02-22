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
                controller: 'PreviousController2'
            });
        })
        .controller("PreviousController1", ["ScopeService", "$state", function (ScopeService, $state) {

            var x = ScopeService.getScope().Sample;
            $state.go("app.sample.previous2", { stn: x.SampleTypeNumber, bn: x.BatchNumber, ln: x.LabNumber });

        }])
        .controller("PreviousController2", 
            ["ScopeService", "$scope", "SampleService", "SetSampleService", "$stateParams", "hotkeys", 
             function(ScopeService, $scope, SampleService, SetSampleService, $stateParams, hotkeys) {

            var x = ScopeService.getScope();
            $scope.SampleTypes = x.SampleTypes;
            $scope.SampleColumns = x.SampleColumns;
            var Samples = x.Samples;
            var Accounts = x.Accounts;
            var Sample = x.Sample;
            var Account = x.Account;
            var Messages = x.Messages;
            var SubSampleInfos = x.SubSampleInfos;
            $scope.readonly = true;

            var stn = $stateParams.stn;
            var bn = $stateParams.bn;
            var ln = $stateParams.ln;
                           
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
                    ScopeService.setCounter(y);
                } else {
                    SampleService.prev(stn, bn, ln).then(function (result) {
                        if (angular.isDefined(result.data) && result.data != null && result.data != "") {
                            y = 0;
                            SetSampleService.setGenericValues(y, result.data.GenericInfo.Samples, result.data.GenericInfo.Accounts, result.data.GenericInfo.Messages);
                            ScopeService.setCounter(y);
                        } else {
                            $scope.disablePrev = true;
                            y = Samples.length - 1;
                        }
                    });
                }
                

                x = ScopeService.getScope();

                $scope.SampleTypes = x.SampleTypes;
                $scope.SampleColumns = x.SampleColumns;
                $scope.Messages = x.Messages;   
                

                $scope.Samples = x.Samples;
                $scope.Accounts = x.Accounts;

                $scope.Sample = x.Sample;                
                $scope.Account = x.Account;
                $scope.Counter = x.Counter;

                $scope.RecTypes = x.RecTypes;
                $scope.CropTypes = x.CropTypes;
                $scope.PastCrops = x.PastCrops;                                             

                $scope.Recommendations = x.Recommendations;
                $scope.RecommendationsList = x.RecommendationsList;
                $scope.SampleChainsList = x.SampleChainsList;
                $scope.SampleChains = x.SampleChains;
                $scope.SampleChain = x.SampleChain;                
                $scope.SampleRecs = x.SampleRecs;
                $scope.TopSoilsList = x.TopSoilsList;
                $scope.TopSoils = x.TopSoils;
                
                $scope.SampleChainLink = x.SampleChainLink;
                $scope.chkLinkToSoil = x.chkLinkToSoil;
                $scope.chkTopSoil = x.chkTopSoil;
                $scope.otherView = x.otherView;
                $scope.plantView = x.plantView;
                $scope.rightSide = x.rightSide;
                $scope.soilView = x.soilView;
                $scope.linkToSoil = x.linkToSoil;
            }
            hotkeys.bindTo($scope)
           .add({
               combo: 'p',
               description: 'Previous',
               callback: function () { $scope.Prev($scope.Sample.LabNumber); }
           })
           .add({
               combo: 'n',
               description: 'Next',
               callback: function () { $scope.Next($scope.Sample.LabNumber); }
           })
        }])        
})();