﻿(function () {
    'use strict';    

    angular
        .module("Sample", ["ui.router"])
        .config(function ($stateProvider, $urlRouterProvider) {

            $urlRouterProvider.otherwise('/');

            $stateProvider
            .state('sampleEntry', {
                url: '/sample',
                views: {
                    'sampleInfo': {
                        templateUrl: 'Content/templates/partials/sampleInfo.html'
                    },
                    'notes': {
                        templateUrl: 'Content/templates/partials/notes.html'
                    },
                    'discardChanges': {
                        templateUrl: 'Content/templates/partials/discardChanges.html'
                    }
                },
                controller: 'SampleCtlr'
            })

        })
        .controller("sampleCtlr", function ($scope) {
            console.log("sample controller");
            function SetGenericMasters(samples, accounts, sampleTypes, sampleColumns) {
                $scope.Samples = samples;
                $scope.Accounts = accounts;
                $scope.SampleTypes = sampleTypes;
                $scope.SampleColumns = sampleColumns;
            };
            function SetSoilMasters(cropTypes, recTypes, pastCrops) {
                $scope.CropTypes = cropTypes;
                $scope.PastCrops = pastCrops;
                $scope.RecTypes = recTypes;
            };
            function SetSubMasters(subSampleTypes, subSubSampleTypes) {
                $scope.SubSampleTypes = subSampleTypes;
                if (subSubSampleTypes != null) {
                    $scope.SubSubSampleTypes = subsubSampleTypes
                }
            };
            function SetGenericValues(sample, account, messages) {
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
            function SetTopSoils(index) {
                if ($scope.TopSoilsList != null) {
                    $scope.TopSoils = $scope.TopSoilsList[index];
                }
            };
            function SetSampleChains(index) {

                $scope.SampleChains = $scope.SampleChainsList[index];
                if ($scope.SampleChains.length == 1) {
                    $scope.SampleChain = $scope.SampleChains[0];
                } else if ($scope.SampleChains.length > 1) {
                    for (var i = 0; i < $scope.SampleChains.length - 1; i++) {
                        if ($scope.SampleChains[i].LabNumber == $scope.Sample.LabNumber) {
                            $scope.SampleChain = $scope.SampleChains[i];
                        }
                    }
                }

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
            function SetSampleChainValues() {
                $scope.SampleChain = {};
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
            function SetRecommendations(index) {
                $scope.SampleRecs = {};
                if ($scope.RecommendationsList != null) {
                    $scope.Recommendations = $scope.RecommendationsList[index];
                    if ($scope.Sample.SampleTypeNumber == 14) {
                        $scope.RecTypes = [];
                        for (var i = 0; i < $scope.Recommendations.length; i++) {
                            var id = '#acoRecTypes' + i;
                            $scope.Recommendations[i].RecTypeName = '4 - Haney';
                            angular.element(id).attr('disabled', true);
                        }
                    }
                }
            };
            function SetSubValues(subSampleInfo, subSampleInfos) { // if stn is Feed, NIR, Water, Manure, Slurry, Fertilizer, Resin, Plant  
                $scope.SubSampleInfo = subSampleInfo;
                $scope.SubSampleInfos = subSampleInfos;
                $scope.SubSampleInfo.SubSampleTypeNumber = $scope.SubSampleInfo.SubSampleTypeNumber.toString();
                if ($scope.SubSampleInfo.SubSubSampleType != null) {
                    $scope.SubSampleInfo.SubSubSampleTypeNumber = $scope.SubSampleInfo.SubSubSampleTypeNumber.toString();
                }
            };
            function SetRecLayout() {
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
            function SetFormValues(data) {
                SetGenericMasters(data.GenericInfo.Samples, data.GenericInfo.Accounts, data.GenericMasters.SampleTypes, data.GenericMasters.SampleColumns);
                SetGenericValues(data.GenericInfo.Samples[0], data.GenericInfo.Accounts[0], data.GenericInfo.Messages);
                var stn = $scope.Samples[0].SampleTypeNumber;
                if (stn == 1 || stn == 14) {
                    SetSoilMasters(data.SoilMasters.CropTypes, data.SoilMasters.RecTypes, data.SoilMasters.PastCrops)
                    if (data.TopSoils != null) {
                        $scope.TopSoilsList = data.TopSoils;
                        SetTopSoils(0);
                    } else {
                        $scope.TopSoilsList = [];
                    }

                    $scope.SampleChainsList = data.SampleChains;
                    $scope.RecommendationsList = data.Recommendations;
                    SetSampleChains(0);
                    SetRecommendations(0);
                } else if (stn == 2 || stn == 3 || stn == 4 || stn == 5 || stn == 6 || stn == 7 || stn == 9 || stn == 12) {
                    SetSubMasters(data.SubSampleTypes, data.SubSubSampleTypes)
                    SetSubValues(data.SubSampleInfos[0], data.SubSampleInfos);
                }
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
            };
            function Load(stn) {
                Sample.load(stn).then(function (result) {
                    if (result.data != null) {
                        SetFormValues(result.data);
                        SetRecLayout();
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
            Load(1);
            console.log("hello, justin");
        });

    //var sampleCtlr = function ($scope, $http, $filter) {
    //    console.log("sample controller");
    //    function SetGenericMasters(samples, accounts, sampleTypes, sampleColumns) {
    //        $scope.Samples = samples;
    //        $scope.Accounts = accounts;
    //        $scope.SampleTypes = sampleTypes;
    //        $scope.SampleColumns = sampleColumns;
    //    };
    //    function SetSoilMasters(cropTypes, recTypes, pastCrops) {
    //        $scope.CropTypes = cropTypes;
    //        $scope.PastCrops = pastCrops;
    //        $scope.RecTypes = recTypes;
    //    };
    //    function SetSubMasters(subSampleTypes, subSubSampleTypes) {
    //        $scope.SubSampleTypes = subSampleTypes;
    //        if (subSubSampleTypes != null) {
    //            $scope.SubSubSampleTypes = subsubSampleTypes
    //        }
    //    };
    //    function SetGenericValues(sample, account, messages) {
    //        $scope.readonly = true;
    //        $scope.Sample = sample;
    //        $scope.Sample.SampleTypeNumber = $scope.Sample.SampleTypeNumber.toString();
    //        $scope.Sample.CostTypeNumber = $scope.Sample.CostTypeNumber.toString();
    //        $scope.Sample.DateReceived = new Date(parseInt($scope.Sample.DateReceived.replace(/(^.*\()|([+-].*$)/g, ''))).toLocaleDateString();
    //        $scope.Sample.DateReported = new Date(parseInt($scope.Sample.DateReported.replace(/(^.*\()|([+-].*$)/g, ''))).toLocaleDateString();
    //        $scope.Account = account;
    //        angular.element("#acoGrower").autocomplete({ source: account.Growers, minLength: 0 }).focus(function () { $(this).autocomplete("search"); });
    //        $scope.Messages = messages;
    //    };
    //    function SetTopSoils(index) {
    //        if ($scope.TopSoilsList != null) {
    //            $scope.TopSoils = $scope.TopSoilsList[index];
    //        }
    //    };
    //    function SetSampleChains(index) {

    //        $scope.SampleChains = $scope.SampleChainsList[index];
    //        if ($scope.SampleChains.length == 1) {
    //            $scope.SampleChain = $scope.SampleChains[0];
    //        } else if ($scope.SampleChains.length > 1) {
    //            for (var i = 0; i < $scope.SampleChains.length - 1; i++) {
    //                if ($scope.SampleChains[i].LabNumber == $scope.Sample.LabNumber) {
    //                    $scope.SampleChain = $scope.SampleChains[i];
    //                }
    //            }
    //        }

    //        $scope.SampleChain.PastCropNumber = $scope.SampleChain.PastCropNumber.toString();
    //        $scope.SampleChain.Available = $scope.SampleChain.LabNumber.toString();
    //        if ($scope.SampleChain.TopSoil == 1) {
    //            $scope.chkTopSoil = true;
    //            $scope.sampleChainLink = false;
    //            $scope.chkLinkToSoil = false;
    //        } else {
    //            $scope.sampleChainLink = true;
    //            $scope.chkLinkToSoil = true;
    //            $scope.chkTopSoil = false;
    //        }
    //    };
    //    function SetSampleChainValues() {
    //        $scope.SampleChain = {};
    //        $scope.SampleChain.BatchNumber = $scope.Sample.BatchNumber;
    //        $scope.SampleChain.LabNumber = $scope.Sample.LabNumber;
    //        if (angular.element('input[id=chkTopSoil]:checked')) {
    //            $scope.SampleChain.TopSoil = 1;
    //            $scope.SampleChain.LinkedSampleBatch = 0;
    //            $scope.SampleChain.LinkedSampleLab = 0;
    //        } else {
    //            $scope.SampleChain.TopSoil = 0;
    //            $scope.SampleChain.LinkedSampleBatch = $scope.SampleChain.LinkedSampleBatch;
    //            $scope.SampleChain.LinkedSampleLab = $scope.SampleChain.LinkedSampleLab;
    //        }
    //    };
    //    function SetRecommendations(index) {
    //        $scope.SampleRecs = {};
    //        if ($scope.RecommendationsList != null) {
    //            $scope.Recommendations = $scope.RecommendationsList[index];
    //            if ($scope.Sample.SampleTypeNumber == 14) {
    //                $scope.RecTypes = [];
    //                for (var i = 0; i < $scope.Recommendations.length; i++) {
    //                    var id = '#acoRecTypes' + i;
    //                    $scope.Recommendations[i].RecTypeName = '4 - Haney';
    //                    angular.element(id).attr('disabled', true);
    //                }
    //            }
    //        }
    //    };
    //    function SetSubValues(subSampleInfo, subSampleInfos) { // if stn is Feed, NIR, Water, Manure, Slurry, Fertilizer, Resin, Plant  
    //        $scope.SubSampleInfo = subSampleInfo;
    //        $scope.SubSampleInfos = subSampleInfos;
    //        $scope.SubSampleInfo.SubSampleTypeNumber = $scope.SubSampleInfo.SubSampleTypeNumber.toString();
    //        if ($scope.SubSampleInfo.SubSubSampleType != null) {
    //            $scope.SubSampleInfo.SubSubSampleTypeNumber = $scope.SubSampleInfo.SubSubSampleTypeNumber.toString();
    //        }
    //    };
    //    function SetRecLayout() {
    //        switch ($scope.Sample.SampleTypeNumber) {
    //            //Soil
    //            case "1":
    //                $scope.rightSide = true;
    //                $scope.SampleChainLink = false;
    //                $scope.linkToSoil = false;
    //                $scope.soilView = true;
    //                $scope.plantView = false;
    //                $scope.otherView = false;
    //                break;
    //                //Biological
    //            case "14":
    //                $scope.rightSide = true;
    //                $scope.SampleChainLink = true;
    //                $scope.linkToSoil = true;
    //                $scope.soilView = true;
    //                $scope.plantView = false;
    //                $scope.otherView = false;
    //                break;
    //                //Plant
    //            case "5":
    //                $scope.rightSide = true;
    //                $scope.soilView = false;
    //                $scope.plantView = true;
    //                $scope.otherView = false;
    //                break;
    //                //Feed, NIR, Water, Manure, Slurry, Fertilizer, Resin 
    //            case "2":
    //            case "3":
    //            case "4":
    //            case "6":
    //            case "7":
    //            case "9":
    //            case "12":
    //                $scope.rightSide = true;
    //                $scope.soilView = false;
    //                $scope.plantView = false;
    //                $scope.otherView = true;
    //                break;
    //                //Potato, Herbicide, Wasterwater, Other
    //            case "10":
    //            case "11":
    //            case "8":
    //            case "13":
    //                $scope.rightSide = false;
    //                $scope.soilView = false;
    //                $scope.plantView = false;
    //                $scope.otherView = false;
    //                break;
    //        }
    //    };
    //    function SetFormValues(data) {
    //        SetGenericMasters(data.GenericInfo.Samples, data.GenericInfo.Accounts, data.GenericMasters.SampleTypes, data.GenericMasters.SampleColumns);
    //        SetGenericValues(data.GenericInfo.Samples[0], data.GenericInfo.Accounts[0], data.GenericInfo.Messages);
    //        var stn = $scope.Samples[0].SampleTypeNumber;
    //        if (stn == 1 || stn == 14) {
    //            SetSoilMasters(data.SoilMasters.CropTypes, data.SoilMasters.RecTypes, data.SoilMasters.PastCrops)
    //            if (data.TopSoils != null) {
    //                $scope.TopSoilsList = data.TopSoils;
    //                SetTopSoils(0);
    //            } else {
    //                $scope.TopSoilsList = [];
    //            }

    //            $scope.SampleChainsList = data.SampleChains;
    //            $scope.RecommendationsList = data.Recommendations;
    //            SetSampleChains(0);
    //            SetRecommendations(0);
    //        } else if (stn == 2 || stn == 3 || stn == 4 || stn == 5 || stn == 6 || stn == 7 || stn == 9 || stn == 12) {
    //            SetSubMasters(data.SubSampleTypes, data.SubSubSampleTypes)
    //            SetSubValues(data.SubSampleInfos[0], data.SubSampleInfos);
    //        }
    //    }
    //    function SetHoldValues () {
    //        $scope.holdSample = {};
    //        angular.copy($scope.Sample, $scope.holdSample);
    //        var stn = $scope.Sample.SampleTypeNumber;
    //        if (stn == 1 || stn == 14) {
    //            $scope.holdSampleChain = {};
    //            angular.copy($scope.SampleChain, $scope.holdSampleChain);
    //            if (angular.isDefined($scope.Recommendations) && $scope.Recommendations.length > 0) {
    //                $scope.holdRecommendations = {};
    //                angular.copy($scope.Recommendations, $scope.holdRecommendations);
    //            }
    //        } else if (stn == 2 || stn == 3 || stn == 4 || stn == 5 || stn == 6 || stn == 7 || stn == 9 || stn == 12) {
    //            $scope.holdSubSampleInfo = {};
    //            angular.copy($scope.SubSampleInfo, $scope.holdSubSampleInfo);
    //        }
    //    };
    //    function Load(stn) {
    //        Sample.load(stn).then(function (result) {
    //            if (result.data != null) {
    //                SetFormValues(result.data);
    //                SetRecLayout();
    //                $scope.action = "";
    //                $scope.required = true;
    //                $scope.readonly = true;
    //                $scope.disabled = false;
    //                $scope.disabledUpdate = false;
    //                $scope.reportShown = false;
    //                $scope.disableNext = true;
    //            }

    //        });
    //    };
    //    Load(1);
    //    console.log("hello, justin");
    //};
})();