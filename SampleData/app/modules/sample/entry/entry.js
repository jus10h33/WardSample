﻿(function () {
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
                });
        })
        .controller("SampleEntryController",
            ["ScopeService", "$scope", "$state", "$stateParams", "SampleService", "SetSampleService", "AccountService", "ReportService",
             function (ScopeService, $scope, $state, $stateParams, SampleService, SetSampleService, AccountService, ReportService) {
                var stn = 1;            

                Load(1); // Change to load last sampletype in cache

                $scope.Previous = function () {
                    var stn = angular.element('#cboSampleType').val();
                    var bn = angular.element('#txtBatchNumber').val();
                    var ln = angular.element('#txtLabNumber').val();

                    $state.go("app.sample.previous", { stn: stn, bn: bn, ln: ln });
                };
                $scope.Next = function () {
                    console.log("Next hit");
                    var stn = angular.element('#cboSampleType').val();
                    var bn = angular.element('#txtBatchNumber').val();
                    var ln = angular.element('#txtLabNumber').val();

                    $scope.readonly = false;
                    $scope.ClearForm();
                    $scope.readonly = true;

                    $state.go("^.next", { stn: stn, bn: bn, ln: ln });
                };
                $scope.Find = function () {
                    $scope.readonly = false;
                    RemoveValidation();
                    ClearForm();
                    $scope.disabled = true;
                    $scope.action = 'find';
                    $scope.rightSide = false; // hide sample info and recommendations
                    angular.element('#txtBatchNumber').focus();
                };
                $scope.Add = function () {
                    console.log("Add hit");
                    $scope.readonly = false;
                    $scope.disabled = false;
                    $scope.disabledUpdate = false;
                    $scope.action = 'add';
                    var standard = 1;  // use to set cost type to 'Standard' by default
                    $scope.Sample.CostTypeNumber = standard.toString();
                    angular.element('#txtSampleID1').focus();
                    $scope.Sample.LabNumber++;
                    $scope.Sample.SampleID1 = "";
                    $scope.Sample.SampleID2 = "";
                    $scope.Sample.SampleID3 = "";
                    $scope.Sample.SampleID4 = "";
                    $scope.Sample.SampleID5 = "";
                    $scope.chkTopSoil = true;
                    $scope.SampleChain = {};
                    $scope.SampleChains = {};
                    $scope.SampleChain.BeginningDepth = 0;
                    $scope.Recommendations = [];
                    SetHoldValues();
                    RemoveValidation();
                };
                $scope.Update = function () {
                    SetHoldValues();
                    $scope.readonly = false;
                    $scope.disabled = false;
                    $scope.disabledUpdate = true;
                    $scope.action = 'update';
                    angular.element('#txtSampleID1').focus();
                    RemoveValidation();
                };
                $scope.Delete = function () {
                    $scope.readonly = false;
                    console.log('inside Delete');
                    $scope.disabled = true;
                    $scope.action = 'delete';
                    angular.element('#btnCommit').focus();
                    RemoveValidation();
                };
                $scope.Commit = function () {
                    console.log("Commit hit");

                    var stn = angular.element('#cboSampleType').val();
                    var bn = angular.element('#txtBatchNumber').val();
                    var ln = angular.element('#txtLabNumber').val();

                    switch ($scope.action) {
                        case "find":
                            $state.go("", {});
                            break;
                        case "add":
                            $state.go("", {});
                            break;
                        case "update":
                            $state.go("", {});
                            break;
                        case "delete":
                            $state.go("", {});
                            break;
                    }
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
                $scope.FindAccount = function () {
                    if ($scope.entryForm.txtAccountNumber.$valid) {
                        AccountService.find($scope.Sample.AccountNumber, $scope.Sample.SampleTypeNumber).then(function (result) {
                            if (result.data != null) {
                                $scope.Account.Name = result.data.Name;
                                $scope.Account.Company = result.data.Company;
                                $scope.Account.Address1 = result.data.Address1;
                                $scope.Account.CityStZip = result.data.CityStZip;
                                $scope.Account.SampleEntryInformation = result.data.SampleEntryInformation;
                                $scope.Account.Growers = result.data.Growers;
                                angular.element("#acoGrower").autocomplete({ source: $scope.Account.Growers, minLength: 0, delay: 0 }).focus(function () { $(this).autocomplete("search"); });
                                RemovePopover('txtAccountNumber');
                            } else {
                                $scope.Account = {};
                                $scope.Sample.Grower = "";
                                angular.element("#acoGrower").autocomplete({ source: [] });
                                $scope.Account.Name = "Account Not Found";
                                RemovePopover('txtAccountNumber');
                                $scope.DisplayPopover('txtAccountNumber', 'Account does NOT exist');
                                angular.element('#txtAccountNumber').focus();
                            }
                        });
                    } else {
                        $scope.Validate($scope.entryForm.txtAccountNumber, 'txtAccountNumber', 'Must be numeric');
                    }
                };
                $scope.GetReportName = function () {
                    if ($scope.entryForm.txtReportTypeNumber.$valid) {
                        ReportService.reportName($scope.Sample.SampleTypeNumber, $scope.Sample.ReportTypeNumber).then(function (result) {
                            console.log(data);
                            if (data != "") {
                                $scope.entryForm.txtReportTypeNumber.$valid = true;
                                $scope.entryForm.txtReportTypeNumber.$invalid = false;
                                angular.element('#txtReportTypeNumber').removeClass('has-error');
                                RemovePopover('txtReportTypeNumber');
                                $scope.Sample.ReportName = data;
                            } else {
                                $scope.entryForm.txtReportTypeNumber.$valid = false;
                                $scope.entryForm.txtReportTypeNumber.$invalid = true;
                                DisplayPopover('txtReportTypeNumber', 'No Results');
                                angular.element('#txtReportTypeNumber').focus();
                                $scope.Sample.ReportTypeNumber = "";
                                $scope.Sample.ReportName = "";
                            }
                        });
                    } else {
                        $scope.DisplayPopover('txtReportTypeNumber', 'Must be numeric');
                        angular.element('#txtReportTypeNumber').addClass('has-error');
                        angular.element('#txtReportTypeNumber').focus();
                        $scope.Sample.ReportName = "";
                    }
                };

                function Load(stn) {
                    SampleService.load(stn).then(function (result) {
                        if (result.data != null) {
                            var x = SetSampleService.setAllValues(result.data);
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
                            $scope.action = "";
                            $scope.required = true;
                            $scope.readonly = true;
                            $scope.disabled = true;
                            $scope.disabledUpdate = false;
                            $scope.disableNext = true;
                            $scope.disablePrev = false;
                            $scope.chkLinkToSoil = x.chkLinkToSoil;
                            $scope.chkTopSoil = x.chkTopSoil;
                            $scope.otherView = x.otherView;
                            $scope.plantView = x.plantView;
                            $scope.rightSide = x.rightSide;
                            $scope.soilView = x.soilView;
                            $scope.linkToSoil = x.linkToSoil;
                            $scope.SampleTypes = x.SampleTypes;

                            ScopeService.setScope(x);
                        }
                    })
                };
                function DisplayPopover(id, message) {
                    id = "#" + id;
                    angular.element(id).attr("data-container", "body");
                    angular.element(id).attr("data-toggle", "popover");
                    angular.element(id).attr("data-placement", "right");
                    angular.element(id).attr("data-content", message);
                    angular.element(id).popover('show');
                    return;
                };
                function RemovePopover(id) {
                    id = "#" + id;
                    angular.element(id).popover('hide');
                    angular.element(id).removeAttr("data-container");
                    angular.element(id).removeAttr("data-toggle");
                    angular.element(id).removeAttr("data-placement");
                    angular.element(id).removeAttr("data-content");
                    angular.element(id).removeAttr("data-original-title");
                    angular.element(id).removeAttr("title");
                    return;
                };
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
        }]);
})();