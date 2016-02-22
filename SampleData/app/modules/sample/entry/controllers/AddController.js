(function () {
    'use strict';

    angular
        .module('mainApp')
        .config(function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/sample');
            $stateProvider
                .state('app.sample.add', {
                    url: '/add',
                    templateUrl: '/app/modules/sample/entry/entry.html',
                    resolve: {
                        PreviousState: [
                            "$state",
                            function ($state) {
                                var currentStateData = {
                                    Name: $state.current.name,
                                    Params: $state.params,
                                    URL: $state.href($state.current.name, $state.params)
                                };
                                return currentStateData;
                            }
                        ]
                    },
                    controller: 'AddController'
                });
        })
        .controller("AddController", ["$scope", "ScopeService", "$state", "SampleService", "SetSampleService", "PreviousState", "hotkeys", 
            function ($scope, ScopeService, $state, SampleService, SetSampleService, PreviousState, hotkeys) {

                if (PreviousState.Name != "app.sample.entry") {
                    $state.go("app.sample.entry");
                }
                var x = ScopeService.getScope();
                //if (x == {}) {
                //    $state.go("app.sample.entry")
                //}
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

                $scope.Commit = function () {
                    SetSampleChainValues();
                    SampleService.add($scope.Sample, $scope.SampleChain, $scope.SampleRecs, $scope.SubSampleInfo).then(function (result) {
                        if (result.data != null) {
                            SetSampleService.setAllValues(result.data);
                            $state.go('app.sample.entry');
                        }
                        //$scope.ResetForm();                   
                    });
                };

                $scope.Cancel = function () {
                    if (angular.equals($scope.Sample, $scope.holdSample)) {
                        $state.go("app.sample.entry");
                    } else {
                        alert("data has changed");
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
                
                function SetSampleChainValues() {
                    $scope.SampleChain.BatchNumber = $scope.Sample.BatchNumber;
                    $scope.SampleChain.LabNumber = $scope.Sample.LabNumber;
                    if (angular.element('input[id=chkTopSoil]:checked')) {
                        $scope.SampleChain.TopSoil = 1;
                        $scope.SampleChain.LinkedSampleBatch = 0;
                        $scope.SampleChain.LinkedSampleLab = 0;
                    } else {
                        $scope.SampleChain.TopSoil = 0;
                        $scope.SampleChain.LinkedSampleBatch = angular.element('#txtLinkSoilBatch').val();
                        $scope.SampleChain.LinkedSampleLab = angular.element('#txtLinkSoillab').val();
                    }
                };

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
                };
                hotkeys.bindTo($scope)
                .add({
                    combo: 'enter',
                    description: 'Commit',
                    callback: function () { $scope.Commit(); }
                })
                .add({
                    combo: 'esc',
                    description: 'Cancel',
                    callback: function () { $scope.Cancel(); }
                });
            }])
})();

//function DisplayPopover(id, message) {
//    id = "#" + id;
//    angular.element(id).attr("data-container", "body");
//    angular.element(id).attr("data-toggle", "popover");
//    angular.element(id).attr("data-placement", "right");
//    angular.element(id).attr("data-content", message);
//    angular.element(id).popover('show');
//    return;
//};
//function RemovePopover(id) {
//    id = "#" + id;
//    angular.element(id).popover('hide');
//    angular.element(id).removeAttr("data-container");
//    angular.element(id).removeAttr("data-toggle");
//    angular.element(id).removeAttr("data-placement");
//    angular.element(id).removeAttr("data-content");
//    angular.element(id).removeAttr("data-original-title");
//    angular.element(id).removeAttr("title");
//    return;
//};