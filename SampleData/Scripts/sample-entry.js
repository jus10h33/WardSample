angular.module("sampleEntryApp", ["wardApp", "ngMask"])
.controller("defaultCtrl", function ($scope, $http, Sample) { 

    $scope.SetGenericMasters = function (samples, accounts, sampleTypes, sampleColumns) {
        $scope.Samples = samples;
        $scope.Accounts = accounts;
        $scope.SampleTypes = sampleTypes;
        $scope.SampleColumns = sampleColumns;
    };
    $scope.SetSoilMasters = function (cropTypes, recTypes, pastCrops) {
        $scope.CropTypes = cropTypes;
        $scope.PastCrops = pastCrops;
        $scope.RecTypes = recTypes;
    };
    $scope.SetSubMasters = function (subSampleTypes, subSubSampleTypes) {
        $scope.SubSampleTypes = subSampleTypes;
        if (subSubSampleTypes != null) {
            $scope.SubSubSampleTypes = subsubSampleTypes
        }
    };
    $scope.SetGenericValues = function (sample, account, messages) {
        $scope.readonly = true;
        $scope.Sample = sample;
        $scope.Sample.SampleTypeNumber = $scope.Sample.SampleTypeNumber.toString();
        $scope.Sample.CostTypeNumber = $scope.Sample.CostTypeNumber.toString();
        $scope.Sample.DateReceived = new Date(parseInt($scope.Sample.DateReceived.replace(/(^.*\()|([+-].*$)/g, ''))).toLocaleDateString();
        $scope.Sample.DateReported = new Date(parseInt($scope.Sample.DateReported.replace(/(^.*\()|([+-].*$)/g, ''))).toLocaleDateString();
        $scope.Account = account;
        angular.element("#acoGrower").autocomplete({ source: account.Growers, minLength: 0 }).focus(function () { $(this).autocomplete("search"); });
        $scope.Messages = messages;
    };
    $scope.SetTopSoils = function (index) {
        $scope.TopSoils = $scope.TopSoilsList[index];
    };
    $scope.SetSampleChains = function (index) {
        $scope.SampleChains = $scope.SampleChainsList[index];
        $scope.SampleChain = $scope.SampleChains[0];
        $scope.SampleChain.PastCropNumber = $scope.SampleChain.PastCropNumber.toString();
        $scope.SampleChain.Available = $scope.SampleChain.LabNumber.toString();
        if ($scope.SampleChain.TopSoil == 1) {
            $scope.chkTopSoil = true;
            $scope.sampleChainLink = false;
            $scope.chkLinkToSoil = false;
        } else {
            $scope.sampleChainLink = true;
            $scope.chkLinkToSoil = true;
            $scope.chkTopSoil = false;
        }
    };
    $scope.SetSampleChainValues = function () {
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
    $scope.SetRecommendations = function (index) {
        $scope.SampleRecs = [];
        if ($scope.RecommendationsList != null && $scope.RecommendationsList[index].length != 0) {
            $scope.SetRecForm($scope.Recommendations[index]);
        }
    };
    $scope.SetSubValues = function (subSampleInfo, subSampleInfos) { // if stn is Feed, NIR, Water, Manure, Slurry, Fertilizer, Resin, Plant  
        $scope.SubSampleInfo = subSampleInfo;
        $scope.SubSampleInfos = subSampleInfos;
        $scope.SubSampleInfo.SubSampleTypeNumber = $scope.SubSampleInfo.SubSampleTypeNumber.toString();
        if ($scope.SubSampleInfo.SubSubSampleType != null) {
            $scope.SubSampleInfo.SubSubSampleTypeNumber = $scope.SubSampleInfo.SubSubSampleTypeNumber.toString();
        }
    };
    $scope.SetRecLayout = function () {
        switch ($scope.Sample.SampleTypeNumber) {
            //Soil
            case "1":
                $scope.rightSide = true;
                $scope.SampleChainLink = false;
                $scope.linkToSoil = false;
                $scope.soilView = true;
                $scope.plantView = false;
                $scope.otherView = false;
                break;
            //Biological
            case "14":
                $scope.rightSide = true;
                $scope.SampleChainLink = true;
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
    $scope.SetRecForm = function (recommendations) {
        $scope.Recommendations = recommendations;
        if ($scope.Sample.SampleTypeNumber == 14) {
            $scope.RecTypes = [];
            for (var i = 0; i < $scope.Recommendations.length; i++) {
                var id = '#acoRecTypes' + i;
                $scope.Recommendations[i].RecTypeName = '4 - Haney';
                angular.element(id).attr('disabled', true);
            }
        }
    }
    $scope.SetFormValues = function (data) {
        $scope.SetGenericMasters(data.GenericInfo.Samples, data.GenericInfo.Accounts, data.GenericMasters.SampleTypes, data.GenericMasters.SampleColumns);
        $scope.SetGenericValues(data.GenericInfo.Samples[0], data.GenericInfo.Accounts[0], data.GenericInfo.Messages);
        var stn = $scope.Samples[0].SampleTypeNumber;
        if (stn == 1 || stn == 14) {
            $scope.SetSoilMasters(data.SoilMasters.CropTypes, data.SoilMasters.RecTypes, data.SoilMasters.PastCrops)
            $scope.TopSoilsList = data.TopSoils;
            $scope.SampleChainsList = data.SampleChains;
            $scope.RecommendationsList = data.Recommendations;
            //console.log($scope.RecommendationsList);
            $scope.SetTopSoils(0);
            $scope.SetSampleChains(0);
            $scope.SetRecommendations(0);
        } else if (stn == 2 || stn == 3 || stn == 4 || stn == 5 || stn == 6 || stn == 7 || stn == 9 || stn == 12) {
            $scope.SetSubMasters(data.SubSampleTypes, data.SubSubSampleTypes)
            $scope.SetSubValues(data.SubSampleInfos[0], data.SubSampleInfos);
        }
    }
    $scope.Load = function (stn) {
        Sample.load(stn).then(function (result) {
            if (result != null) {
                $scope.SetFormValues(result);
                $scope.SetRecLayout();
                $scope.action = "";
                $scope.required = true;
                $scope.readonly = true;
                $scope.disabled = false;
                $scope.disabledUpdate = false;
                $scope.reportShown = false;
                $scope.disableNext = true;
            }
            
        });        
    };
    $scope.Load(1); // Change to load last sampletype in cache

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
        //$scope.frmSampleRecs = [];
        //if ($scope.frmSampleRecs.$invalid) {
        //    for (var i = 0; i < $scope.SampleRecs.length; i++) {
        //        var recID = '#acoRecTypes' + i;
        //        var cropID = '#acoCropTypes' + i;
        //        var yieldID = '#txtYieldGoal' + i;

        //        if (angular.element(recID).val() != "") {
        //            angular.element(recID).addClass('has-error');
        //            recID = 'acoRecTypes' + i;
        //            $scope.DisplayPopover(recID, "Required field");
        //        }
        //        if (angular.element(cropID).val() != "") {
        //            angular.element(cropID).addClass('has-error');
        //            cropID = 'acoCropTypes' + i;
        //            $scope.DisplayPopover(cropID, "Required field");                    
        //        }
        //        if (!isNaN(angular.element(yieldID).val())) {
        //            angular.element(yieldID).addClass('has-error');
        //            yieldID = 'txtYieldGoal' + i;
        //            $scope.DisplayPopover(yieldID, "Must be numeric");                    
        //        }
        //    }
        //    valid = false;
        //} else {
        //    valid = true;
        //}
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
    $scope.DisplayPopover = function (id, message) {
        id = "#" + id;
        angular.element(id).attr("data-container", "body");
        angular.element(id).attr("data-toggle", "popover");
        angular.element(id).attr("data-placement", "right");
        angular.element(id).attr("data-content", message);
        angular.element(id).popover('show');
        return;
    };
    $scope.RemovePopover = function (id) {
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
    $scope.RemoveValidation = function () {
        $scope.RemovePopover('cboSampleType');
        angular.element('#cboSampleType').removeClass('has-error');
        $scope.RemovePopover('txtAccountNumber');
        angular.element('#txtAccountNumber').removeClass('has-error');
        $scope.RemovePopover('txtBatchNumber');
        angular.element('#txtBatchNumber').removeClass('has-error');
        $scope.RemovePopover('txtLabNumber');
        angular.element('#txtLabNumber').removeClass('has-error');
        $scope.RemovePopover('txtReportTypeNumber');
        angular.element('#txtReportTypeNumber').removeClass('has-error');
        $scope.RemovePopover('acoGrower');
        angular.element('#acoGrower').removeClass('has-error');
        $scope.RemovePopover('txtLocation');
        angular.element('#txtLocation').removeClass('has-error');
        $scope.RemovePopover('txtSampleID1');
        angular.element('#txtSampleID1').removeClass('has-error');
        $scope.RemovePopover('dpkDateReceived');
        angular.element('#dpkDateReceived').removeClass('has-error');
        $scope.RemovePopover('dpkDateReported');
        angular.element('#dpkDateReported').removeClass('has-error');
        $scope.RemovePopover('cboCostTypeNumber');
        angular.element('#cboCostTypeNumber').removeClass('has-error');
        $scope.RemovePopover("txtLinkSoilBatch");
        angular.element('#txtLinkSoilBatch').removeClass('has-error');
        $scope.RemovePopover("txtLinkSoilLab");
        angular.element('#txtLinkSoilLab').removeClass('has-error');
        for (var i = 0; i < $scope.SampleRecs.length; i++) {
            var recID = '#acoRecTypes' + i;
            var cropID = '#acoCropTypes' + i;
            var yieldID = '#txtYieldGoal' + i;
            angular.element(recID).removeClass('has-error');
            recID = 'acoRecTypes' + i;
            $scope.RemovePopover(recID);
            angular.element(cropID).removeClass('has-error');
            cropID = 'acoCropTypes' + i;
            $scope.RemovePopover(cropID);
            angular.element(yieldID).removeClass('has-error');
            yieldID = 'txtYieldGoal' + i;
            $scope.RemovePopover(yieldID);
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
            // no value entered error
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
        for (var i = 0; i < recLength; i++) {
            valid = $scope.ValidateTypes(i, 'Rec');
            valid = $scope.ValidateTypes(i, 'Crop');
            valid = $scope.ValidateYieldGoal(i);
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

    $scope.FindAccount = function () {
        if ($scope.entryForm.txtAccountNumber.$valid) {
            var account = Account.find($scope.Sample.AccountNumber, $scope.Sample.SampleTypeNumber);
            if (account != null) {
                $scope.Account.Name = account.Name;
                $scope.Account.Company = account.Company;
                $scope.Account.Address1 = account.Address1;
                $scope.Account.CityStZip = account.CityStZip;
                $scope.Account.SampleEntryInformation = account.SampleEntryInformation;
                $scope.Account.Growers = account.Growers;
                angular.element("#acoGrower").autocomplete({ source: $scope.Account.Growers, minLength: 0, delay: 0 }).focus(function () { $(this).autocomplete("search"); });
                $scope.RemovePopover('txtAccountNumber');
            } else {
                $scope.Account = {};
                $scope.Sample.Grower = "";
                angular.element("#acoGrower").autocomplete({ source: [] });
                $scope.Account.Name = "Account Not Found";
                $scope.RemovePopover('txtAccountNumber');
                $scope.DisplayPopover('txtAccountNumber', 'Account does NOT exist');
                angular.element('#txtAccountNumber').focus();
            }
        } else {
            $scope.Validate($scope.entryForm.txtAccountNumber, 'txtAccountNumber', 'Must be numeric');
        }
    };
    $scope.GetReportName = function () {
        if ($scope.entryForm.txtReportTypeNumber.$valid) {
            $http.get('/SampleModels/GetReportName?sampleTypeNumber=' + $scope.Sample.SampleTypeNumber + '&reportTypeNumber=' + $scope.Sample.ReportTypeNumber)
             .success(function (data) {
                 if (data != null) {
                     $scope.entryForm.txtReportTypeNumber.$valid = true;
                     $scope.entryForm.txtReportTypeNumber.$invalid = false;
                     angular.element('#txtReportTypeNumber').removeClass('has-error');
                     $scope.RemovePopover('txtReportTypeNumber');
                     $scope.Sample.ReportName = data;
                 } else {
                     $scope.entryForm.txtReportTypeNumber.$valid = false;
                     $scope.entryForm.txtReportTypeNumber.$invalid = true;
                     $scope.DisplayPopover('txtReportTypeNumber', 'No Results');
                     angular.element('#txtReportTypeNumber').focus();
                     $scope.Sample.ReportTypeNumber = "";
                 }
             })
          .error(function () {
              $scope.Sample.ReportName = "Error";
              $scope.entryForm.txtReportTypeNumber.$valid = false;
              $scope.entryForm.txtReportTypeNumber.$invalid = true;
          })
        } else {
            $scope.DisplayPopover('txtReportTypeNumber', 'Must be numeric');
            angular.element('#txtReportTypeNumber').addClass('has-error');
            angular.element('#txtReportTypeNumber').focus();
            $scope.Sample.ReportName = "";
        }
    };
    $scope.GetTestItems = function () {
        $http.get('/SampleModels/GetTestItems?sampleTypeNumber=' + $scope.Sample.SampleTypeNumber)
          .success(function (data) {
              if (data != null) {
                  console.log(data);
                  $scope.TestItems = data;
              } else {
                  alert("Error - data null");
              }
          })
          .error(function () {
              alert("DB Error");
          });
    };
    $scope.GetReportList = function () {
        console.log($scope.ItemsSelected);
        $http.get('/SampleModels/GetReportList?stn=' + $scope.Sample.SampleTypeNumber + '&rins=' + $scope.ItemsSelected)
          .success(function (data) {
              if (data != null) {
                  console.log(data);
                  if (data != null) {
                      $scope.Reports = data;
                      $scope.reportShown = true;
                  }
              } else {
                  alert("Error - data null");
              }
          })
          .error(function () {
              alert("DB Error");
          });

    };
    $scope.GetSubSubSampleTypes = function () {
        $http.get('/SampleModels/GetSubSubSampleTypes?stn=' + $scope.Sample.SampleTypeNumber + '&sstn=' + $scope.SubSampleType.SubSampleTypeNumber)
          .success(function (data) {
              if (data != null) {
                  console.log("SubSubSampleTypes: " + data);
                  $scope.SubSubSampleTypes = data;
              } else {
                  alert("Error - data null");
              }
          })
          .error(function () {
              alert("DB Error");
          });
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

    $scope.SubmitForm = function (action) {
        console.log("Action: " + action);
        if (action == 'find') {
            if ($scope.entryForm.cboSampleType.$valid && $scope.entryForm.txtLabNumber.$valid) {
                console.log("batchnumber: |" + $scope.Sample.BatchNumber + "|");
                if (($scope.entryForm.txtBatchNumber.$invalid && angular.isUndefined($scope.Sample.BatchNumber)) || $scope.entryForm.txtBatchNumber.$valid) {
                    $scope.FindSample();
                    return;
                } else {
                    $scope.DisplayPopover("txtBatchNumber", "Must be correct format [yyyymmdd]");
                    angular.element('#txtBatchNumber').addClass('has-error');
                }
            } else {
                if ($scope.entryForm.cboSampleType.$invalid) {
                    $scope.DisplayPopover("cboSampleTypeNumber", "Required field");
                    angular.element('#cboSampleTypeNumber').addClass('has-error');
                }
                if ($scope.entryForm.txtLabNumber.$invalid) {
                    $scope.DisplayPopover("txtLabNumber", "Must be numeric");
                    angular.element('#txtLabNumber').addClass('has-error');
                }
            }
            return;
        }
        if (action == 'delete') {
            if ($scope.entryForm.txtAccountNumber.$valid && $scope.entryForm.txtBatchNumber.$valid && $scope.entryForm.txtLabNumber.$valid) {
                $scope.DeleteSample();
                return;
            } else {
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
                return;
            }
        }
        if ($scope.ValidateForm()) {
            if ($scope.Sample.SampleTypeNumber == 1 || $scope.Sample.SampleTypeNumber == 14) {
                //if ($scope.ValidateRecs()) {
                //    $scope.SampleRecs = $scope.ConvertRecs();
                //}
            } else if ($scope.Sample.SampleTypeNumber == 2 || $scope.Sample.SampleTypeNumber == 3 || $scope.Sample.SampleTypeNumber == 4 || $scope.Sample.SampleTypeNumber == 6 || $scope.Sample.SampleTypeNumber == 7 || $scope.Sample.SampleTypeNumber == 9 || $scope.Sample.SampleTypeNumber == 12 || $scope.Sample.SampleTypeNumber == 5) {
                $scope.SetSubSampleInfo();
            }
            if (action == 'add') {
                $scope.AddSample();
            } else if (action == 'update') {
                $scope.UpdateSample();
            }
            $scope.disabled = true;
            $scope.disabledUpdate = false;
        }
    };

    /*------------------- Misc dynamic form actions -----------------*/

    $scope.Change = function () {
        console.log("action=" + $scope.action);
        if ($scope.action != 'find') {
            var stn = parseInt(angular.element('#cboSampleType').val());
            $scope.ClearForm();
            $scope.Load(stn);
        }
    };
    $scope.ResetForm = function () {
        $scope.action = "";
        $scope.required = true;
        $scope.readonly = true;
        $scope.disabled = false;
        $scope.disabledUpdate = false;
        $scope.reportShown = false;
        $scope.disableNext = true;
        $scope.Messages = [];
    };
    $scope.CancelAction = function () {
        $scope.Load(1); // Change to load last sampletype in cache
        $scope.ResetForm();
        $scope.RemoveValidation();
    };
    $scope.ClearForm = function () {
        var stn = $scope.Sample.SampleTypeNumber;
        $scope.Sample = {};
        $scope.Sample.SampleTypeNumber = stn;
        $scope.Account = {};
        $scope.SampleChain = {};
        $scope.SampleChains = {};
        $scope.Recommendations = [];
        angular.element("#acoGrower").autocomplete({ source: [] });
        $scope.RemoveValidation();
    };
    $scope.ToggleButtons = function (action) {
        console.log("toggling buttons....");
        $scope.readonly = false;
        if (action == 'prev') {
            $scope.ClearForm();
            $scope.readonly = true;
        } else if (action == 'find') {
            console.log("inside find");
            $scope.ClearForm();
            $scope.disabled = true;
            $scope.action = 'find';
            $scope.rightSide = false; // hide sample info and recommendations
            angular.element('#txtBatchNumber').focus();
        } else if (action == 'add') {
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
            $scope.RemoveValidation();
        } else if (action == 'update') {
            $scope.disabled = false;
            $scope.disabledUpdate = true;
            $scope.action = 'update';
            angular.element('#txtSampleID1').focus();
            $scope.RemoveValidation();
        } else if (action == 'delete') {
            $scope.disabled = true;
            $scope.action = 'delete';
            angular.element('#btnCommit').focus();
            $scope.RemoveValidation();
        } else if (action == 'next') {
            $scope.ClearForm();
            $scope.readonly = true;
        }
        console.log(action);
    };
    $scope.SetDateReported = function () {
        $scope.Validate($scope.entryForm.txtBatchNumber, 'txtBatchNumber', 'Required format is [yyyymmdd]');
        if ($scope.action == 'add' && !$scope.entryForm.txtBatchNumber.$invalid) {
            $scope.Sample.DateReported = $scope.Sample.BatchNumber.toString().substring(0, 4) + "-" + $scope.Sample.BatchNumber.toString().substring(4, 6) + "-" + $scope.Sample.BatchNumber.toString().substring(6, 8);
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
    $scope.SetBtnVisibility = function (btn, action) {
        var btnID = '#' + btn;
        if (action == 'hide') {
            angular.element(btnID).addClass("v-hidden");
        } else {
            angular.element(btnID).removeClass("v-hidden");
        }
    };
    $scope.AddItemToList = function (testItemNumber) {
        console.log("TestItemNumber: " + testItemNumber);
        var found = false;
        var i = 0
        while (!found && i < $scope.TestItems.length) {
            if ($scope.ItemsSelected[i] == testItemNumber) {
                found = true;
            }
            i++;
        }
        if (!found) { // add
            $scope.ItemsSelected.push(testItemNumber);
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

    $scope.FindSample = function () {
        Sample.find($scope.Sample.SampleTypeNumber, $scope.Sample.LabNumber, $scope.Sample.BatchNumber).then(function (result) {
            console.log(result);
            if (result != null) {
                $scope.SetFormValues(result);
                $scope.SetRecLayout();
                $scope.ResetForm();
            } else {
                angular.element("#txtLabNumber").focus();
            }
        });                                    
    };
    $scope.AddSample = function () {
        $scope.SetSampleChainValues();
        Sample.add($scope.Sample, $scope.SampleChain, $scope.SampleRecs, $scope.SubSampleInfo).then(function (result) {
            if (result != null) {
                console.log(result);
                $scope.SetFormValues(result);
            } else {
                console.log("data not null");
                $scope.Load($scope.Sample.SampleTypeNumber);
            }
            $scope.ResetForm();
        });        
    };
    $scope.UpdateSample = function () {
        $scope.SetSampleChainValues();
        Sample.update($scope.Sample, $scope.SampleChain, $scope.SampleRecs, $scope.SubSampleInfo).then(function (result) {
            if (result != null) {
                $scope.SetFormValues(result);
            } else {
                $scope.Load($scope.Sample.SampleTypeNumber);
            }
            $scope.ResetForm(); 
        });        
    };
    $scope.DeleteSample = function () {
        Sample.remove($scope.Sample.SampleTypeNumber, $scope.Sample.BatchNumber, $scope.Sample.LabNumber);
        ////////////////////////////////////////////////////////////////
        $scope.ResetForm();
        $scope.Load($scope.Sample.SampleTypeNumber);        
    };
    var y = 0;
    $scope.Next = function (ln) {
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
            $http({
                method: 'POST',
                url: '/SampleModels/GetNext',
                data: { 'stn': $scope.Sample.SampleTypeNumber, 'bn': $scope.Sample.BatchNumber, 'ln': $scope.Sample.LabNumber }
            })
          .success(function (data) {
              console.log(data);
              if (angular.isDefined(data) && data != null && data != "") {
                  y = data.GenericInfo.Samples.length - 1;
                  $scope.SetGenericMasters(data.GenericInfo.Samples, data.GenericInfo.Accounts, $scope.SampleTypes, $scope.SampleColumns);
                  $scope.SetGenericValues(data.GenericInfo.Samples[y], data.GenericInfo.Accounts[y], data.GenericInfo.Messages);
                  var stn = $scope.Samples[y].SampleTypeNumber;
                  if (stn == 1 || stn == 14) {
                      $scope.TopSoilsList = data.TopSoils;
                      $scope.SampleChainsList = data.SampleChains;
                      $scope.RecommendationsList = data.Recommendations;
                      $scope.SetTopSoils(y);
                      $scope.SetSampleChains(y);
                      $scope.SetRecommendations(y);
                  } else if (stn == 2 || stn == 3 || stn == 4 || stn == 5 || stn == 6 || stn == 7 || stn == 9 || stn == 12) {
                      $scope.SetSubValues(data.SubSampleInfos[y], data.SubSampleInfos);
                  }
              } else {
                  $scope.disableNext = true;
                  y = 0;
              }
          })
          .error(function () { });
        }
    };
    $scope.Prev = function (ln) {
        console.log(ln);
        $scope.disableNext = false;
        var found = false;
        while (!found && y >= 0 && y < $scope.Samples.length) {
            console.log("!found, y: " + y);
            if ($scope.Samples[y].LabNumber == ln) {
                found = true;
            }
            y++;
        }
        if (found && y < $scope.Samples.length) {
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
            $http({
                method: 'POST',
                url: '/SampleModels/GetPrev',
                data: { 'stn': $scope.Sample.SampleTypeNumber, 'bn': $scope.Sample.BatchNumber, 'ln': $scope.Sample.LabNumber }
            })
          .success(function (data) {
              console.log(data);
              if (angular.isDefined(data) && data != null && data != "") {
                  y = 0
                  $scope.SetGenericMasters(data.GenericInfo.Samples, data.GenericInfo.Accounts, $scope.SampleTypes, $scope.SampleColumns);
                  $scope.SetGenericValues(data.GenericInfo.Samples[y], data.GenericInfo.Accounts[y], data.GenericInfo.Messages);
                  var stn = $scope.Samples[y].SampleTypeNumber;
                  if (stn == 1 || stn == 14) {
                      $scope.TopSoilsList = data.TopSoils;
                      $scope.SampleChainsList = data.SampleChains;
                      $scope.RecommendationsList = data.Recommendations;
                      $scope.SetTopSoils(y);
                      $scope.SetSampleChains(y);
                      $scope.SetRecommendations(y);
                  } else if (stn == 2 || stn == 3 || stn == 4 || stn == 5 || stn == 6 || stn == 7 || stn == 9 || stn == 12) {
                      $scope.SetSubValues(data.SubSampleInfos[y], data.SubSampleInfos);
                  }
              } else {
                  $scope.disablePrev = true;
                  y = $scope.Samples.length - 1;
              }
          })
          .error(function () { });
        }
    };

    //angular.element(document).keypress(function (e) {
    //    console.log($scope.action);
    //    if ($scope.action == 'add' || $scope.action == 'find' || $scope.action == 'update' || $scope.action == 'delete') {
    //        if (e.which == 13 || e.keyCode == 13) {            
    //            //$scope.SubmitForm($scope.action);
    //            alert('You pressed enter!');
    //        } else if ($.ui.keyCode.ESCAPE) {
    //            $scope.CancelAction();
    //        }
    //    } else if (angular.isUndefined($scope.action) || $scope.action == "") {
    //        console.log("keycode: " + e.keyCode + ", which: " +e.which);
    //        if (e.which == 102 || e.keyCode == 102) { // f
    //            console.log("find sample");
    //            $scope.ToggleButtons('find');
    //        } else if (e.which == 97 || e.keyCode == 97) { // a
    //            $scope.ToggleButtons('add');
    //        } else if (e.which == 117 || e.keyCode == 117) { // u
    //            $scope.ToggleButtons('update');
    //        } else if (e.which == 110 || e.keyCode == 110) { // n
    //            $scope.ToggleButtons('next');
    //        } else if (e.which == 112 || e.keyCode == 112) { // p
    //            $scope.ToggleButtons('prev');
    //        }
    //    }
    //});
});