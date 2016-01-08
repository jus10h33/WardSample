var samplesEntry = angular.module("samplesEntry", [])
.controller("defaultCtrl", function ($scope, $http) {

    /* ------------ OnLoad -------------*/

    $scope.Sample = {};
    $scope.Customer = {};
    $scope.SoilSample = {};
    $scope.entryForm = {};
    $scope.SampleRecs = [];
    $scope.Recommendations = [];
    $scope.regNumeric = new RegExp("^[0-9]+$");
    $scope.regBatch = new RegExp('20(0[6-9]|[1-9][0-9])(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])');
    $scope.regDate = new RegExp('^20(0[7-9]|[1-9][0-9])-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$');
    $scope.required = true;
    $scope.readonly = true; // Change this to true ------------------
    $scope.disabled = false; // Change this to false ------------------
    $scope.disabledUpdate = false; // Change this to false -----------
    $scope.SetFormValues = function (data) {
        $scope.readonly = true; // Change this to true ------------------
        
        $scope.Sample = data.Sample;
            $scope.Sample.SampleTypeNumber = data.Sample.SampleTypeNumber.toString();
            $scope.Sample.CostTypeNumber = data.Sample.CostTypeNumber.toString();
            $scope.Sample.DateReceived = new Date(parseInt(data.Sample.DateReceived.replace(/(^.*\()|([+-].*$)/g, ''))).toISOString().substring(0, 10);
            $scope.Sample.DateReported = new Date(parseInt(data.Sample.DateReported.replace(/(^.*\()|([+-].*$)/g, ''))).toISOString().substring(0, 10);
        $scope.Customer = data.Customer;
        $scope.SampleTypes = data.SampleTypes;
        $scope.Growers = data.Growers;
        $scope.SampleColumns = data.SampleColumns;
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
            $scope.SoilSamples = data.SoilSamples;
            $scope.RecTypes = data.RecTypes;
            $scope.CropTypes = data.CropTypes;
            $scope.PastCrops = data.PastCrops;
            if ($scope.Sample.SampleTypeNumber == 1 || $scope.Sample.SampleTypeNumber == 14) {
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
            }
        }
                
        $scope.Messages = data.Messages;                
        angular.element("#acoGrower").autocomplete({ source: data.Growers, minLength: 0 }).focus(function () { $(this).autocomplete("search"); });
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
            $scope.SetFormValues(data);
            $scope.SetRecLayout();
            return;
        }).error(function () { console.log("Load module - ajax call returned error"); return; });
    };
    $scope.Load(1); //Load soil by default    

    /* --------------- Validation scripts ------------- */

    $scope.ValidateForm = function () {
        if ($scope.entryForm.$invalid) {
            if ($scope.entryForm.cboCostType.$invalid) {
                $scope.DisplayPopover("cboSampleTypeNumber", "Required field");
                angular.element('#cboSampleTypeNumber').addClass('has-error');
            } else {
                console.log("1");
            }
            if ($scope.entryForm.txtCustomerNumber.$invalid) {
                $scope.DisplayPopover("txtCustomerNumber", "Must be numeric");
                angular.element('#txtCustomerNumber').addClass('has-error');
            } else {
                console.log("2");
            }
            if ($scope.entryForm.txtBatchNumber.$invalid) {
                $scope.DisplayPopover("txtBatchNumber", "Must be correct format [yyyymmdd]");
                angular.element('#txtBatchNumber').addClass('has-error');
            } else {
                console.log("3");
            }
            if ($scope.entryForm.txtLabNumber.$invalid) {
                $scope.DisplayPopover("txtLabNumber", "Must be numeric");
                angular.element('#txtLabNumber').addClass('has-error');
            } else {
                console.log("4");
            }
            if ($scope.entryForm.txtReportTypeNumber.$invalid) {
                $scope.DisplayPopover("txtReportTypeNumber", "Must be numeric");
                angular.element('#txtReportTypeNumber').addClass('has-error');
            } else {
                console.log("5");
            }
            if ($scope.entryForm.acoGrower.$invalid) {
                $scope.DisplayPopover("acoGrower", "Required field");
                angular.element('#acoGrower').addClass('has-error');
            } else {
                console.log("6");
            }
            if ($scope.entryForm.txtSampleID1.$invalid) {
                $scope.DisplayPopover("txtSampleID1", "Required field");
                angular.element('#txtSampleID1').addClass('has-error');
            } else {
                console.log("7");
            }
            if ($scope.entryForm.txtSampleID2.$invalid) {
                $scope.DisplayPopover("txtSampleID2", "Required field");
                angular.element('#txtSampleID2').addClass('has-error');
            } else {
                console.log("8");
            }
            if ($scope.entryForm.dpkDateReceived.$invalid) {
                $scope.DisplayPopover("dpkDateReceived", "Required field [yyyy-mm-dd]");
                angular.element('#dpkDateReceived').addClass('has-error');
            } else {
                console.log("9");
            }
            if ($scope.entryForm.dpkDateReported.$invalid) {
                $scope.DisplayPopover("dpkDateReported", "Required field [yyyy-mm-dd]");
                angular.element('#dpkDateReported').addClass('has-error');
            } else {
                console.log("10");
            }
            if ($scope.Sample.DateReceived > $scope.Sample.DateReported) {
                $scope.entryForm.dpkDateReported.$invalid = true;
                $scope.DisplayPopover("dpkDateReported", "Must be greater than Date Received");
                angular.element('#dpkDateReported').addClass('has-error');
            } else {
                console.log("11");
            }
            if ($scope.entryForm.cboCostTypeNumber.$invalid) {
                $scope.DisplayPopover("cboCostType", "Required field");
                angular.element('#cboCostType').addClass('has-error');
            } else {
                console.log("12");
            }
            angular.element("form[id='entryForm']").find('.ng-invalid:first').focus();
            console.log("false");
            return false;
        } else {
            console.log("true");
            return true;
        }
    };
    $scope.Validate = function (elem, id, message) {
        //if (angular.isDefined(elem)) {
        $('input[id=acoGrower]').each(function () {
            angular.element(this).controller('ngModel').$setViewValue($(this).val());
        });
        console.log("set Grower: " + angular.element('input[id=acoGrower]').val());
        if (elem.$invalid && elem.$dirty) {
            $scope.DisplayPopover(id, message);
            id = "#" + id;
            angular.element(id).addClass('has-error');
        } else if (elem.$valid && elem.$dirty) {
            $scope.RemovePopover(id);
            id = "#" + id;
            angular.element(id).removeClass('has-error');
        }
        // }
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
    };
    $scope.ValidateSampleDates = function () {
        if ($scope.entryForm.dpkDateReceived.$invalid || $scope.entryForm.dpkDateReported.$invalid || ($scope.Sample.DateReceived > $scope.Sample.DateReported)) {
            if ($scope.entryForm.dpkDateReceived.$invalid) {
                $scope.Validate($scope.entryForm.dpkDateReceived, 'dpkDateRecieved', 'Required form [yyyy-mm-dd]');
            } else if ($scope.entryForm.dpkDateReported.$invalid) {
                $scope.Validate($scope.entryForm.dpkDateReported, 'dpkDateReported', 'Required form [yyyy-mm-dd]');
                angular.element('#dpkDateReported').addClass('has-error');
            } else {
                $scope.Validate($scope.entryForm.dpkDateReported, 'dpkDateReported', 'Must be greater than Date Received');
                angular.element('#dpkDateReported').addClass('has-error');
            }
        } else {
            $scope.RemovePopover('dpkDateReceived');
            angular.element('#dpkDateReceived').removeClass('has-error');
            $scope.RemovePopover('dpkDateReported');
            angular.element('#dpkDateReported').removeClass('has-error');
        }
    };
    $scope.ValidateRecType = function (index, type) {
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
                    if (types[i].substring((types[i].indexOf("-") + 2)) == value || types[i] == value) {
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
        } else {
            angular.element(recID).focus();
        }
    };

    /*---------------- Ajax calls for Customer, Grower, ReportName -------------*/

    $scope.FindCustomer = function () {
        if ($scope.entryForm.txtCustomerNumber.$valid) {
            $http.get("/SampleModels/FindCustomer?customerNumber=" + $scope.Sample.CustomerNumber)
                .success(function (data) {
                    if (data != "Customer Not Found") {
                        $scope.Customer.Name = data.Name;
                        $scope.Customer.Company = data.Company;
                        $scope.Customer.Address1 = data.Address1;
                        $scope.Customer.CityStZip = data.CityStZip;
                        $scope.Customer.SampleEntryInformation = data.SampleEntryInformation;
                        if ($scope.entryForm.cboSampleType.$valid) {
                            $scope.RemovePopover('txtCustomerNumber');
                            $scope.GetGrower();
                        }
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
    $scope.GetGrower = function () {
        var rf = [];
        $http.get("/SampleModels/GetGrower?customerNumber=" + $scope.Sample.CustomerNumber + "&sampleTypeNumber=" + $scope.Sample.SampleTypeNumber)
        .success(function (data) {
            data.forEach(function (data) {
                rf.push({
                    value: data
                })
            })
        })
        .error(function () { });
        angular.element("#acoGrower").autocomplete({
            source: rf,
            minLength: 0,
            delay: 0
        }).focus(function () {
            $(this).autocomplete("search");
        });
    };
    $scope.GetReportName = function () {
        if ($scope.entryForm.txtReportTypeNumber.$valid) {
            $http.get('/SampleModels/GetReportName?sampleTypeNumber=' + $scope.Sample.SampleTypeNumber + '&reportTypeNumber=' + $scope.Sample.ReportTypeNumber)
          .success(function (data) {
              if (data != null) {
                  $scope.entryForm.txtReportTypeNumber.$valid = true;
                  $scope.entryForm.txtReportTypeNumber.$invalid = false;
                  angular.element('#txtReportTypeNumber').popover('hide');
                  $scope.Sample.ReportName = data;
              } else {
                  $scope.entryForm.txtReportTypeNumber.$valid = false;
                  $scope.entryForm.txtReportTypeNumber.$invalid = true;
                  angular.element('#txtReportTypeNumber').prop('data-content', "Report does NOT exist");
                  angular.element('#txtReportTypeNumber').popover('show');
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
            $scope.Validate($scope.entryForm.txtReportTypeNumber, 'txtReportTypeNumber', 'Must be numeric');
        }
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

    /* -------------- Methods handling rec actions -----------------*/

    $scope.RemoveRec = function (index) {
        $scope.Recommendations.splice(index, 1);
    };
    $scope.BuildRec = function () {
        var recLength = $scope.Recommendations.length;
        var newRec = {
            LabNumber: $scope.Sample.LabNumber,
            BatchNumber: $scope.Sample.BatchNumber,
            Priority: 0,
            RecTypeNumber: 0,
            RecTypeName: "",
            CropTypeNumber: 0,
            CropTypeName: "",
            YieldGoal: ""
        }
        if (recLength != 0) {
            newRec.Priority = $scope.Recommendations[recLength - 1].Priority + 1;
        }
        $scope.Recommendations.push(newRec);
    };
    $scope.AddRec = function () { // build rec and then place focus on RecType input for added rec
        $scope.BuildRec();
        var recLength = $scope.Recommendations.length;
        var pos = '#acoRecTypes' + (recLength - 1);
        angular.element(pos).focus();
    };
    var idx = 0;
    $scope.ConvertRecs = function () {
        $('input[auto-complete]').each(function () {
            angular.element(this).controller('ngModel').$setViewValue($(this).val());
        });
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
        return $scope.SampleRecs;
    };

    /*-------------- Form Submission --------------*/

    $scope.SubmitForm = function (action) {
        if (action == 'find') {
            if ($scope.entryForm.cboSampleType.$valid && $scope.entryForm.txtBatchNumber.$valid && $scope.entryForm.txtLabNumber.$valid) {
                $scope.FindSample();
                return;
            } else {
                if ($scope.entryForm.cboSampleType.$invalid) {
                    $scope.DisplayPopover("cboSampleTypeNumber", "Required field");
                    angular.element('#cboSampleTypeNumber').addClass('has-error');
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
            console.log("ValidateForm()");
            $scope.SampleRecs = $scope.ConvertRecs();
            if (action == 'add') {
                $scope.AddSample();
            } else if (action == 'update') {
                $scope.UpdateSample();
            }
        }
    };

    /*------------------- Misc dynamic form actions -----------------*/

    $scope.Change = function () {
        var stn = parseInt(angular.element('#cboSampleType').val());
        console.log("1: " + angular.element('#cboSampleType').val());
        console.log("2: " + $scope.Sample.SampleTypeNumber);
        $scope.ClearForm();
        $scope.Load(stn);
    };
    $scope.CancelAction = function () {
        $scope.Load($scope.Sample.SampleTypeNumber);
        $scope.readonly = true;
        $scope.disabled = false;
        $scope.disabledUpdate = false;
        $scope.action = '';
        $scope.RemoveValidation();
    };
    $scope.ClearForm = function () {
        $scope.Sample = {};        
        $scope.Customer = {};
        $scope.SoilSample = {};
        $scope.SoilSamples = {};
        $scope.Recommendations = [];
        angular.element("#acoGrower").autocomplete({ source: [] });
        $scope.RemoveValidation();
    };
    $scope.ToggleButtons = function (action) {
        $scope.readonly = false;
        if (action == 'find') {
            $scope.ClearForm();
            $scope.disabled = true;
            $scope.action = 'find';
            $scope.RemoveValidation();
        } else if (action == 'add') {
            $scope.disabled = false;
            $scope.disabledUpdate = false;
            $scope.action = 'add';
            angular.element('#txtSampleID1').focus();
            $scope.Sample.InvoiceNumber = "";
            $scope.Sample.LabNumber++;
            $scope.Sample.SampleID1 = "";
            $scope.Sample.SampleID2 = "";
            $scope.Sample.SampleID3 = "";
            $scope.Sample.SampleID4 = "";
            $scope.Sample.SampleID5 = "";
            angular.element('#chkTopSoil').prop('checked', false);
            $scope.SoilSample = {};
            $scope.SoilSamples = {};
            $scope.Recommendations = [];
            for (var i = 0; i < 3; i++) {
                $scope.BuildRec();
            }
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
        }
    };
    $scope.SetDateReported = function () {
        if ($scope.entryForm.txtBatchNumber.$invalid) {
            $scope.Validate($scope.entryForm.txtBatchNumber, 'txtBatchNumber', 'Required format is [yyyymmdd]');
        } else {
            if ($scope.Sample.DateReported != ""/* && !$scope.ValidDateReported()*/) {
                $scope.Sample.DateReported = $scope.Sample.BatchNumber.toString().substring(0, 4) + "-" + $scope.Sample.BatchNumber.toString().substring(4, 6) + "-" + $scope.Sample.BatchNumber.toString().substring(6, 8);
            }
        }
    };
    $scope.SetDepth = function () {
        if (angular.element('input[id=chkTopSoil]:checked')) {
            $scope.SoilSample.BeginningDepth = 0;
            angular.element('#txtEndDepth').focus();
        } else {
            $scope.SoilSample.BeginningDepth = "";
            angular.element('#txtBeginDepth').focus();
        }
    };

    /* -------------- Find, Add, Update, Delete ------------------*/

    $scope.FindSample = function () {
        $http({
            method: 'POST',
            url: '/SampleModels/FindSample',
            data: { 'sampleTypeNumber': $scope.Sample.SampleTypeNumber, 'batchNumber': $scope.Sample.BatchNumber, 'labNumber': $scope.Sample.LabNumber }
        })
          .success(function (data) {
              if (data.Sample != null) {
                  $scope.SetFormValues(data);
              } else {
                  angular.element("#txtLabNumber").focus();
                  alert("Sample not found");
              }
          })
          .error(function () { });
    };
    $scope.AddSample = function () {
        $scope.sample.ReportTypeNumber = $scope.report.ReportTypeNumber;
        $scope.soilSample.BatchNumber = $scope.sample.BatchNumber;
        $scope.soilSample.LabNumber = 0;
        if (angular.element('input[id=chkTopSoil]:checked')) {
            $scope.SoilSample.TopSoil = 1;
            $scope.SoilSample.LinkedSampleBatch = 0;
            $scope.SoilSample.LinkedSampleLab = 0;
        } else {
            $scope.SoilSample.TopSoil = 0;
        }
        $http({
            method: 'POST',
            url: '/SampleModels/AddSample',
            data: { 'sample': $scope.Sample, 'soilSample': $scope.SoilSample, 'sampleRecs': $scope.SampleRecs }
        })
          .success(function (data) {
              if (data != null) {
                  $scope.Load($scope.Sample.SampleTypeNumber);
              } else {
                  $scope.Load(1);
              }
          })
          .error(function () { });
    };
    $scope.UpdateSample = function () {
        console.log("UpdateSample");
        console.log($scope.SampleRecs);
        $scope.Sample.ReportTypeNumber = $scope.Sample.ReportTypeNumber;
        $http({
            method: 'POST',
            url: '/SampleModels/UpdateSample',
            data: { 'sample': $scope.Sample, 'soilSample': $scope.SoilSample, 'sampleRecs': $scope.SampleRecs }
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
              $scope.Load();
              console.log("Sample Deleted success");
          })
          .error(function () { });
    };

})
.directive('autoComplete', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var data = scope[attrs["autoComplete"]];
            element.autocomplete({
                source: data,
                minLength: 0,
                delay: 0
            }).focus(function () {
                angular.element(this).autocomplete("search");
            });
        }
    };
});