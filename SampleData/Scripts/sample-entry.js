angular.module("xyz", ["mainApp", "ngMask", "cfp.hotkeys", "ui.router"])
.controller("defaultCtrl", function ($scope, $http, Sample, Account, Report, hotkeys, $state, $stateParams) {
    
    /* --------------- Validation scripts ------------- */

    $scope.ValidateForm = function () {
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
    $scope.Validate = function (elem, id, message) {

        if (elem.$invalid && elem.$dirty) {
            $scope.DisplayPopover(id, message);
            id = "#" + id;
            angular.element(id).addClass('has-error');
            angular.element(id).focus();
        } else if (elem.$valid && elem.$dirty) {
            $scope.RemovePopover(id);
            id = "#" + id;
            angular.element(id).removeClass('has-error');
        }
    };
    
   
    $scope.ValidateSampleDates = function () {
        if ($scope.entryForm.dpkDateReceived.$invalid || $scope.entryForm.dpkDateReported.$invalid || ($scope.Sample.DateReceived > $scope.Sample.DateReported)) {
            if ($scope.entryForm.dpkDateReceived.$invalid) {
                $scope.DisplayPopover('dpkDateRecieved', 'Required form [yyyy-mm-dd]');
            } else if ($scope.entryForm.dpkDateReported.$invalid) {
                $scope.DisplayPopover('dpkDateReported', 'Required form [yyyy-mm-dd]');
                angular.element('#dpkDateReported').addClass('has-error');
            } else {
                $scope.DisplayPopover('dpkDateReported', 'Must be greater than Date Received');
                angular.element('#dpkDateReported').addClass('has-error');
            }
        } else {
            $scope.RemovePopover('dpkDateReceived');
            angular.element('#dpkDateReceived').removeClass('has-error');
            $scope.RemovePopover('dpkDateReported');
            angular.element('#dpkDateReported').removeClass('has-error');
        }
    };
    $scope.ValidateSampleChain = function () {
        var valid = true;
        if ($scope.IsPresent($scope.SampleChain.BeginningDepth) && $scope.IsPresent($scope.SampleChain.EndingDepth) && $scope.IsPresent($scope.SampleChain.PastCropNumber)) {
            if ($scope.SampleChain.TopSoil = 1) {
                if (!$scope.IsPresent($scope.SampleChain.LinkedSampleBatch) || !$scope.IsPresent($scope.SampleChain.LinkedSampleBatch)) {
                    valid = false;
                }
            }
        } else {
            valid = false;
        }
        return valid;
    }
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
    $scope.ValidateYieldGoal = function (i) {
        var id = '#txtYieldGoal' + i;
        var id2 = 'txtYieldGoal' + i;
        var valid = true;
        if (isNaN(angular.element(id).val())) {
            //$scope.DisplayPopover(id2, 'Must be numeric');
            //angular.element(id).addClass('has-error');
            valid = false;
        }
        return valid;
    }
    $scope.ValidateRecs = function () {
        $scope.ValidateSampleChain();
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
    }

    /*---------------- Ajax calls for Account, Grower, ReportName, SubSubSampleTypes -------------*/

    
    $scope.GetReportItems = function () {
        if ($scope.entryForm.cboSampleType.$valid) {
            Report.reportItems($scope.Sample.SampleTypeNumber).then(function (result) {
                if (result.data != null) {
                    $scope.ReportItems = result.data;
                    $scope.reportShown = false;
                }
                else 
                {
                    ////////////////////////////////////////////////////////////////////////////////////
                }
            });
        }
    };
    $scope.GetReportList = function () {
        console.log($scope.ItemsSelected);
        if (angular.isDefined($scope.ItemsSelected) && $scope.ItemsSelected.count > 0) {
            Report.reportList($scope.Sample.SampleTypeNumber, $scope.ItemsSelected).then(function (result) {
                if (result.data != null) {
                    $scope.Reports = results.data;
                    $scope.reportShown = true;
                } else {
                    ///////////////////////////////////////////////////////////////////////////////////
                }
            });
        } /////////////////////////////////////////////////////////////////////////////////////////
    };

    /*------------------Formatting -------------------*/

    $scope.FormatDates = function () {
        var dRec = $scope.Sample.DateReceived;
        var dRep = $scope.Sample.DateReported;
        var dRecTmp = new Date(dRec.substring(0, 4), dRec.substring(5, 7) - 1, dRec.substring(8, 10));
        $scope.Sample.DateReceived = dRecTmp;
        var dRepTmp = new Date(dRep.substring(0, 4), dRep.substring(5, 7) - 1, dRep.substring(8, 10));
        $scope.Sample.DateReported = dRepTmp;
    };
    $scope.IsPresent = function (value) {
        if (value != null && value != "") {
            return true;
        } else {
            return false;
        }
    };

    /* -------------- Methods handling rec actions -----------------*/

    $scope.RemoveRec = function (index) {
        $scope.Recommendations.splice(index, 1);
        $scope.ResetRecPriority();
    };
    $scope.BuildRec = function () {
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
    $scope.AddRec = function () { // build rec and then place focus on RecType input for added rec
        $scope.BuildRec();
        //angular.element('input[id=acoRecTypes2]').focus();
    };
    $scope.ConvertRecs = function () {
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
    $scope.ResetRecPriority = function () {
        for (var i = 0; i < $scope.Recommendations.length; i++) {
            $scope.Recommendations[i].Priority = i;
        }
    };

    /*-------------- Form Submission --------------*/

   
    /*------------------- Misc dynamic form actions -----------------*/

    $scope.ResetForm = function () {
        $scope.RemoveValidation();
        $scope.action = "";
        $scope.required = true;
        $scope.readonly = true;
        $scope.disabled = false;
        $scope.disabledUpdate = false;
        $scope.reportShown = false;
        $scope.disableNext = true;
        $scope.Messages = [];
        if (angular.isDefined($scope.ItemsSelected)) {
            ItemsSelected = [];
        }
    }; 
    $scope.DiscardChanges = function (response) {
        if (response == 'yes') {
            $scope.action = "";
            $scope.Load(1); // Change to load last sampletype in cache
            $scope.RemoveValidation();
            $scope.ResetForm();
        } else {
            $scope.ItemsSelected = [];
        }
    };


    $scope.SetDateReported = function () {
        if ($scope.action != 'find' || ($scope.action == 'find' && angular.element('#txtBatchNumber').val() != "")) {
            console.log("true");
            console.log($scope.action);
            console.log("|" + $scope.Sample.BatchNumber + "|")
            $scope.Validate($scope.entryForm.txtBatchNumber, 'txtBatchNumber', 'Required format is [yyyymmdd]');
            if ($scope.action == 'add' && !$scope.entryForm.txtBatchNumber.$invalid) {
                $scope.Sample.DateReported = $scope.Sample.BatchNumber.toString().substring(0, 4) + "-" + $scope.Sample.BatchNumber.toString().substring(4, 6) + "-" + $scope.Sample.BatchNumber.toString().substring(6, 8);
                $scope.RemovePopover('txtBatchNumber')
                angular.element('#txtBatchNumber').removeClass('has-error');
            }
        } else {
            $scope.RemovePopover('txtBatchNumber')
            angular.element('#txtBatchNumber').removeClass('has-error');
        }
    };
    $scope.SetDepth = function () {
        if (angular.element('input[id=chkTopSoil]:checked').length == 1) {
            $scope.SampleChain.BeginningDepth = 0;
            angular.element('#txtEndDepth').focus();
        } else {
            $scope.SampleChain.BeginningDepth = "";
            angular.element('#txtBeginDepth').focus();
        }
    };
    $scope.AddItemToList = function (reportItemNumber) {
        console.log("TestItemNumber: " + reportItemNumber);
        var found = false;
        var i = 0
        $scope.ItemsSelected = [];
        while (!found && i < $scope.ReportItems.length) {
            if ($scope.ItemsSelected[i] == reportItemNumber) {
                found = true;
            }
            i++;
        }
        if (!found) { // add
            $scope.ItemsSelected.push(reportItemNumber);
        } else { // remove
            $scope.ItemsSelected.splice(i - 1, 1);
        }
    };
    $scope.SelectReport = function () {
        $scope.Sample.ReportTypeNumber = angular.element('input[name=reports]:checked').val();
        $scope.GetReportName();
        $('#testItemsModal').modal('hide')
        $scope.reportShown = false;
    };
    
    /* -------------------- Setting values -----------------------*/

    $scope.SetSampleChain = function () {
        $scope.SampleChain.BatchNumber = $scope.Sample.BatchNumber;
        $scope.SampleChain.LabNumber = $scope.Sample.LabNumber;
        if (angular.element('input[id=chkTopSoil]:checked')) {
            $scope.SampleChain.TopSoil = 1;
            $scope.SampleChain.LinkedSampleBatch = 0;
            $scope.SampleChain.LinkedSampleLab = 0;
        } else {
            $scope.SampleChain.TopSoil = 0;
            $scope.SampleChain.LinkedSampleBatch = $scope.SampleChain.LinkedSampleBatch;
            $scope.SampleChain.LinkedSampleLab = $scope.SampleChain.LinkedSampleLab;
        }
    };
    $scope.SetSubSampleInfo = function () {
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

    /* -------------- Find, Add, Update, Delete ------------------*/
    
    function SetRecLayout(stn) {
        switch ($scope.Sample.SampleTypeNumber) {
            //Soil
            case "1":
                $scope.rightSide = true;
                $scope.SoilSampleLink = false;
                $scope.linkToSoil = false;
                $scope.soilView = true;
                $scope.plantView = false;
                $scope.otherView = false;
                break;
                //Biological
            case "14":
                $scope.rightSide = true;
                $scope.SoilSampleLink = true;
                $scope.linkToSoil = true;
                $scope.soilView = true;
                $scope.plantView = false;
                $scope.otherView = false;
                break;
                //Plant
            case "5":
                $scope.rightSide = true;
                $scope.soilView = false;
                $scope.plantView = true;
                $scope.otherView = false;
                break;
                //Feed, NIR, Water, Manure, Slurry, Fertilizer, Resin 
            case "2":
            case "3":
            case "4":
            case "6":
            case "7":
            case "9":
            case "12":
                $scope.rightSide = true;
                $scope.soilView = false;
                $scope.plantView = false;
                $scope.otherView = true;
                break;
                //Potato, Herbicide, Wasterwater, Other
            case "10":
            case "11":
            case "8":
            case "13":
                $scope.rightSide = false;
                $scope.soilView = false;
                $scope.plantView = false;
                $scope.otherView = false;
                break;
        }
    };
       
    $scope.Change = function () {
        var stn = parseInt(angular.element('#cboSampleType').val());
        $scope.ClearForm();
        $scope.Load(stn);
        SetRecLayout(stn);
    };

})


//hotkeys.bindTo($scope)
//    .add({
//        combo: 'p',
//        description: 'Previous',
//        callback: function () { $scope.Prev($scope.Sample.LabNumber); }
//    })
//    .add({
//        combo: 'n',
//        description: 'Next',
//        callback: function () { $scope.Next($scope.Sample.LabNumber); }
//    })
//    .add({
//        combo: 'f',
//        description: 'Find',
//        callback: function () { $scope.BeginFind(); }
//    })
//    .add({
//        combo: 'a',
//        description: 'Add',
//        callback: function () { $scope.BeginAdd(); }
//    })
//    .add({
//        combo: 'u',
//        description: 'Update',
//        callback: function () { $scope.BeginUpdate(); }
//    })
//    .add({
//        combo: 'd',
//        description: 'Delete',
//        callback: function () { $scope.BeginDelete(); }
//    })
//    .add({
//        combo: 'enter',
//        description: 'Commit',
//        callback: function () { $scope.SubmitForm($scope.action); }
//    })
//    .add({
//        combo: 'esc',
//        description: 'Cancel',
//        callback: function () { $scope.CancelAction(); }
//    });