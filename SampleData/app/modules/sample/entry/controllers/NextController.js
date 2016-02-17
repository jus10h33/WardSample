(function () {
    'use strict';

    angular
        .module('mainApp')
        .config(function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/sample');
            $stateProvider
                .state('app.sample.next', {
                    url: '/next/:stn/:bn/:ln',
                    controller: 'NextController'
                });
        })
        .controller("NextController", ["$scope", "SampleService", "SetSampleService", "$stateParams", function ($scope, SampleService, SetSampleService, $stateParams) {
            var stn = $stateParams.stn;
            var bn = $stateParams.bn;
            var ln = $stateParams.ln;
            if (!$scope.disableNext) {
                console.log(ln);
                $scope.disablePrev = false;
                var found = false;
                while (!found && y >= 0) {
                    if ($scope.Samples[y].LabNumber == ln) {
                        found = true;
                    }
                    y--;
                }
                if (found && y >= 0) {
                    $scope.SetGenericValues($scope.Samples[y], $scope.Accounts[y], $scope.Messages);
                    var stn = $scope.Samples[y].SampleTypeNumber;
                    if (stn == 1 || stn == 14) {
                        $scope.SetTopSoils(y);
                        $scope.SetSampleChains(y);
                        $scope.SetRecommendations(y);
                    } else if (stn == 2 || stn == 3 || stn == 4 || stn == 5 || stn == 6 || stn == 7 || stn == 9 || stn == 12) {
                        $scope.SetSubValues($scope.SubSampleInfos[y], $scope.SubSampleInfos);
                    }
                } else {
                    SampleService.next($scope.Sample.SampleTypeNumber, $scope.Sample.BatchNumber, $scope.Sample.LabNumber).then(function (result) {
                        if (angular.isDefined(result.data) && result.data != null && result.data != "") {
                            y = result.data.GenericInfo.Samples.length - 1;
                            $scope.SetGenericMasters(result.data.GenericInfo.Samples, result.data.GenericInfo.Accounts, $scope.SampleTypes, $scope.SampleColumns);
                            $scope.SetGenericValues(result.data.GenericInfo.Samples[y], result.data.GenericInfo.Accounts[y], result.data.GenericInfo.Messages);
                            var stn = $scope.Samples[y].SampleTypeNumber;
                            if (stn == 1 || stn == 14) {
                                $scope.TopSoilsList = result.data.TopSoils;
                                $scope.SampleChainsList = result.data.SampleChains;
                                $scope.RecommendationsList = result.data.Recommendations;
                                $scope.SetTopSoils(y);
                                $scope.SetSampleChains(y);
                                $scope.SetRecommendations(y);
                            } else if (stn == 2 || stn == 3 || stn == 4 || stn == 5 || stn == 6 || stn == 7 || stn == 9 || stn == 12) {
                                $scope.SetSubValues(result.data.SubSampleInfos[y], result.data.SubSampleInfos);
                            }
                        } else {
                            $scope.disableNext = true;
                            y = 0;
                        }
                    });
                }
            }
        }])
})();