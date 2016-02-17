(function () {
    'use strict';

    angular
        .module('mainApp')
        .config(function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/sample');
            $stateProvider
                .state('app.sample.previous', {
                    url: '/previous/:stn/:bn/:ln',
                    controller: 'PreviousController'
                });
        })
        .controller("PreviousController", 
            ["ScopeService", "$scope", "SampleService", "SetSampleService", "$stateParams", 
             function(ScopeService, $scope, SampleService, SetSampleService, $stateParams) {

            var stn = $stateParams.stn;
            var bn = $stateParams.bn;
            var ln = $stateParams.ln;
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

            if (!$scope.disablePrev) {
                console.log(ln);
                $scope.disableNext = false;
                var found = false;
                var y = 0;
                while (!found && y >= 0 && y < $scope.Samples.length) {
                    if ($scope.Samples[y].LabNumber == ln) {
                        found = true;
                    }
                    y++;
                }
                if (found && y < $scope.Samples.length) {
                    $scope.SetGenericValues($scope.Samples[y], $scope.Accounts[y], $scope.Messages);
                    stn = $scope.Samples[y].SampleTypeNumber;
                    if (stn == 1 || stn == 14) {
                        $scope.SetTopSoils(y);
                        $scope.SetSampleChains(y);
                        $scope.SetRecommendations(y);
                    } else if (stn == 2 || stn == 3 || stn == 4 || stn == 5 || stn == 6 || stn == 7 || stn == 9 || stn == 12) {
                        $scope.SetSubValues($scope.SubSampleInfos[y], $scope.SubSampleInfos);
                    }
                } else {
                    SampleService.prev(stn, bn, ln).then(function (result) {
                        if (angular.isDefined(result.data) && result.data != null && result.data != "") {
                            y = 0
                            $scope.SetGenericMasters(result.data.GenericInfo.Samples, result.data.GenericInfo.Accounts, $scope.SampleTypes, $scope.SampleColumns);
                            $scope.SetGenericValues(result.data.GenericInfo.Samples[y], result.data.GenericInfo.Accounts[y], result.data.GenericInfo.Messages);
                            var stn = $scope.Samples[y].SampleTypeNumber;
                            if (stn == 1 || stn == 14) {
                                $scope.TopSoilsList = result.data.TopSoils;
                                $scope.SampleChainsList = result.data.SampleChains;
                                $scope.RecommendationsList = result.data.Recommendations;
                                $scope.SetRecommendations(y);
                                $scope.SetTopSoils(y);
                                $scope.SetSampleChains(y);
                            } else if (stn == 2 || stn == 3 || stn == 4 || stn == 5 || stn == 6 || stn == 7 || stn == 9 || stn == 12) {
                                $scope.SetSubValues(result.data.SubSampleInfos[y], result.data.SubSampleInfos);
                            }
                        } else {
                            $scope.disablePrev = true;
                            y = $scope.Samples.length - 1;
                        }
                    });
                }
            }
        }])    
})();