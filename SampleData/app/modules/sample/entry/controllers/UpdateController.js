(function () {
    'use strict';

    angular
        .module('mainApp')
        .config(function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/sample');
            $stateProvider
                .state('app.sample.update', {
                    url: '/update',
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
                    controller: 'UpdateController'
                });
        })
        .controller("UpdateController", ["$scope", "ScopeService", "$state", "SampleService", "ReportService", "AccountService", "SetSampleService", "PreviousState", "hotkeys",
            function ($scope, ScopeService, $state, SampleService, ReportService, AccountService, SetSampleService, PreviousState, hotkeys) {

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
            SetSampleChainValues();

            SetHoldValues();
            $scope.readonly = false;
            $scope.disabled = false;
            $scope.disabledUpdate = true;
            $scope.action = 'update';
            angular.element('#txtSampleID1').focus();            

            function SetSampleChainValues() {
                $scope.SampleChain.BatchNumber = $scope.Sample.BatchNumber;
                $scope.SampleChain.LabNumber = $scope.Sample.LabNumber;
                if (x.SampleChain.TopSoil == 1) {
                    $scope.SampleChain.TopSoil = 1;
                    $scope.SampleChain.LinkedSampleBatch = 0;
                    $scope.SampleChain.LinkedSampleLab = 0;
                } else {
                    $scope.SampleChain.TopSoil = 0;
                    $scope.SampleChain.LinkedSampleBatch = x.SampleChain.LinkedSampleBatch;
                    $scope.SampleChain.LinkedSampleLab = x.SampleChain.LinkedSampleLab;
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
                        //angular.copy($scope.Recommendations, $scope.holdRecommendations);
                    }
                } else if (stn == 2 || stn == 3 || stn == 4 || stn == 5 || stn == 6 || stn == 7 || stn == 9 || stn == 12) {
                    $scope.holdSubSampleInfo = {};
                    angular.copy($scope.SubSampleInfo, $scope.holdSubSampleInfo);
                }
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
            function ValidateForm() {
                // Validate sample entry
                if ($scope.entryForm.$invalid) {
                    if ($scope.entryForm.cboCostTypeNumber.$invalid) {
                        $scope.DisplayPopover("cboSampleTypeNumber", "Required field");
                        angular.element('#cboSampleTypeNumber').addClass('has-error');
                    }
                    if ($scope.entryForm.txtAccountNumber.$invalid) {
                        $scope.DisplayPopover("txtAccountNumber", "Must be numeric");
                        angular.element('#txtAccountNumber').addClass('has-error');
                    }
                    if ($scope.entryForm.txtBatchNumber.$invalid) {
                        $scope.DisplayPopover("txtBatchNumber", "Must be correct format [yyyymmdd]");
                        angular.element('#txtBatchNumber').addClass('has-error');
                    }
                    if ($scope.entryForm.txtLabNumber.$invalid) {
                        $scope.DisplayPopover("txtLabNumber", "Must be numeric");
                        angular.element('#txtLabNumber').addClass('has-error');
                    }
                    if ($scope.entryForm.txtReportTypeNumber.$invalid) {
                        $scope.DisplayPopover("txtReportTypeNumber", "Must be numeric");
                        angular.element('#txtReportTypeNumber').addClass('has-error');
                    }
                    if ($scope.entryForm.acoGrower.$invalid) {
                        $scope.DisplayPopover("acoGrower", "Required field");
                        angular.element('#acoGrower').addClass('has-error');
                    }
                    if ($scope.entryForm.txtSampleID1.$invalid) {
                        $scope.DisplayPopover("txtSampleID1", "Required field");
                        angular.element('#txtSampleID1').addClass('has-error');
                    }
                    if ($scope.entryForm.txtSampleID2.$invalid) {
                        $scope.DisplayPopover("txtSampleID2", "Required field");
                        angular.element('#txtSampleID2').addClass('has-error');
                    }
                    if ($scope.entryForm.dpkDateReceived.$invalid) {
                        $scope.DisplayPopover("dpkDateReceived", "Required field [yyyy-mm-dd]");
                        angular.element('#dpkDateReceived').addClass('has-error');
                    }
                    if ($scope.entryForm.dpkDateReported.$invalid) {
                        $scope.DisplayPopover("dpkDateReported", "Required field [yyyy-mm-dd]");
                        angular.element('#dpkDateReported').addClass('has-error');
                    }
                    if ($scope.Sample.DateReceived > $scope.Sample.DateReported) {
                        $scope.entryForm.dpkDateReported.$invalid = true;
                        $scope.DisplayPopover("dpkDateReported", "Must be greater than Date Received");
                        angular.element('#dpkDateReported').addClass('has-error');
                    }
                    if ($scope.entryForm.cboCostTypeNumber.$invalid) {
                        $scope.DisplayPopover("cboCostTypeNumber", "Required field");
                        angular.element('#cboCostTypeNumber').addClass('has-error');
                    }
                    valid = false;
                } else {
                    valid = true;
                }
                // Validate Sample Info
                $scope.frmSampleInfo = [];
                if ($scope.frmSampleInfo.$invalid) {
                    if ($scope.entryForm.txtBeginningDepth.$invalid) {
                        $scope.DisplayPopover("txtBeginDepth", "Must be numeric");
                        angular.element('#txtBeginDepth').addClass('has-error');
                    }
                    if ($scope.entryForm.txtEndingDepth.$invalid) {
                        $scope.DisplayPopover("txtEndDepth", "Must be greater than Beginning Depth");
                        angular.element('#txtEndDepth').addClass('has-error');
                    }
                    if ($scope.entryForm.cboPastCropNumber.$invalid) {
                        $scope.DisplayPopover("cboPastCropNumber", "Required field");
                        angular.element('#cboPastCropNumber').addClass('has-error');
                    }
                    valid = false;
                } else {
                    valid = true;
                }

                // Validate frmSampleLinks
                if ($scope.IsPresent($scope.SampleChain.LinkedSampleLab) && $scope.SampleChain.LinkedSampleBatch != $scope.Sample.BatchNumber) {
                    $scope.DisplayPopover("txtLinkSoilBatch", "Must match BatchNumber");
                    angular.element('#txtLinkSoilBatch').addClass('has-error');
                    valid = false;
                }
                if ($scope.IsPresent($scope.SampleChain.LinkedSampleBatch) && isNaN($scope.SampleChain.LinkedSampleLab) && $scope.SampleChain.LinkedSampleLab != "") {
                    $scope.DisplayPopover("txtLinkSoilLab", "Must be numeric");
                    angular.element('#txtLinkSoilLab').addClass('has-error');
                    valid = false;
                }

                // Validate Sample Recs
                $scope.frmSampleRecs = [];
                if ($scope.frmSampleRecs.$invalid) {
                    for (var i = 0; i < $scope.SampleRecs.length; i++) {
                        var recID = '#acoRecTypes' + i;
                        var cropID = '#acoCropTypes' + i;
                        var yieldID = '#txtYieldGoal' + i;

                        if (angular.element(recID).val() != "") {
                            angular.element(recID).addClass('has-error');
                            recID = 'acoRecTypes' + i;
                            $scope.DisplayPopover(recID, "Required field");
                        }
                        if (angular.element(cropID).val() != "") {
                            angular.element(cropID).addClass('has-error');
                            cropID = 'acoCropTypes' + i;
                            $scope.DisplayPopover(cropID, "Required field");
                        }
                        if (!isNaN(angular.element(yieldID).val())) {
                            angular.element(yieldID).addClass('has-error');
                            yieldID = 'txtYieldGoal' + i;
                            $scope.DisplayPopover(yieldID, "Must be numeric");
                        }
                    }
                    valid = false;
                } else {
                    valid = true;
                }
                if (valid) {
                    $scope.RemoveValidation();
                } else {
                    angular.element("form[id='frmSampleRecs']").find('.ng-invalid:first').focus();
                    angular.element("form[id='frmSampleInfo']").find('.ng-invalid:first').focus();
                    angular.element("form[id='entryForm']").find('.ng-invalid:first').focus();
                }
                return valid;
            };

            $scope.FindAccount = function () {
                if ($scope.entryForm.txtAccountNumber.$valid) {
                    AccountService.find($scope.Sample.AccountNumber, $scope.Sample.SampleTypeNumber).then(function (result) {
                        if (result.data != null) {
                            console.log(result.data);
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
                            DisplayPopover('txtAccountNumber', 'Account does NOT exist');
                            angular.element('#txtAccountNumber').focus();
                        }
                    });
                } else {
                    DisplayPopover('txtAccountNumber', 'Must be numeric');
                }
            };
            $scope.GetReportName = function () {
                if ($scope.entryForm.txtReportTypeNumber.$valid) {
                    ReportService.reportName($scope.Sample.SampleTypeNumber, $scope.Sample.ReportTypeNumber).then(function (result) {
                        console.log(result.data);
                        if (result.data != "") {
                            $scope.entryForm.txtReportTypeNumber.$valid = true;
                            $scope.entryForm.txtReportTypeNumber.$invalid = false;
                            angular.element('#txtReportTypeNumber').removeClass('has-error');
                            RemovePopover('txtReportTypeNumber');
                            $scope.Sample.ReportName = result.data;
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
                    DisplayPopover('txtReportTypeNumber', 'Must be numeric');
                    angular.element('#txtReportTypeNumber').addClass('has-error');
                    angular.element('#txtReportTypeNumber').focus();
                    $scope.Sample.ReportName = "";
                }
            };
            $scope.Commit = function () {
                if (ValidateForm()) {
                    SampleService.update($scope.Sample, $scope.SampleChain, $scope.SampleRecs, $scope.SubSampleInfo).then(function (result) {
                        console.log(result.data);
                        if (result.data != null) {
                            SetSampleService.setAllValues(result.data);
                            $state.go("app.sample.entry");
                        }
                    });
                }
            };
            $scope.Cancel = function () {
                console.log($scope.Sample);
                console.log($scope.holdSample);
                if (angular.equals($scope.Sample, $scope.holdSample)) {
                    $state.go("app.sample.entry");
                } else {
                    alert("data has changed");
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