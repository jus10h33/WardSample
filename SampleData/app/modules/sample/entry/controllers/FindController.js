(function () {
    'use strict';

    angular
        .module('mainApp')
        .config(function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/sample');
            $stateProvider
                .state('app.sample.find1', {
                    url: '/find',
                    templateUrl: '/app/modules/sample/entry/entry.html',
                    controller: 'FindController'
                })
                .state('app.sample.find2', {
                    url: '/find/:stn/:bn/:ln',
                    templateUrl: '/app/modules/sample/entry/entry.html',
                    controller: 'FindController'
                });
        })
        .controller("FindController", ["$scope", "ScopeService", "$state", "$stateParams", "SampleService", "SetSampleService", function ($scope, ScopeService, $state, $stateParams, SampleService, SetSampleService) {
            
            $scope.Commit = function () {
                SampleService.find(stn, bn, ln).then(function (result) {
                    if (result.data != null) {
                        console.log(result.data);
                        SetSampleService.setAllValues(result.data);
                        $scope.selectBtn = true;
                    } else {
                        angular.element("#txtLabNumber").focus();
                    }
                });
            };

            var stn = $stateParams.stn;
            var bn = $stateParams.bn;
            var ln = $stateParams.ln;

            if (angular.isDefined(stn)) {
                $scope.Commit();
            }

            var x = ScopeService.getScope();
            $scope.SampleTypes = x.SampleTypes;
            $scope.SampleColumns = x.SampleColumns;
            $scope.Sample = {};

            ////////if going directly to find there is nothing in scope therefore need to load sampletypes or sampletypenumber
            
            $scope.Sample.SampleTypeNumber = x.Sample.SampleTypeNumber;
            $scope.readonly = false;
            $scope.disabled = true;
            $scope.disabledFind = false;
            $scope.selectBtn = false;
            $scope.action = 'find';
            $scope.rightSide = false; // hide sample info and recommendations
            angular.element('#txtBatchNumber').focus();

            function ClearForm() {
                var stn = x;
                $scope.Sample = {};
                $scope.Sample.SampleTypeNumber = stn;
                $scope.Account = {};
                $scope.SampleChain = {};
                $scope.SampleChains = {};
                $scope.Recommendations = [];
                angular.element("#acoGrower").autocomplete({ source: [] });
            };            
        }])
})();