var samplesEntry = angular.module("samplesEntry", [])
.controller("defaultCtrl", function ($scope, $http) {

    /* ------------ OnLoad -------------*/

    $scope.entry = {};
    $scope.entryForm = {};
    $scope.sampleRecs = [];
    $scope.regNumeric = new RegExp("^[0-9]+$");
    $scope.regBatch = new RegExp('20(0[6-9]|[1-9][0-9])(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])');
    $scope.regDate = new RegExp('^20(0[7-9]|[1-9][0-9])-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$');
    $scope.required = true;
    $scope.readonly = true; // Change this to true ------------------
    $scope.disabled = false; // Change this to false ------------------
    $scope.disabledUpdate = false; // Change this to false -----------
    $scope.SetFormValues = function (data) {
        $scope.readonly = true; // Change this to true ------------------
        $scope.entry = data;
        console.log(data);
        $scope.entry.SampleTypeNumber = data.SampleTypeNumber.toString();
        $scope.entry.CostType = data.StandardCost.toString();
        $scope.entry.DateReceived = new Date(parseInt(data.DateReceived.replace(/(^.*\()|([+-].*$)/g, ''))).toISOString().substring(0, 10);
        angular.element("#acoGrower").autocomplete({ source: data.Growers, minLength: 0 }).focus(function () { $(this).autocomplete("search"); });
        $scope.entry.DateReported = new Date(parseInt(data.DateReported.replace(/(^.*\()|([+-].*$)/g, ''))).toISOString().substring(0, 10);
        $scope.entry.PastCropNumber = $scope.entry.PastCropNumber.toString();
        if ($scope.entry.TopSoil == 1) {
            $scope.chkTopSoil = true;
        }
        if ($scope.entry.BeginningDepth == 0) {
            $scope.soilsampleLink = false;
            $scope.chkLinkToSoil = false;
            $scope.chkTopSoil = true;
        } else {
            $scope.soilsampleLink = true;
            $scope.chkLinkToSoil = true;
            $scope.chkTopSoil = false;
        }
        $scope.entry.PastCrops = data.PastCrops;
        if ($scope.entry.SampleTypeNumber == 1) {
            if ($scope.entry.SampleTypeNumber == 1) {
                $scope.entry.RecTypes = data.RecTypes;
            }
            else {
                $scope.entry.RecTypes = {};
            }

            if (data.Recommendations != null && data.Recommendations.length != 0) {
                $scope.recommendations = data.Recommendations;
                if ($scope.entry.SampleTypeNumber == 14) {
                    for (var i = 0; i < $scope.entry.Recommendations.length; i++) {
                        var id = '#acoRecTypes' + i;
                        $scope.entry.Recommendations[i].RecTypeName = '4 - Haney';
                        angular.element(id).attr('disabled', true);
                    }
                }
                $scope.isrecs = true;
            } else {
                $scope.isrecs = false;
            }
        }
    };
    $scope.SetRecLayout = function () {
        switch ($scope.entry.SampleTypeNumber) {
            //Soil
            case "1":
                $scope.rightSide = true;
                $scope.SoilSampleLink = false;
                $scope.linkToSoil = false;
                $scope.partialview = "../Content/partialviews/partialSoil.html";
                break;
                //Biological
            case "14":
                $scope.rightSide = true;
                $scope.SoilSampleLink = true;
                $scope.linkToSoil = true;
                $scope.partialview = "../Content/partialviews/partialSoil.html";
                break;
                //Plant
            case "5":
                $scope.rightSide = true;
                $scope.partialview = "../Content/partialviews/partialPlant.html";
                break;
                //Feed, NIR, Water, Manure, Slurry, Fertilizer, Resin 
            case "2", "3", "4", "6", "7", "9", "12":
                $scope.rightSide = true;
                $scope.partialview = "../Content/partialviews/partialGeneric.html";
                //Potato, Herbicide, Wasterwater, Other
            case "10", "11", "8", "13":
                $scope.rightSide = false;
                $scope.partialview = "";
                break;
        }
    }
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
            if ($scope.entry.DateReceived > $scope.entry.DateReported) {
                $scope.entryForm.dpkDateReported.$invalid = true;
                $scope.DisplayPopover("dpkDateReported", "Must be greater than Date Received");
                angular.element('#dpkDateReported').addClass('has-error');
            } else {
                console.log("11");
            }
            if ($scope.entryForm.cboCostType.$invalid) {
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
        $scope.RemovePopover('cboCostType');
        angular.element('#cboCostType').removeClass('has-error');
    };
    $scope.ValidateSampleDates = function () {
        if ($scope.entryForm.dpkDateReceived.$invalid || $scope.entryForm.dpkDateReported.$invalid || ($scope.entry.DateReceived > $scope.entry.DateReported)) {
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
        console.log(index);
        var types = [];
        var recID = "";
        if (type == 'crop') {
            types = $scope.entry.CropTypes;
            recID = 'id=acoCropTypes' + index;
        } else {
            types = $scope.entry.RecTypes;
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
                console.log(value);
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
    }

    /*---------------- Ajax calls for Customer, Grower, ReportName -------------*/

    $scope.FindCustomer = function () {
        if ($scope.entryForm.txtCustomerNumber.$valid) {
            $http.get("/SampleModels/FindCustomer?customerNumber=" + $scope.entry.CustomerNumber)
                .success(function (data) {
                    if (data != "Customer Not Found") {
                        $scope.entry.Name = data.Name;
                        $scope.entry.Company = data.Company;
                        $scope.entry.Address1 = data.Address1;
                        $scope.entry.CityStZip = data.CityStZip;
                        $scope.entry.SampleEntryInformation = data.SampleEntryInformation;
                        if ($scope.entryForm.cboSampleType.$valid) {
                            $scope.RemovePopover('txtCustomerNumber');
                            $scope.GetGrower();
                        }
                    } else {
                        $scope.entry.Name = "Customer Not Found";
                        $scope.entry.Company = "";
                        $scope.entry.Address1 = "";
                        $scope.entry.CityStZip = "";
                        $scope.entry.SampleEntryInformation = "";
                        $scope.RemovePopover('txtCustomerNumber');
                        $scope.DisplayPopover('txtCustomerNumber', 'Customer does NOT exist');
                        angular.element('#txtCustomerNumber').focus();
                        $scope.entry.Grower = "";
                        angular.element("#acoGrower").autocomplete({ source: [] });
                    }
                });
        } else {
            $scope.Validate($scope.entryForm.txtCustomerNumber, 'txtCustomerNumber', 'Must be numeric');
        }
    };
    $scope.GetGrower = function () {
        var rf = [];
        $http.get("/SampleModels/GetGrower?customerNumber=" + $scope.entry.CustomerNumber + "&sampleTypeNumber=" + $scope.entry.SampleTypeNumber)
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
            $http.get('/SampleModels/GetReportName?sampleTypeNumber=' + $scope.entry.SampleTypeNumber + '&reportTypeNumber=' + $scope.entry.ReportTypeNumber)
          .success(function (data) {
              if (data != null) {
                  $scope.entryForm.txtReportTypeNumber.$valid = true;
                  $scope.entryForm.txtReportTypeNumber.$invalid = false;
                  angular.element('#txtReportTypeNumber').popover('hide');
                  $scope.entry.ReportName = data;
              } else {
                  $scope.entryForm.txtReportTypeNumber.$valid = false;
                  $scope.entryForm.txtReportTypeNumber.$invalid = true;
                  angular.element('#txtReportTypeNumber').prop('data-content', "Report does NOT exist");
                  angular.element('#txtReportTypeNumber').popover('show');
                  angular.element('#txtReportTypeNumber').focus();
                  $scope.entry.ReportTypeNumber = "Not Found";
              }
          })
          .error(function () {
              $scope.entry.ReportName = "Error";
              $scope.entryForm.txtReportTypeNumber.$valid = false;
              $scope.entryForm.txtReportTypeNumber.$invalid = true;
          })
        } else {
            $scope.Validate($scope.entryForm.txtReportTypeNumber, 'txtReportTypeNumber', 'Must be numeric');
        }
    };

    /*------------------Formatting -------------------*/

    $scope.FormatDates = function () {
        var dRec = $scope.entry.DateReceived;
        var dRep = $scope.entry.DateReported;
        var dRecTmp = new Date(dRec.substring(0, 4), dRec.substring(5, 7) - 1, dRec.substring(8, 10));
        $scope.entry.DateReceived = dRecTmp;
        var dRepTmp = new Date(dRep.substring(0, 4), dRep.substring(5, 7) - 1, dRep.substring(8, 10));
        $scope.entry.DateReported = dRepTmp;
    };

    /* -------------- Methods handling rec actions -----------------*/

    $scope.RemoveRec = function (index) {
        $scope.entry.Recommendations.splice(index, 1);
    }
    $scope.BuildRec = function () {
        var recLength = $scope.entry.Recommendations.length;
        var newRec = {
            LabNumber: $scope.entry.LabNumber,
            BatchNumber: $scope.entry.BatchNumber,
            Priority: 0,
            RecTypeNumber: 0,
            RecTypeName: "",
            CropTypeNumber: 0,
            CropTypeName: "",
            YieldGoal: ""
        }
        if (recLength != 0) {
            newRec.Priority = $scope.entry.Recommendations[recLength - 1].Priority + 1;
        }
        $scope.entry.Recommendations.push(newRec);
    }
    $scope.AddRec = function () { // build rec and then place focus on RecType input for added rec
        $scope.BuildRec();        
        var recLength = $scope.recommendations.length;
        var pos = '#acoRecTypes' + (recLength - 1);
        console.log(pos);
        angular.element(pos).focus();
    }
    var idx = 0;
    $scope.ConvertRecs = function () {
        $('input[auto-complete]').each(function () {
            angular.element(this).controller('ngModel').$setViewValue($(this).val());
        });
        for (var i = 0; i < $scope.entry.Recommendations.length; i++) {
            var newRec = {
                LabNumber: $scope.entry.LabNumber,
                BatchNumber: $scope.entry.BatchNumber,
                Priority: $scope.entry.Recommendations[idx].Priority,
                RecTypeNumber: $scope.entry.Recommendations[idx].RecTypeName.substring(0, $scope.entry.Recommendations[idx].RecTypeName.indexOf("-") - 1),
                CropTypeNumber: $scope.entry.Recommendations[idx].CropTypeName.substring(0, $scope.entry.Recommendations[idx].CropTypeName.indexOf("-") - 1),
                YieldGoal: $scope.entry.Recommendations[idx].YieldGoal
            };            
            $scope.sampleRecs.push(newRec);
            idx++;

        }
        return $scope.sampleRecs;
    }

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
            $scope.sampleRecs = $scope.ConvertRecs();
            if (action == 'add') {
                $scope.AddSample();
            } else if (action == 'update') {
                $scope.UpdateSample();
            }
        }
    };

    /*------------------- Misc dynamic form actions -----------------*/

    $scope.Change = function () {
        $scope.ClearForm();
        $scope.Load($scope.entry.SampleTypeNumber);        
    };
    $scope.CancelAction = function () {
        $scope.Load($scope.entry.SampleTypeNumber);
        $scope.readonly = true;
        $scope.disabled = false;
        $scope.disabledUpdate = false;
        $scope.action = '';
        $scope.RemoveValidation();
    }
    $scope.ClearForm = function () {
        $scope.tmpSampleTypes = $scope.entry.SampleTypes;
        $scope.entry = {};
        angular.element("#acoGrower").autocomplete({ source: [] });
        $scope.entry.SoilSample = {};
        $scope.entry.SoilSamples = {};
        $scope.entry.Recommendations = [];
        $scope.sampleRecs = [];
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
            $scope.entry.InvoiceNumber = "";
            $scope.entry.LabNumber++;
            $scope.entry.SampleID1 = "";
            $scope.entry.SampleID2 = "";
            $scope.entry.SampleID3 = "";
            $scope.entry.SampleID4 = "";
            $scope.entry.SampleID5 = "";
            angular.element('#chkTopSoil').prop('checked', false);
            $scope.entry.SoilSample = {};
            $scope.entry.SoilSamples = {};
            $scope.entry.Recommendations = [];
            for (var i = 0; i < 3; i++) {
                $scope.BuildRec();
            }
            $scope.RemoveValidation();
        } else if (action == 'update') {
            $scope.disabled = false;
            $scope.disabledUpdate = true;
            $scope.action = 'update';
            angular.element('#txtCustomerNumber').focus();
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
            if ($scope.entry.DateReported != ""/* && !$scope.ValidDateReported()*/) {
                $scope.entry.DateReported = $scope.entry.BatchNumber.toString().substring(0, 4) + "-" + $scope.entry.BatchNumber.toString().substring(4, 6) + "-" + $scope.entry.BatchNumber.toString().substring(6, 8);
            }
        }
    };
    $scope.SetDepth = function () {
        if (angular.element('input[id=chkTopSoil]:checked')) {
            $scope.entry.BeginningDepth = 0;
            angular.element('#txtEndDepth').focus();
        } else {
            $scope.entry.BeginningDepth = "";
            angular.element('#txtBeginDepth').focus();
        }
    }

    /* -------------- Find, Add, Update, Delete ------------------*/

    $scope.FindSample = function () {
        $http({
            method: 'POST',
            url: '/SampleModels/FindSample',
            data: { 'sampleTypeNumber': $scope.entry.SampleTypeNumber, 'batchNumber': $scope.entry.BatchNumber, 'labNumber': $scope.entry.LabNumber }
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
        $scope.entry.ReportTypeNumber;
        $scope.entry.BatchNumber;
        $scope.entry.LabNumber = 0;
        if (angular.element('input[id=chkTopSoil]:checked')) {
            $scope.entry.TopSoil = 1;
            $scope.entry.LinkedSampleBatch = 0;
            $scope.entry.LinkedSampleLab = 0;
        } else {
            $scope.entry.TopSoil = 0;
        }
        $http({
            method: 'POST',
            url: '/SampleModels/AddSample',
            data: { 'entry': $scope.entry }
        })
          .success(function (data) {
              if (data != null) {
                  $scope.Load($scope.entry.SampleTypeNumber);
              } else {
                  $scope.Load(1);
              }
          })
          .error(function () { });
    };
    $scope.UpdateSample = function () {
        console.log("UpdateSample");
        console.log($scope.sampleRecs);
        $scope.entry.ReportTypeNumber;
        $http({
            method: 'POST',
            url: '/SampleModels/UpdateSample',
            data: { 'entry': $scope.entry }
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
            data: { 'sampleTypeNumber': $scope.entry.SampleTypeNumber, 'batchNumber': $scope.entry.BatchNumber, 'labNumber': $scope.entry.LabNumber }
        })
          .success(function (data) {
              $scope.Load();
              console.log("Sample Deleted success");
          })
          .error(function () { });
    };

})
.directive('autoCompleteRec', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            //var data = scope[attrs["autoCompleteRec"]];
            element.autocomplete({
                source: scope.entry.RecTypes,
                minLength: 0
            }).focus(function () {
                angular.element(this).autocomplete("search");
            });
        }
    };
})
.directive('autoCompleteCrop', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            //var data = scope[attrs["autoCompleteCrop"]];
            element.autocomplete({
                source: scope.entry.CropTypes,
                minLength: 0
            }).focus(function () {
                angular.element(this).autocomplete("search");
            });
        }
    };
});