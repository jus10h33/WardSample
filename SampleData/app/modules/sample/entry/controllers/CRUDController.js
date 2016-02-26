(function () {
    'use strict';

    angular
        .module('mainApp')
        .controller("CRUDController", ["$scope", "ScopeService", "$state", "$stateParams", "PreviousState", "SampleService", "ReportService", "AccountService", "SetSampleService", "hotkeys",
            function ($scope, ScopeService, $state, $stateParams, PreviousState, SampleService, ReportService, AccountService, SetSampleService, hotkeys) {
                console.log($state);
                if ($state.current.name != 'app.sample.find1' && PreviousState.Name != 'app.sample.entry') {
                        $state.go("app.sample.entry");                    
                }


                function SetViewScope() {
                    var x = ScopeService.getScope();
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

                    if ($scope.action == 'find') {
                        if (!angular.isUndefined(x.SampleTypes)) {
                            SampleService.loadSampleTypes().then(function (result) {
                                $scope.SampleTypes = result.data
                            });
                            SampleService.loadSampleColumns().then(function (result) {
                                $scope.Samplecolumns = result.data;
                            });
                        }
                        if (!angular.isUndefined(x.Sample.SampleTypeNumber)) {
                            var x = 1;
                            $scope.Sample.SampleTypeNumber = x.toString();
                        }
                        $scope.disabledFind = true;
                    } else if ($scope.action == 'add') {
                        $scope.readonly = false;
                        $scope.disabled = false;
                        $scope.disabledUpdate = false;
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
                        $scope.Recommendations = [];
                    } else if ($scope.action == 'update') {
                        $scope.disabledUpdate = true;
                        angular.element('#txtSampleID1').focus();
                    } else if ($scope.action == 'delete') {
                        $scope.readonly = true;
                        $scope.disabled = true;
                        angular.element('#btnCommit').focus();
                    } else {
                        $state.go('app.sample.entry');
                    }

                    SetHoldValues();
                }
                SetViewScope();

                /* -------------- Methods handling rec actions ---------------- */
                function ConvertRecs() {
                    $('input[auto-complete]').each(function () {
                        angular.element(this).controller('ngModel').$setViewValue($(this).val());
                    });
                    var idx = 0;
                    for (var i = 0; i < $scope.Recommendations.length; i++) {
                        var newRec = {
                            LabNumber: $scope.Sample.LabNumber,
                            BatchNumber: $scope.Sample.BatchNumber,
                            Priority: $scope.Recommendations[idx].Priority,
                            RecTypeNumber: $scope.Recommendations[idx].RecTypeName.substring(0, $scope.Recommendations[idx].RecTypeName.indexOf("-") - 1),
                            CropTypeNumber: $scope.Recommendations[idx].CropTypeName.substring(0, $scope.Recommendations[idx].CropTypeName.indexOf("-") - 1),
                            YieldGoal: $scope.Recommendations[idx].YieldGoal
                        };
                        $scope.SampleRecs.push(newRec);
                        idx++;
                    }
                    if ($scope.SampleRecs.length == 1 && $scope.SampleRecs[0].RecTypeNumber == 0) {
                        $scope.SampleRecs = [];
                    }
                    return $scope.SampleRecs;
                };
                function ResetRecPriority() {
                    for (var i = 0; i < $scope.Recommendations.length; i++) {
                        $scope.Recommendations[i].Priority = i;
                    }
                };
                $scope.RemoveRec = function (index) {
                    $scope.Recommendations.splice(index, 1);
                    $scope.ResetRecPriority();
                };
                $scope.AddRec = function () {
                    var recLength = $scope.Recommendations.length;
                    var newRec = {
                        LabNumber: $scope.Sample.LabNumber,
                        BatchNumber: $scope.Sample.BatchNumber,
                        Priority: recLength - 1,
                        RecTypeNumber: 0,
                        RecTypeName: "",
                        CropTypeNumber: 0,
                        CropTypeName: "",
                        YieldGoal: ""
                    }
                    if (newRec.Priority == -1) {
                        newRec.Priority = 0;
                    }
                    if ($scope.Sample.SampleTypeNumber == 14) {
                        newRec.RecTypeNumber = 4;
                        newRec.RecTypeName = "4 - Haney";
                    }
                    $scope.Recommendations.push(newRec);
                };                
                /* ------------------------------------------------------------ */

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
                function SetSubSampleInfo() {
                    $scope.SubSampleInfo.SampleTypeNumber = $scope.Sample.SampleTypeNumber;
                    $scope.SubSampleInfo.BatchNumber = $scope.Sample.BatchNumber;
                    $scope.SubSampleInfo.LabNumber = $scope.Sample.LabNumber;
                    if ($scope.Sample.SampleTypeNumber != 5) {
                        $scope.SubSampleInfo.SubSampleTypeNumber = angular.element('#cboType').val();
                        console.log("SubSampleTypeNumber1: " + $scope.SubSampleInfo.SubSampleTypeNumber);
                        $scope.SubSampleInfo.SubSubSampleTypeNumber == 0;
                    } else {
                        $scope.SubSampleInfo.SubSampleTypeNumber = angular.element('#cboPlantType').val();
                        $scope.SubSampleInfo.SubSampleTypeNumber = angular.element('#cboPlant').val();
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

                /* -------------- Methods handling validation actions -------- */
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
                    if (angular.isDefined($scope.SampleRecs)) {
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
                };
                function IsPresent(value) {
                    if (value != null && value != "") {
                        return true;
                    } else {
                        return false;
                    }
                };
                $scope.ValidateSampleDates = function () {
                    if ($scope.entryForm.dpkDateReceived.$invalid || $scope.entryForm.dpkDateReported.$invalid || ($scope.Sample.DateReceived > $scope.Sample.DateReported)) {
                        if ($scope.entryForm.dpkDateReceived.$invalid) {
                            DisplayPopover('dpkDateRecieved', 'Required form [yyyy-mm-dd]');
                        } else if ($scope.entryForm.dpkDateReported.$invalid) {
                            DisplayPopover('dpkDateReported', 'Required form [yyyy-mm-dd]');
                            angular.element('#dpkDateReported').addClass('has-error');
                        } else {
                            DisplayPopover('dpkDateReported', 'Must be greater than Date Received');
                            angular.element('#dpkDateReported').addClass('has-error');
                        }
                    } else {
                        RemovePopover('dpkDateReceived');
                        angular.element('#dpkDateReceived').removeClass('has-error');
                        RemovePopover('dpkDateReported');
                        angular.element('#dpkDateReported').removeClass('has-error');
                    }
                };
                $scope.ValidateTypes = function (index, type) {
                    var types = [];
                    var recID = "";
                    if (type == 'Crop') {
                        types = $scope.CropTypes;
                        recID = '#acoCropTypes' + index;
                    } else {
                        types = $scope.RecTypes;
                        recID = '#acoRecTypes' + index;
                    }
                    var value = angular.element(recID).val().trim().toUpperCase();
                    var recValue = "";
                    var isValid = false;
                    var i = 0;
                    if (value != "") {
                        if (!isNaN(value)) {
                            while (i < types.length && !isValid) {
                                if (types[i].substring(0, (types[i].indexOf("-") - 1)) == value) {
                                    recValue = types[i];
                                    isValid = true;
                                }
                                i++;
                            }
                        } else {
                            while (i < types.length && !isValid) {
                                if (types[i].substring((types[i].indexOf("-") + 2)) == value || types[i].toUpperCase() == value) {
                                    recValue = types[i];
                                    isValid = true;
                                }
                                i++;
                            }
                        }
                    } else {
                        isValid = false;
                    }
                    if (isValid) {
                        angular.element(recID).val(recValue);
                        return true;
                    } else {
                        angular.element(recID).focus();
                        return false;
                    }
                };
                function ValidateSampleChain() {
                    if (angular.element('input[id=chkTopSoil]:checked')) {
                        $scope.SampleChain.TopSoil = 1;
                    }

                    console.log("bDepth: " + angular.element('#txtBeginningDepth').val());

                    console.log("BDepth: " + $scope.SampleChain.BeginningDepth + ", EDepth: " + $scope.SampleChain.EndingDepth + ", PastCropNumber: " + $scope.SampleChain.PastCropNumber);
                    var valid = true;
                    if (IsPresent($scope.SampleChain.BeginningDepth) && IsPresent($scope.SampleChain.EndingDepth) && IsPresent($scope.SampleChain.PastCropNumber)) {
                        console.log("line 264");
                        if ($scope.SampleChain.TopSoil == 0) {
                            console.log("line 266");
                            if (IsPresent($scope.SampleChain.LinkedSampleBatch)) {
                                if (isNaN($scope.SampleChain.LinkedSampleBatch)) {
                                    valid = false;
                                    console.log("line 271");
                                }
                            }
                            if (!IsPresent($scope.SampleChain.LinkedSampleLab)) {
                                if (isNaN($scope.SampleChain.LinkedSampleBatch)) {
                                    valid = false;
                                    console.log("line 277");
                                }
                            }
                        }
                    } else {
                        valid = false;
                    }
                    return valid;
                };               
                function ValidateYieldGoal(i) {
                    var id = '#txtYieldGoal' + i;
                    var id2 = 'txtYieldGoal' + i;
                    var valid = true;
                    if (isNaN(angular.element(id).val())) {
                        //DisplayPopover(id2, 'Must be numeric');
                        //angular.element(id).addClass('has-error');
                        valid = false;
                    }
                    return valid;
                };
                function ValidateRecs() {                    
                    var recLength = $scope.Recommendations.length;
                    var valid = true;
                    console.log(recLength);
                    while (i < recLength && valid) {
                        valid = $scope.ValidateTypes(i, 'Rec');
                        valid = $scope.ValidateTypes(i, 'Crop');
                        valid = $scope.ValidateYieldGoal(i);
                        i++;
                    }

                    if (valid && recLength > 1) { // check for duplicates
                        var index = recLength - 1;
                        var recs = $scope.Recommendations;
                        var recID = '#acoRecTypes' + index;
                        var lastRecType = angular.element(recID).val();
                        var cropID = '#acoCropTypes' + index;
                        var lastCropType = angular.element(cropID).val();
                        var yieldID = '#txtYieldGoal' + index;
                        var lastYieldGoal = angular.element(yieldID).val();
                        var valid = true;
                        for (var i = 0; i < recLength; i++) {
                            if (recs[i].RecType == lastRecType && recs[i].CropType == lastCropType && recs[i].YieldGoal == lastYieldGoal) {
                                valid = false;
                            }
                        }
                        if (!valid) {
                            alert('Can not have duplicate sample recommendations');
                        }
                    }
                    return valid;
                };
                function ValidateForm() {
                    // Validate sample entry
                    var valid = true;
                    if ($scope.entryForm.$invalid) {
                        if ($scope.entryForm.cboCostTypeNumber.$invalid) {
                            DisplayPopover("cboSampleTypeNumber", "Required field");
                            angular.element('#cboSampleTypeNumber').addClass('has-error');
                        }
                        if ($scope.entryForm.txtAccountNumber.$invalid) {
                            DisplayPopover("txtAccountNumber", "Must be numeric");
                            angular.element('#txtAccountNumber').addClass('has-error');
                        }
                        if ($scope.entryForm.txtBatchNumber.$invalid) {
                            DisplayPopover("txtBatchNumber", "Must be correct format [yyyymmdd]");
                            angular.element('#txtBatchNumber').addClass('has-error');
                        }
                        if ($scope.entryForm.txtLabNumber.$invalid) {
                            DisplayPopover("txtLabNumber", "Must be numeric");
                            angular.element('#txtLabNumber').addClass('has-error');
                        }
                        if ($scope.entryForm.txtReportTypeNumber.$invalid) {
                            DisplayPopover("txtReportTypeNumber", "Must be numeric");
                            angular.element('#txtReportTypeNumber').addClass('has-error');
                        }
                        if ($scope.entryForm.acoGrower.$invalid) {
                            DisplayPopover("acoGrower", "Required field");
                            angular.element('#acoGrower').addClass('has-error');
                        }
                        if ($scope.entryForm.txtSampleID1.$invalid) {
                            DisplayPopover("txtSampleID1", "Required field");
                            angular.element('#txtSampleID1').addClass('has-error');
                        }
                        if ($scope.entryForm.txtSampleID2.$invalid) {
                            DisplayPopover("txtSampleID2", "Required field");
                            angular.element('#txtSampleID2').addClass('has-error');
                        }
                        if ($scope.entryForm.dpkDateReceived.$invalid) {
                            DisplayPopover("dpkDateReceived", "Required field [yyyy-mm-dd]");
                            angular.element('#dpkDateReceived').addClass('has-error');
                        }
                        if ($scope.entryForm.dpkDateReported.$invalid) {
                            DisplayPopover("dpkDateReported", "Required field [yyyy-mm-dd]");
                            angular.element('#dpkDateReported').addClass('has-error');
                        }
                        if ($scope.Sample.DateReceived > $scope.Sample.DateReported) {
                            $scope.entryForm.dpkDateReported.$invalid = true;
                            DisplayPopover("dpkDateReported", "Must be greater than Date Received");
                            angular.element('#dpkDateReported').addClass('has-error');
                        }
                        if ($scope.entryForm.cboCostTypeNumber.$invalid) {
                            DisplayPopover("cboCostTypeNumber", "Required field");
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
                            DisplayPopover("txtBeginDepth", "Must be numeric");
                            angular.element('#txtBeginDepth').addClass('has-error');
                        }
                        if ($scope.entryForm.txtEndingDepth.$invalid) {
                            DisplayPopover("txtEndDepth", "Must be greater than Beginning Depth");
                            angular.element('#txtEndDepth').addClass('has-error');
                        }
                        if ($scope.entryForm.cboPastCropNumber.$invalid) {
                            DisplayPopover("cboPastCropNumber", "Required field");
                            angular.element('#cboPastCropNumber').addClass('has-error');
                        }
                        valid = false;
                    } else {
                        valid = true;
                    }

                    // Validate frmSampleLinks
                    if (IsPresent($scope.SampleChain.LinkedSampleLab) && $scope.SampleChain.LinkedSampleBatch != $scope.Sample.BatchNumber) {
                        DisplayPopover("txtLinkSoilBatch", "Must match BatchNumber");
                        angular.element('#txtLinkSoilBatch').addClass('has-error');
                        valid = false;
                    }
                    if (IsPresent($scope.SampleChain.LinkedSampleBatch) && isNaN($scope.SampleChain.LinkedSampleLab) && $scope.SampleChain.LinkedSampleLab != "") {
                        DisplayPopover("txtLinkSoilLab", "Must be numeric");
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
                                DisplayPopover(recID, "Required field");
                            }
                            if (angular.element(cropID).val() != "") {
                                angular.element(cropID).addClass('has-error');
                                cropID = 'acoCropTypes' + i;
                                DisplayPopover(cropID, "Required field");
                            }
                            if (!isNaN(angular.element(yieldID).val())) {
                                angular.element(yieldID).addClass('has-error');
                                yieldID = 'txtYieldGoal' + i;
                                DisplayPopover(yieldID, "Must be numeric");
                            }
                        }
                        valid = false;
                    } else {
                        valid = true;
                    }
                    if (valid) {
                        RemoveValidation();
                    } else {
                        angular.element("form[id='frmSampleRecs']").find('.ng-invalid:first').focus();
                        angular.element("form[id='frmSampleInfo']").find('.ng-invalid:first').focus();
                        angular.element("form[id='entryForm']").find('.ng-invalid:first').focus();
                    }
                    return valid;
                };
                /* ---------------------------------------------------------- */

                $scope.DiscardChanges = function (response) {
                    $('#discardChangesModal').modal('hide');
                    if (response == 'yes') {                        
                        $state.go("app.sample.entry");
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
                $scope.Commit = function () {
                    if ($scope.action == 'find') {

                    } else if ($scope.action == 'add' || $scope.action == 'update') {                    
                        SetSampleChainValues();
                        if (ValidateForm()) {
                            if ($scope.Sample.SampleTypeNumber == 1 || $scope.Sample.SampleTypeNumber == 14) {
                                if (ValidateSampleChain()) {
                                    if (angular.isDefined($scope.sampleRecs)) {
                                        $scope.sampleRecs = ConvertRecs();
                                    }
                                    if ($scope.action == 'add') {
                                        SampleService.add($scope.Sample, $scope.SampleChain, $scope.SampleRecs, $scope.SubSampleInfo).then(function (result) {
                                            if (result.data != null) {
                                                SetSampleService.setAllValues(result.data);
                                                $state.go('app.sample.entry');
                                            }
                                        });
                                    } else {
                                        SampleService.update($scope.Sample, $scope.SampleChain, $scope.SampleRecs, $scope.SubSampleInfo).then(function (result) {
                                            console.log(result.data);
                                            if (result.data != null) {
                                                SetSampleService.setAllValues(result.data);
                                                $state.go("app.sample.entry");
                                            }
                                        });
                                    }
                                
                                }
                            } else if ($scope.Sample.SampleTypeNumber == 2 || $scope.Sample.SampleTypeNumber == 3 || $scope.Sample.SampleTypeNumber == 4 || $scope.Sample.SampleTypeNumber == 6 || $scope.Sample.SampleTypeNumber == 7 || $scope.Sample.SampleTypeNumber == 9 || $scope.Sample.SampleTypeNumber == 12 || $scope.Sample.SampleTypeNumber == 5) {
                                SetSubSampleInfo();
                            }                        
                        }
                    } else if ($scope.action == 'delete') {
                        SampleService.remove($scope.Sample.SampleTypeNumber, $scope.Sample.BatchNumber, $scope.Sample.LabNumber).then(function (result) {
                            if (result.data != null) {
                                ScopeService.setScope(result.data);
                                $state.go("app.sample.entry");
                            }
                        });
                    }
                };
                $scope.Cancel = function () {
                    if (!angular.equals($scope.Sample, $scope.holdSample) || (angular.isDefined($scope.holdSampleChain) && !angular.equals($scope.SampleChain, $scope.holdSampleChain)) || (angular.isDefined($scope.Recommendtations) && !angular.equals($scope.Recommendations, $scope.holdRecommendations)) || (angular.isDefined($scope.holdSubSampleInfo) && !angular.equals($scope.SubSampleInfo, $scope.holdSubSampleInfo))) {
                        $state.go("app.sample.entry");
                    } else {
                        $('#discardChangesModal').modal('show');
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