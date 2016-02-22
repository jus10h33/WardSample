(function () {
    'use strict';

    angular
        .module('mainApp')
        .config(function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/sample');
            $stateProvider
                .state('app.sample.entry', {
                    url: '/entry',
                    views: {
                        '@app.sample': {
                            templateUrl: '/app/modules/sample/entry/entry.html',
                            controller: 'SampleEntryController'
                        }
                    }
                })
                .state('app.sample.entry1', {
                    url: '/entry/:stn/:bn/:ln',
                    templateUrl: '/app/modules/sample/entry/entry.html',
                    controller: 'SampleEntryController'
                })
        })
        .controller("SampleEntryController",
            ["ScopeService", "$scope", "$state", "$stateParams", "SampleService", "SetSampleService", "AccountService", "ReportService", "hotkeys",
                function (ScopeService, $scope, $state, $stateParams, SampleService, SetSampleService, AccountService, ReportService, hotkeys) {

                var stn = 1;
                var x = ScopeService.getScope();
                    //if scope already exists then use it, otherwise, load data from server
                if (angular.isDefined(x.Sample)) {
                    SetScopeValues(x);
                } else {
                    Load(1);
                }

                function Load(stn) {
                    SampleService.load(stn).then(function (result) {
                        if (result.data != null) {
                            var x = SetSampleService.setAllValues(result.data);                          
                            SetScopeValues(x);
                            ScopeService.setScope(x);
                        }
                    })                
                };
                function SetScopeValues(x) {
                    $scope.action = "";
                    $scope.required = true;
                    $scope.readonly = true;
                    $scope.disabled = true;
                    $scope.disabledUpdate = false;
                    $scope.disableNext = true;
                    $scope.disablePrev = false;
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
                    $scope.SampleChainLink = x.SampleChainLink;
                    $scope.chkLinkToSoil = x.chkLinkToSoil;
                    $scope.chkTopSoil = x.chkTopSoil;
                    $scope.otherView = x.otherView;
                    $scope.plantView = x.plantView;
                    $scope.rightSide = x.rightSide;
                    $scope.soilView = x.soilView;
                    $scope.linkToSoil = x.linkToSoil;
                    $scope.SampleTypes = x.SampleTypes;
                }
                function RemoveValidation() {
                    RemovePopover('cboSampleType');
                    angular.element('#cboSampleType').removeClass('has-error');
                    RemovePopover('txtAccountNumber');
                    angular.element('#txtAccountNumber').removeClass('has-error');
                    RemovePopover('txtBatchNumber');
                    angular.element('#txtBatchNumber').removeClass('has-error');
                    RemovePopover('txtLabNumber');
                    angular.element('#txtLabNumber').removeClass('has-error');
                    RemovePopover('txtReportTypeNumber');
                    angular.element('#txtReportTypeNumber').removeClass('has-error');
                    RemovePopover('acoGrower');
                    angular.element('#acoGrower').removeClass('has-error');
                    RemovePopover('txtLocation');
                    angular.element('#txtLocation').removeClass('has-error');
                    RemovePopover('txtSampleID1');
                    angular.element('#txtSampleID1').removeClass('has-error');
                    RemovePopover('dpkDateReceived');
                    angular.element('#dpkDateReceived').removeClass('has-error');
                    RemovePopover('dpkDateReported');
                    angular.element('#dpkDateReported').removeClass('has-error');
                    RemovePopover('cboCostTypeNumber');
                    angular.element('#cboCostTypeNumber').removeClass('has-error');
                    RemovePopover("txtLinkSoilBatch");
                    angular.element('#txtLinkSoilBatch').removeClass('has-error');
                    RemovePopover("txtLinkSoilLab");
                    angular.element('#txtLinkSoilLab').removeClass('has-error');
                    for (var i = 0; i < $scope.SampleRecs.length; i++) {
                        var recID = '#acoRecTypes' + i;
                        var cropID = '#acoCropTypes' + i;
                        var yieldID = '#txtYieldGoal' + i;
                        angular.element(recID).removeClass('has-error');
                        recID = 'acoRecTypes' + i;
                        RemovePopover(recID);
                        angular.element(cropID).removeClass('has-error');
                        cropID = 'acoCropTypes' + i;
                        RemovePopover(cropID);
                        angular.element(yieldID).removeClass('has-error');
                        yieldID = 'txtYieldGoal' + i;
                        RemovePopover(yieldID);
                    }
                }
                function ClearForm() {
                    var stn = $scope.Sample.SampleTypeNumber;
                    $scope.Sample = {};
                    $scope.Sample.SampleTypeNumber = stn;
                    $scope.Account = {};
                    $scope.SampleChain = {};
                    $scope.SampleChains = {};
                    $scope.Recommendations = [];
                    angular.element("#acoGrower").autocomplete({ source: [] });
                }
                function SetHoldValues() {
                    $scope.holdSample = {};
                    angular.copy($scope.Sample, $scope.holdSample);
                    var stn = $scope.Sample.SampleTypeNumber;
                    if (stn == 1 || stn == 14) {
                        $scope.holdSampleChain = {};
                        angular.copy($scope.SampleChain, $scope.holdSampleChain);
                        if (angular.isDefined($scope.Recommendations) && $scope.Recommendations.length > 0) {
                            $scope.holdRecommendations = {};
                            angular.copy($scope.Recommendations, $scope.holdRecommendations);
                        }
                    } else if (stn == 2 || stn == 3 || stn == 4 || stn == 5 || stn == 6 || stn == 7 || stn == 9 || stn == 12) {
                        $scope.holdSubSampleInfo = {};
                        angular.copy($scope.SubSampleInfo, $scope.holdSubSampleInfo);
                    }
                }

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
                .add({
                    combo: 'f',
                    description: 'Find',
                    callback: function () { $state.go("app.sample.find1"); }
                })
                .add({
                    combo: 'a',
                    description: 'Add',
                    callback: function () { $state.go("app.sample.add"); }
                })
                .add({
                    combo: 'u',
                    description: 'Update',
                    callback: function () { $state.go("app.sample.update"); }
                })
                .add({
                    combo: 'd',
                    description: 'Delete',
                    callback: function () { $state.go("app.sample.delete"); }
                })
        }]);
})();