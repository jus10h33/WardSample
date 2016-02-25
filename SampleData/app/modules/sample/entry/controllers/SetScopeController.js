(function () {
    'use strict';

    angular
        .module('mainApp')
        .controller("SetScopeController",
            ["$state", "ScopeService", "$scope", "hotkeys",
             function ($state, ScopeService, $scope, hotkeys) {

                 var x = ScopeService.getScope();

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
                 $scope.readonly = x.readonly;

                 hotkeys.bindTo($scope)
                    .add({
                        combo: 'p',
                        description: 'Previous',
                        callback: function () { $state.go("app.sample.previous1"); }
                    })
                    .add({
                        combo: 'n',
                        description: 'Next',
                        callback: function () { $state.go("app.sample.next1"); }
                    })
             }])
})();