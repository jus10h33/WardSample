(function () {
    'use strict';

    angular
        .module('mainApp')
        .config(function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/sample');
            $stateProvider
                .state('app.sample.find', {
                    url: '/find',
                    templateUrl: '/app/modules/sample/entry/entry.html',
                    controller: 'FindController'
                });
        })
        .controller("FindController", ["$scope", "ScopeService", "$state", "SampleService", "SetSampleService", function ($scope, ScopeService, $state, SampleService, SetSampleService) {
            
            var x = ScopeService.getScope().Sample.SampleTypeNumber;
            console.log("x:  " + x);
            $scope.readonly = false;
            //RemoveValidation();
            ClearForm();
            $scope.disabled = true;
            $scope.action = 'find';
            $scope.rightSide = false; // hide sample info and recommendations
            angular.element('#txtBatchNumber').focus();

            $scope.Commit = function () {
                SampleService.find($scope.Sample.SampleTypeNumber, $scope.Sample.LabNumber, $scope.Sample.BatchNumber).then(function (result) {
                    if (result.data != null) {
                        $scope.SetFormValues(result.data);
                        $scope.SetRecLayout();
                    } else {
                        angular.element("#txtLabNumber").focus();
                    }
                });
            };

            $scope.Cancel = function () {
                console.log("Cancel hit");
                $state.go("app.sample.entry");
            };
            $scope.Change = function () {
                if ($scope.action != 'find') {
                    var stn = parseInt(angular.element('#cboSampleType').val());
                    ClearForm();
                    Load(stn);
                }
            };
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