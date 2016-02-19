(function () {
    'use strict';

    angular
        .module('mainApp')
        .config(function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/sample');
            $stateProvider
                .state('app.sample.next', {
                    url: '/next',
                    templateUrl: '/app/modules/sample/entry/entry.html',
                    controller: 'NextController'
                });
        })
        .controller("NextController", ["$scope", "ScopeService", "SampleService", "SetSampleService", "$stateParams", function ($scope, ScopeService, SampleService, SetSampleService, $stateParams) {
            var x = ScopeService.getScope();
            console.log(x);
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
            $scope.readonly = true;

            var stn = x.Sample.SampleTypeNumber;
            var bn = x.Sample.BatchNumber;
            var ln = x.Sample.LabNumber;
            var y = 29;
            if (!$scope.disableNext) {
                $scope.disablePrev = false;
                var found = false;
                while (!found && y >= 0) {
                    if ($scope.Samples[y].LabNumber == ln) {
                        found = true;
                    }
                    y--;
                }
                if (found && y >= 0) {
                    SetSampleService.setGenericValues($scope.Samples[y], $scope.Accounts[y], $scope.Messages);
                    //var stn = $scope.Samples[y].SampleTypeNumber;
                    if (stn == 1 || stn == 14) {
                        SetSampleService.setSoilValues(y)
                    } else if (stn == 2 || stn == 3 || stn == 4 || stn == 5 || stn == 6 || stn == 7 || stn == 9 || stn == 12) {
                        SetSampleService.setSubValues($scope.SubSampleInfos[y], $scope.SubSampleInfos);
                    }
                } else {
                    SampleService.next($scope.Sample.SampleTypeNumber, $scope.Sample.BatchNumber, $scope.Sample.LabNumber).then(function (result) {
                        if (angular.isDefined(result.data) && result.data != null && result.data != "") {
                            y = result.data.GenericInfo.Samples.length - 1;
                            SetSampleService.setAllValues(result.data);
                        } else {
                            $scope.disableNext = true;
                            y = 0;
                        }
                    });
                }
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