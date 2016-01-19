var samplesEntry = angular.module("samplesEntry", [])
.controller("defaultCtrl", function ($scope, $http) {

    /* ------------ OnLoad -------------*/

    $scope.Samples = [];
    $scope.Sample = {};
    $scope.Customer = {};
    $scope.SoilSample = {};
    $scope.entryForm = {};
    $scope.frmSampleInfo = {};
    $scope.frmSampleLinks = {};
    $scope.frmSampleRecs = {};
    $scope.SampleRecs = [];
    $scope.Recommendations = [];
    $scope.TestItems = [];
    $scope.SubSampleType = {};
    $scope.SubSampleTypes = [];
    $scope.regNumeric = new RegExp("^[0-9]+$");
    $scope.regBatch = new RegExp('20(0[6-9]|[1-9][0-9])(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])');
    $scope.regDate = new RegExp('^20(0[7-9]|[1-9][0-9])-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$');
    $scope.action == ""
    $scope.required = true;
    $scope.readonly = true;
    $scope.disabled = false;
    $scope.disableNext = true;
    $scope.disablePrev = false;
    $scope.disabledUpdate = false;    
    $scope.SetFormValues = function (data) {
        $scope.readonly = true;
        $scope.Sample = data.Sample;
            $scope.Sample.SampleTypeNumber = data.Sample.SampleTypeNumber.toString();
            $scope.Sample.CostTypeNumber = data.Sample.CostTypeNumber.toString();
            $scope.Sample.DateReceived = new Date(parseInt(data.Sample.DateReceived.replace(/(^.*\()|([+-].*$)/g, ''))).toISOString().substring(0, 10);
            $scope.Sample.DateReported = new Date(parseInt(data.Sample.DateReported.replace(/(^.*\()|([+-].*$)/g, ''))).toISOString().substring(0, 10);
        $scope.Customer = data.Customer;            
            angular.element("#acoGrower").autocomplete({ source: data.Customer.Growers, minLength: 0 }).focus(function () { $(this).autocomplete("search"); });
        $scope.SampleTypes = data.SampleTypes;
        $scope.SampleColumns = data.SampleColumns;
        $scope.Messages = data.Messages;
        // if stn is soil or bio
        if ($scope.Sample.SampleTypeNumber == 1 || $scope.Sample.SampleTypeNumber == 14) {
            if (data.SoilSample != null) {
                $scope.SoilSample = data.SoilSample;
                $scope.SoilSample.PastCropNumber = data.SoilSample.PastCropNumber.toString();
                if ($scope.SoilSample.TopSoil == 1) {
                    $scope.chkTopSoil = true;
                }
                if ($scope.SoilSample.BeginningDepth == 0) {
                    $scope.soilsampleLink = false;
                    $scope.chkLinkToSoil = false;
                    $scope.chkTopSoil = true;
                } else {
                    $scope.soilsampleLink = true;
                    $scope.chkLinkToSoil = true;
                    $scope.chkTopSoil = false;
                }
                $scope.TopSoils = data.TopSoils;
                $scope.SoilSamples = data.SoilSamples;
                $scope.RecTypes = data.RecTypes;
                $scope.CropTypes = data.CropTypes;
                $scope.PastCrops = data.PastCrops;
            
                if ($scope.Sample.SampleTypeNumber == 1) {
                    $scope.RecTypes = data.RecTypes;
                }
                $scope.CropTypes = data.CropTypes;
                if (data.Recommendations != null && data.Recommendations.length != 0) {
                    $scope.Recommendations = data.Recommendations;
                    if ($scope.Sample.SampleTypeNumber == 14) {
                        for (var i = 0; i < $scope.Recommendations.length; i++) {
                            var id = '#acoRecTypes' + i;
                            $scope.Recommendations[i].RecTypeName = '4 - Haney';
                            angular.element(id).attr('disabled', true);
                        }
                    }
                }
            } // if stn is Feed, NIR, Water, Manure, Slurry, Fertilizer, Resin, Plant
        } else if ($scope.Sample.SampleTypeNumber == 2 || $scope.Sample.SampleTypeNumber == 3 || $scope.Sample.SampleTypeNumber == 4 || $scope.Sample.SampleTypeNumber == 6 || $scope.Sample.SampleTypeNumber == 7 || $scope.Sample.SampleTypeNumber == 9 || $scope.Sample.SampleTypeNumber == 12 || $scope.Sample.SampleTypeNumber == 5)
        {
            $scope.SubSampleTypes = data.SubSampleTypes;
            $scope.SubSubSampleType = {};
            $scope.SubSubSampleTypes = [];
        }
        console.log("End of setformvalues");
    };
    $scope.SetRecLayout = function () {
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
    $scope.Load = function (stn) {
        $http.get("/SampleModels/Load?sampleTypeNumber=" + stn).success(function (data) {
            $scope.Samples = data;
            console.log($scope.Samples[0]);
            $scope.SetFormValues($scope.Samples[0]);
            $scope.SetRecLayout();
            return;
        }).error(function () { console.log("Load module - ajax call returned error"); return; });
    };
    $scope.Load(1); // Change to load last sampletype in cache

    /* --------------- Validation scripts ------------- */

    $scope.ValidateForm = function () {
        // Validate sample entry
        if ($scope.entryForm.$invalid) {
            if ($scope.entryForm.cboCostType.$invalid) {
                $scope.DisplayPopover("cboSampleTypeNumber", "Required field");
                angular.element('#cboSampleTypeNumber').addClass('has-error');
            }
            if ($scope.entryForm.txtCustomerNumber.$invalid) {
                $scope.DisplayPopover("txtCustomerNumber", "Must be numeric");
                angular.element('#txtCustomerNumber').addClass('has-error');
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
        if ($scope.IsPresent($scope.SoilSample.LinkedSampleLab) && $scope.SoilSample.LinkedSampleBatch != $scope.Sample.BatchNumber)
        {
            $scope.DisplayPopover("txtLinkSoilBatch", "Must match BatchNumber");
            angular.element('#txtLinkSoilBatch').addClass('has-error');
            valid = false;
        }
        if ($scope.IsPresent($scope.SoilSample.LinkedSampleBatch) && isNaN($scope.SoilSample.LinkedSampleLab) && $scope.SoilSample.LinkedSampleLab != "")
        {
            $scope.DisplayPopover("txtLinkSoilLab", "Must be numeric");
            angular.element('#txtLinkSoilLab').addClass('has-error');
            valid = false;
        }            

        // Validate Sample Recs
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
            angular.element('input[id=acoGrower]').controller('ngModel').$setViewValue(angular.element('input[id=acoGrower]').val());
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
        $scope.RemovePopover('txtCustomerNumber');
        angular.element('#txtCustomerNumber').removeClass('has-error');
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
    $scope.ValidateSoilSample = function () {
        var valid = true;
        if ($scope.IsPresent($scope.SoilSample.BeginningDepth) && $scope.IsPresent($scope.SoilSample.EndingDepth) && $scope.IsPresent($scope.SoilSample.PastCropNumber)) {
            if ($scope.SoilSample.TopSoil = 1) {
                if (!$scope.IsPresent($scope.SoilSample.LinkedSampleBatch) || !$scope.IsPresent($scope.SoilSample.LinkedSampleBatch)) {
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
        $scope.ValidateSoilSample();
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

    /*---------------- Ajax calls for Customer, Grower, ReportName, SubSubSampleTypes -------------*/

    $scope.FindCustomer = function () {
        if ($scope.entryForm.txtCustomerNumber.$valid) {
            $http.get("/SampleModels/FindCustomer?cn=" + $scope.Sample.CustomerNumber + "&stn=" + $scope.Sample.SampleTypeNumber)
                .success(function (data) {
                    if (data != null) {
                        $scope.Customer.Name = data.Name;
                        $scope.Customer.Company = data.Company;
                        $scope.Customer.Address1 = data.Address1;
                        $scope.Customer.CityStZip = data.CityStZip;
                        $scope.Customer.SampleEntryInformation = data.SampleEntryInformation;
                        $scope.Customer.Growers = data.Growers;
                        angular.element("#acoGrower").autocomplete({ source: $scope.Customer.Growers, minLength: 0, delay: 0 }).focus(function () { $(this).autocomplete("search"); });
                        $scope.RemovePopover('txtCustomerNumber');
                    } else {
                        $scope.Customer = {};
                        $scope.Sample.Grower = "";
                        angular.element("#acoGrower").autocomplete({ source: [] });
                        $scope.Customer.Name = "Customer Not Found";
                        $scope.RemovePopover('txtCustomerNumber');
                        $scope.DisplayPopover('txtCustomerNumber', 'Customer does NOT exist');
                        angular.element('#txtCustomerNumber').focus();                        
                    }
                });
        } else {
            $scope.Validate($scope.entryForm.txtCustomerNumber, 'txtCustomerNumber', 'Must be numeric');
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
    $scope.GetSubSubSampleTypes = function () {
        console.log("stn: " + $scope.Sample.SampleTypeNumber + ", sstn: " + $scope.SubSampleType.SubSampleTypeNumber);
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
    }

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
    }

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
            if ($scope.entryForm.txtCustomerNumber.$valid && $scope.entryForm.txtBatchNumber.$valid && $scope.entryForm.txtLabNumber.$valid) {
                $scope.DeleteSample();
                return;
            } else {
                if ($scope.entryForm.txtCustomerNumber.$invalid) {
                    $scope.DisplayPopover("txtCustomerNumber", "Must be numeric");
                    angular.element('#txtCustomerNumber').addClass('has-error');
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
            if ($scope.ValidateRecs()) {
                $scope.SampleRecs = $scope.ConvertRecs();
                if (action == 'add') {
                    $scope.AddSample();
                } else if (action == 'update') {
                    $scope.UpdateSample();
                }
                $scope.disabled = true;
                $scope.disabledUpdate = false;
            }            
        }
    };

    /*------------------- Misc dynamic form actions -----------------*/

    $scope.Change = function () {
        if ($scope.action != 'find') {
            var stn = parseInt(angular.element('#cboSampleType').val());
            $scope.ClearForm();
            $scope.Load(stn);
        }        
    };
    $scope.CancelAction = function () {
        $scope.Load(1); // Change to load last sampletype in cache
        $scope.readonly = true;
        $scope.disabled = false;
        $scope.disabledUpdate = false;
        $scope.action = "";
        $scope.RemoveValidation();
    };
    $scope.ClearForm = function () {
        console.log("inside ClearForm()");
        var stn = $scope.Sample.SampleTypeNumber;
        $scope.Sample = {};
        $scope.Sample.SampleTypeNumber = stn;
        $scope.Customer = {};
        $scope.SoilSample = {};
        $scope.SoilSamples = {};
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
            $scope.SoilSample = {};
            $scope.SoilSamples = {};
            $scope.SoilSample.BeginningDepth = 0;
            $scope.Recommendations = [];
            $scope.BuildRec();
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
            $scope.SoilSample.BeginningDepth = 0;
            angular.element('#txtEndDepth').focus();
        } else {
            $scope.SoilSample.BeginningDepth = "";
            angular.element('#txtBeginDepth').focus();
        }
    };

    /* -------------------- Setting values -----------------------*/

    $scope.SetSoilSample = function () {
        $scope.SoilSample.BatchNumber = $scope.Sample.BatchNumber;
        $scope.SoilSample.LabNumber = $scope.Sample.LabNumber;
        if (angular.element('input[id=chkTopSoil]:checked')) {
            $scope.SoilSample.TopSoil = 1;
            $scope.SoilSample.LinkedSampleBatch = 0;
            $scope.SoilSample.LinkedSampleLab = 0;
        } else {
            $scope.SoilSample.TopSoil = 0;
            $scope.SoilSample.LinkedSampleBatch = $scope.SoilSample.LinkedSampleBatch;
            $scope.SoilSample.LinkedSampleLab = $scope.SoilSample.LinkedSampleLab;
        }
    }

    /* -------------- Find, Add, Update, Delete ------------------*/

    $scope.FindSample = function () {
        $http({
            method: 'POST',
            url: '/SampleModels/FindSample',
            data: { 'sampleTypeNumber': $scope.Sample.SampleTypeNumber, 'labNumber': $scope.Sample.LabNumber, 'batchNumber': $scope.Sample.BatchNumber }
        })
          .success(function (data) {
              if (data.Sample != null) {
                  $scope.SetFormValues(data);
                  $scope.SetRecLayout();
                  $scope.Messages = [];
              } else {
                  angular.element("#txtLabNumber").focus();
              }
          })
          .error(function () { });
    };
    $scope.AddSample = function () {
        $scope.SetSoilSample();
        $http({
            method: 'POST',
            url: '/SampleModels/AddSample',
            data: { 'sampleView': $scope.Sample, 'soilSample': $scope.SoilSample, 'sampleRecs': $scope.SampleRecs }
        })
          .success(function (data) {
              console.log("add was success");
              if (data != null) {
                  console.log("before setformvalues");
                  $scope.SetFormValues(data);
                  console.log("before setformvalues");
              } else {
                  console.log("data not null");
                  $scope.Load($scope.Sample.SampleTypeNumber);
              }
          })
          .error(function () { console.log("Error on AddSample")});
    };
    $scope.UpdateSample = function () {
        $scope.SetSoilSample();
        console.log($scope.Sample);
        $http({
            method: 'POST',
            url: '/SampleModels/UpdateSample',
            data: { 'sampleView': $scope.Sample, 'soilSample': $scope.SoilSample, 'sampleRecs': $scope.SampleRecs }
        })
          .success(function (data) {
              $scope.SetFormValues(data);
          })
          .error(function () { });
    };
    $scope.DeleteSample = function () {
        $http({
            method: 'POST',
            url: '/SampleModels/DeleteSample',
            data: { 'sampleTypeNumber': $scope.Sample.SampleTypeNumber, 'batchNumber': $scope.Sample.BatchNumber, 'labNumber': $scope.Sample.LabNumber }
        })
          .success(function (data) {
              $scope.Load($scope.Sample.SampleTypeNumber);
              console.log("Sample Deleted success");
          })
          .error(function () { });
    };
    $scope.Next = function (ln) {
        var found = false;
        var i = 0;
        while (!found) {
            if ($scope.Samples[i].Sample.LabNumber == ln) {
                found = true;
            }
        }
        if (found && i != 14) {
            $scope.SetFormValues($scope.Samples[i + 1]);
        }
        else {
            $http({
                method: 'POST',
                url: '/SampleModels/Next',
                data: { 'sample': $scope.Sample }
            })
          .success(function (data) {
              $scope.Samples = data;
              $scope.SetFormValues($scope.Sample[0]);
          })
          .error(function () { });
        }
    };
    $scope.Prev = function () {
        var found = false;
        var i = 0;
        while (!found) {
            if ($scope.Samples[i].Sample.LabNumber == ln) {
                found = true;
            }
        }
        if (found && i != 0) {
            $scope.SetFormValues($scope.Samples[i - 1]);
        }
        else {
            $http({
                method: 'POST',
                url: '/SampleModels/Prev',
                data: { 'sample': $scope.Sample }
            })
          .success(function (data) {
              $scope.Samples = data;
              $scope.SetFormValues($scope.Sample[0]);
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
})
 .directive('autoComplete', function () {
     return {
         restrict: 'A',
         link: function (scope, element, attrs) {
             var data = scope[attrs["autoComplete"]];
             function checkAvailable(term) {
                 var length = term.length,
                     chck = false,
                     term = term.toUpperCase();
                 //for (var i = 0, z = data.length; i < z; i++) {
                 //    var start = data[i].indexOf("-") + 2;
                 //    if (data[i].substring(start, start + length).toUpperCase() === term || data[i].substring(0, length).toUpperCase() === term) {
                 //        return true;
                 //    }
                 //}
                 return false;
             }
             element.on("keyup", function (event) {
                 var ac_value = this.value;
                 if (!checkAvailable(ac_value)) {
                     this.value = ac_value.substring(0, ac_value.length - 1);
                     angular.element(this).autocomplete("search", this.value);
                 }
             }).autocomplete({
                 source: data,
                 minLength: 0,
                 delay: 0,
                 autoFocus: true
             }).focus(function () {
                 angular.element(this).autocomplete("search");
             });
         }
     };
 });