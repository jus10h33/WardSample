//(function () {
//    'use strict';


//    var findSampleCtlr1 = function ($scope, Sample, $stateParams) {
//        $scope.readonly = false;
//        //$scope.ClearForm();
//        $scope.disabled = true;
//        $scope.action = 'find';
//        $scope.rightSide = false; // hide sample info and recommendations
//        angular.element('#txtBatchNumber').val("");
//        angular.element('#txtLabNumber').val("");
//        angular.element('#txtBatchNumber').focus();
//    };

//    var findSampleCtlr2 = function ($scope, Sample, $stateParams) {

//        $scope.Sample.SampleTypeNumber = angular.element('#cboSampleType').val();
//        $scope.Sample.BatchNumber = angular.element('#txtBatchNumber').val();
//        $scope.Sample.LabNumber = angular.element('#txtLabNumber').val();

//        Sample.find($scope.Sample.SampleTypeNumber, $scope.Sample.BatchNumber, $scope.Sample.LabNumber).then(function (result) {
//            console.log(result);
//            //if (result.data != null) {
//            //    SetFormValues(result.data);
//            //    SetRecLayout();
//            //    ResetForm();
//            //} else {
//            //    angular.element("#txtLabNumber").focus();
//            //}
//        });
//    };


//    angular
//        .module("sampleEntry")
//        .controller("findSampleCtlr1", ['$scope', 'Sample', '$stateParams', findSampleCtlr1])
//        .controller("findSampleCtlr2", ['$scope', 'Sample', '$stateParams', findSampleCtlr2])
//        .controller("prevSampleCtlr", function ($scope, Sample, $stateParams) {
//            $scope.BeginPrev = function () {
//                $scope.readonly = false;
//                $scope.ClearForm();
//                $scope.readonly = true;
//            };
//            if (!$scope.disablePrev) {
//                console.log(ln);
//                $scope.disableNext = false;
//                var found = false;
//                while (!found && y >= 0 && y < $scope.Samples.length) {
//                    if ($scope.Samples[y].LabNumber == ln) {
//                        found = true;
//                    }
//                    y++;
//                }
//                if (found && y < $scope.Samples.length) {
//                    $scope.SetGenericValues($scope.Samples[y], $scope.Accounts[y], $scope.Messages);
//                    var stn = $scope.Samples[y].SampleTypeNumber;
//                    if (stn == 1 || stn == 14) {
//                        $scope.SetTopSoils(y);
//                        $scope.SetSampleChains(y);
//                        $scope.SetRecommendations(y);
//                    } else if (stn == 2 || stn == 3 || stn == 4 || stn == 5 || stn == 6 || stn == 7 || stn == 9 || stn == 12) {
//                        $scope.SetSubValues($scope.SubSampleInfos[y], $scope.SubSampleInfos);
//                    }
//                } else {
//                    Sample.prev($scope.Sample.SampleTypeNumber, $scope.Sample.BatchNumber, $scope.Sample.LabNumber).then(function (result) {
//                        if (angular.isDefined(result.data) && result.data != null && result.data != "") {
//                            y = 0
//                            $scope.SetGenericMasters(result.data.GenericInfo.Samples, result.data.GenericInfo.Accounts, $scope.SampleTypes, $scope.SampleColumns);
//                            $scope.SetGenericValues(result.data.GenericInfo.Samples[y], result.data.GenericInfo.Accounts[y], result.data.GenericInfo.Messages);
//                            var stn = $scope.Samples[y].SampleTypeNumber;
//                            if (stn == 1 || stn == 14) {
//                                $scope.TopSoilsList = result.data.TopSoils;
//                                $scope.SampleChainsList = result.data.SampleChains;
//                                $scope.RecommendationsList = result.data.Recommendations;
//                                $scope.SetRecommendations(y);
//                                $scope.SetTopSoils(y);
//                                $scope.SetSampleChains(y);
//                            } else if (stn == 2 || stn == 3 || stn == 4 || stn == 5 || stn == 6 || stn == 7 || stn == 9 || stn == 12) {
//                                $scope.SetSubValues(result.data.SubSampleInfos[y], result.data.SubSampleInfos);
//                            }
//                        } else {
//                            $scope.disablePrev = true;
//                            y = $scope.Samples.length - 1;
//                        }
//                    });
//                }
//            }
//        })
//        .controller("nextSampleCtlr", function ($scope, Sample, $stateParams) {
//            $scope.BeginNext = function () {
//                $scope.readonly = false;
//                $scope.ClearForm();
//                $scope.readonly = true;
//            };
//            if (!$scope.disableNext) {
//                console.log(ln);
//                $scope.disablePrev = false;
//                var found = false;
//                while (!found && y >= 0) {
//                    if ($scope.Samples[y].LabNumber == ln) {
//                        found = true;
//                    }
//                    y--;
//                }
//                if (found && y >= 0) {
//                    $scope.SetGenericValues($scope.Samples[y], $scope.Accounts[y], $scope.Messages);
//                    var stn = $scope.Samples[y].SampleTypeNumber;
//                    if (stn == 1 || stn == 14) {
//                        $scope.SetTopSoils(y);
//                        $scope.SetSampleChains(y);
//                        $scope.SetRecommendations(y);
//                    } else if (stn == 2 || stn == 3 || stn == 4 || stn == 5 || stn == 6 || stn == 7 || stn == 9 || stn == 12) {
//                        $scope.SetSubValues($scope.SubSampleInfos[y], $scope.SubSampleInfos);
//                    }
//                } else {
//                    Sample.next($scope.Sample.SampleTypeNumber, $scope.Sample.BatchNumber, $scope.Sample.LabNumber).then(function (result) {
//                        if (angular.isDefined(result.data) && result.data != null && result.data != "") {
//                            y = result.data.GenericInfo.Samples.length - 1;
//                            $scope.SetGenericMasters(result.data.GenericInfo.Samples, result.data.GenericInfo.Accounts, $scope.SampleTypes, $scope.SampleColumns);
//                            $scope.SetGenericValues(result.data.GenericInfo.Samples[y], result.data.GenericInfo.Accounts[y], result.data.GenericInfo.Messages);
//                            var stn = $scope.Samples[y].SampleTypeNumber;
//                            if (stn == 1 || stn == 14) {
//                                $scope.TopSoilsList = result.data.TopSoils;
//                                $scope.SampleChainsList = result.data.SampleChains;
//                                $scope.RecommendationsList = result.data.Recommendations;
//                                $scope.SetTopSoils(y);
//                                $scope.SetSampleChains(y);
//                                $scope.SetRecommendations(y);
//                            } else if (stn == 2 || stn == 3 || stn == 4 || stn == 5 || stn == 6 || stn == 7 || stn == 9 || stn == 12) {
//                                $scope.SetSubValues(result.data.SubSampleInfos[y], result.data.SubSampleInfos);
//                            }
//                        } else {
//                            $scope.disableNext = true;
//                            y = 0;
//                        }
//                    });
//                }
//            }
//        })
//        .controller("addSampleCtlr", function ($scope, Sample, $stateParams) {
//            $scope.BeginAdd = function () {

//                $scope.readonly = false;
//                $scope.disabled = false;
//                $scope.disabledUpdate = false;
//                $scope.action = 'add';
//                var standard = 1;  // use to set cost type to 'Standard' by default
//                $scope.Sample.CostTypeNumber = standard.toString();
//                angular.element('#txtSampleID1').focus();
//                $scope.Sample.LabNumber++;
//                $scope.Sample.SampleID1 = "";
//                $scope.Sample.SampleID2 = "";
//                $scope.Sample.SampleID3 = "";
//                $scope.Sample.SampleID4 = "";
//                $scope.Sample.SampleID5 = "";
//                $scope.chkTopSoil = true;
//                $scope.SampleChain = {};
//                $scope.SampleChains = {};
//                $scope.SampleChain.BeginningDepth = 0;
//                $scope.Recommendations = [];
//                $scope.SetHoldValues();
//                $scope.RemoveValidation();
//            };
//            $scope.SetSampleChainValues();

//            Sample.add($scope.Sample, $scope.SampleChain, $scope.SampleRecs, $scope.SubSampleInfo).then(function (result) {
//                if (result.data != null) {
//                    $scope.SetFormValues(result.data);
//                } else {
//                    $scope.Load($scope.Sample.SampleTypeNumber);
//                }
//                $scope.ResetForm();
//            });
//        })
//        .controller("updateSampleCtlr", function ($scope, Sample, $stateParams) {
//            $scope.BeginUpdate = function () {
//                $scope.SetHoldValues();
//                $scope.readonly = false;
//                $scope.disabled = false;
//                $scope.disabledUpdate = true;
//                $scope.action = 'update';
//                angular.element('#txtSampleID1').focus();
//                $scope.RemoveValidation();
//            };
//            $scope.SetSampleChainValues();

//            Sample.update($scope.Sample, $scope.SampleChain, $scope.SampleRecs, $scope.SubSampleInfo).then(function (result) {
//                console.log(result);
//                if (result.data != null) {
//                    $scope.SetFormValues(result.data);
//                } else {
//                    $scope.Load($scope.Sample.SampleTypeNumber);
//                }
//                $scope.ResetForm();
//            });
//        })
//        .controller("deleteSampleCtlr", function ($scope, Sample, $stateParams) {
//            $scope.BeginDelete = function () {
//                $scope.readonly = false;
//                console.log('inside Delete');
//                $scope.disabled = true;
//                $scope.action = 'delete';
//                angular.element('#btnCommit').focus();
//                $scope.RemoveValidation();
//            };
//            Sample.remove($scope.Sample.SampleTypeNumber, $scope.Sample.BatchNumber, $scope.Sample.LabNumber).then(function (result) {
//                if (result.data != null) {
//                    $scope.SetFormValues(result.data);
//                } else {
//                    $scope.Load($scope.Sample.SampleTypeNumber);
//                }
//                $scope.ResetForm();
//            });
//        });
//})();
