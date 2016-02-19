angular.module("mainApp")
    .factory("SampleService", function ($http) {
        return {
            load: function (stn) {
                return $http.get("/Sample/Load?sampleTypeNumber=" + stn);
            },
            add: function (sample, sampleChain, sampleRecs, subSampleInfo) {
                return $http({
                    method: 'POST',
                    url: '/Sample/AddSample',
                    data: { 'sampleView': sample, 'sampleChain': sampleChain, 'sampleRecs': sampleRecs, 'subSampleInfo': subSampleInfo }
                });
            },
            find: function (stn, bn, ln) {
                return $http.get('/Sample/FindSample?sampleTypeNumber=' + stn + '&labNumber=' + ln + '&batchNumber=' + bn);
            },
            update: function (sample, sampleChain, sampleRecs, subSampleInfo) {
                return $http({
                    method: 'POST',
                    url: '/Sample/UpdateSample',
                    data: { 'sampleView': sample, 'sampleChain': sampleChain, 'sampleRecs': sampleRecs, 'subSampleInfo': subSampleInfo }
                });
            },
            remove: function (stn, bn, ln) {
                return $http({
                    method: 'POST',
                    url: '/Sample/DeleteSample',
                    data: { 'sampleTypeNumber': stn, 'batchNumber': bn, 'labNumber': ln }
                });
            },
            next: function (stn, bn, ln) {
                return $http({
                    method: 'POST',
                    url: '/Sample/GetNext',
                    data: { 'stn': stn, 'bn': bn, 'ln': ln }
                });
            },
            prev: function (stn, bn, ln) {
                return $http({
                    method: 'POST',
                    url: '/Sample/GetPrev',
                    data: { 'stn': stn, 'bn': bn, 'ln': ln }
                });
            }
        }
    })
    .factory("SetSampleService", ["ScopeService", function (ScopeService) {
        var entry = {};
        return {
            setAllValues: function (data) {
                var stn = data.GenericInfo.Samples[0].SampleTypeNumber;
                SetFormValues(data);
                SetRecLayout(stn);
                ScopeService.setScope(entry);
                return entry;
            },
            setGenericValues: function (sample, account, messages) {
                SetGenericValues(sample, account, messages);
                ScopeService.setSample(sample);
                ScopeService.setAccount(account);
            },
            setSoilValues: function (index) {
                SetTopSoils(index);
                SetSampleChains(index);                
                SetRecommendations(index)
            },
            setSubValues: function (subSampleInfo, subSampleInfos) {
                SetSubValues(subSampleInfo, subSampleInfos)
            }
        }
        function SetGenericMasters(samples, accounts, sampleTypes, sampleColumns) {
            entry.Samples = samples;
            entry.Accounts = accounts;
            entry.SampleTypes = sampleTypes;
            entry.SampleColumns = sampleColumns;
        };
        function SetSoilMasters(cropTypes, recTypes, pastCrops) {
            entry.CropTypes = cropTypes;
            entry.PastCrops = pastCrops;
            entry.RecTypes = recTypes;
        };
        function SetSubMasters(subSampleTypes, subSubSampleTypes) {
            entry.SubSampleTypes = subSampleTypes;
            if (subSubSampleTypes != null) {
                entry.SubSubSampleTypes = subsubSampleTypes
            }
        };
        function SetGenericValues(sample, account, messages) {
            entry.readonly = true;
            entry.Sample = sample;
            entry.Sample.SampleTypeNumber = sample.SampleTypeNumber.toString();
            entry.Sample.CostTypeNumber = sample.CostTypeNumber.toString();
            entry.Sample.DateReceived = new Date(parseInt(sample.DateReceived.replace(/(^.*\()|([+-].*$)/g, ''))).toLocaleDateString();
            entry.Sample.DateReported = new Date(parseInt(sample.DateReported.replace(/(^.*\()|([+-].*$)/g, ''))).toLocaleDateString();
            entry.Account = account;
            angular.element("#acoGrower").autocomplete({ source: account.Growers, minLength: 0 }).focus(function () { $(this).autocomplete("search"); });
            entry.Messages = messages;
        };
        function SetTopSoils(index) {
            if (entry.TopSoilsList != null) {
                entry.TopSoils = entry.TopSoilsList[index];
                ScopeService.setTopSoils = entry.TopSoils;
            }
        };
        function SetSampleChains(index) {
            entry.SampleChains = entry.SampleChainsList[index];
            if (entry.SampleChains.length == 1) {
                entry.SampleChain = entry.SampleChains[0];
            } else if (entry.SampleChains.length > 1) {
                for (var i = 0; i < entry.SampleChains.length - 1; i++) {
                    if (entry.SampleChains[i].LabNumber == entry.Sample.LabNumber) {
                        entry.SampleChain = entry.SampleChains[i];
                    }
                }
            }

            entry.SampleChain.PastCropNumber = entry.SampleChain.PastCropNumber.toString();
            entry.SampleChain.Available = entry.SampleChain.LabNumber.toString();
            if (entry.SampleChain.TopSoil == 1) {
                entry.chkTopSoil = true;
                entry.sampleChainLink = false;
                entry.chkLinkToSoil = false;
            } else {
                entry.sampleChainLink = true;
                entry.chkLinkToSoil = true;
                entry.chkTopSoil = false;
            }
            ScopeService.setSampleChains(entry.SampleChains);
            ScopeService.setSampleChain(entry.SampleChain);
            ScopeService.setSampleChainVars(entry.chkTopSoil, entry.sampleChainLink, entry.chkLinkToSoil)
        };
        function SetRecommendations(index) {
            if (entry.RecommendationsList != null) {
                entry.Recommendations = entry.RecommendationsList[index];
                if (entry.Sample.SampleTypeNumber == 14) {
                    entry.RecTypes = [];
                    for (var i = 0; i < entry.Recommendations.length; i++) {
                        var id = '#acoRecTypes' + i;
                        entry.Recommendations[i].RecTypeName = '4 - Haney';
                        angular.element(id).attr('disabled', true);
                    }
                }
                ScopeService.setRecommendations(entry.Recommendations);
            }
        };
        function SetSubValues(subSampleInfo, subSampleInfos) { // if stn is Feed, NIR, Water, Manure, Slurry, Fertilizer, Resin, Plant  
            entry.SubSampleInfo = subSampleInfo;
            entry.SubSampleInfos = subSampleInfos;
            entry.SubSampleInfo.SubSampleTypeNumber = entry.SubSampleInfo.SubSampleTypeNumber.toString();
            if (entry.SubSampleInfo.SubSubSampleType != null) {
                entry.SubSampleInfo.SubSubSampleTypeNumber = entry.SubSampleInfo.SubSubSampleTypeNumber.toString();
            }
        };
        function SetFormValues(data) {
            SetGenericMasters(data.GenericInfo.Samples, data.GenericInfo.Accounts, data.GenericMasters.SampleTypes, data.GenericMasters.SampleColumns);
            SetGenericValues(data.GenericInfo.Samples[0], data.GenericInfo.Accounts[0], data.GenericInfo.Messages);
            var stn = entry.Samples[0].SampleTypeNumber;
            if (stn == 1 || stn == 14) {
                SetSoilMasters(data.SoilMasters.CropTypes, data.SoilMasters.RecTypes, data.SoilMasters.PastCrops)
                if (data.TopSoils != null) {
                    entry.TopSoilsList = data.TopSoils;
                    SetTopSoils(0);
                } else {
                    entry.TopSoilsList = [];
                }

                entry.SampleChainsList = data.SampleChains;
                entry.RecommendationsList = data.Recommendations;
                SetSampleChains(0);
                SetRecommendations(0);
            } else if (stn == 2 || stn == 3 || stn == 4 || stn == 5 || stn == 6 || stn == 7 || stn == 9 || stn == 12) {
                SetSubMasters(data.SubSampleTypes, data.SubSubSampleTypes)
                SetSubValues(data.SubSampleInfos[0], data.SubSampleInfos);
            }
        }
        function SetHoldValues() {
            entry.holdSample = {};
            angular.copy(entry.Sample, entry.holdSample);
            var stn = entry.Sample.SampleTypeNumber;
            if (stn == 1 || stn == 14) {
                entry.holdSampleChain = {};
                angular.copy(entry.SampleChain, entry.holdSampleChain);
                if (angular.isDefined(entry.Recommendations) && entry.Recommendations.length > 0) {
                    entry.holdRecommendations = {};
                    angular.copy(entry.Recommendations, entry.holdRecommendations);
                }
            } else if (stn == 2 || stn == 3 || stn == 4 || stn == 5 || stn == 6 || stn == 7 || stn == 9 || stn == 12) {
                entry.holdSubSampleInfo = {};
                angular.copy(entry.SubSampleInfo, entry.holdSubSampleInfo);
            }
        };
        function SetRecLayout() {
            switch (entry.Sample.SampleTypeNumber) {
                //Soil
                case "1":
                    entry.rightSide = true;
                    entry.SampleChainLink = false;
                    entry.linkToSoil = false;
                    entry.soilView = true;
                    entry.plantView = false;
                    entry.otherView = false;
                    break;
                    //Biological
                case "14":
                    entry.rightSide = true;
                    entry.SampleChainLink = true;
                    entry.linkToSoil = true;
                    entry.soilView = true;
                    entry.plantView = false;
                    entry.otherView = false;
                    break;
                    //Plant
                case "5":
                    entry.rightSide = true;
                    entry.soilView = false;
                    entry.plantView = true;
                    entry.otherView = false;
                    break;
                    //Feed, NIR, Water, Manure, Slurry, Fertilizer, Resin 
                case "2":
                case "3":
                case "4":
                case "6":
                case "7":
                case "9":
                case "12":
                    entry.rightSide = true;
                    entry.soilView = false;
                    entry.plantView = false;
                    entry.otherView = true;
                    break;
                    //Potato, Herbicide, Wasterwater, Other
                case "10":
                case "11":
                case "8":
                case "13":
                    entry.rightSide = false;
                    entry.soilView = false;
                    entry.plantView = false;
                    entry.otherView = false;
                    break;
            };
        }
    }])
    .factory("AccountService", function ($http) {
        return {
            find: function (an, stn) {
                return $http.get("/Sample/Load?an=" + an + "&stn=" + stn);
            }
        }
    })
    .factory("ReportService", function ($http) {
        return {
            reportName: function (stn, rtn) {
                return $http.get('/Sample/GetReportName?sampleTypeNumber=' + stn + '&reportTypeNumber=' + rtn);
            },
            reportItems: function (stn) {
                return $http.get('/Sample/GetReportItems?sampleTypeNumber=' + stn);
            },
            reportList: function (stn, rins) {
                return $http.get('/Sample/GetReportList?stn=' + stn + '&rins=' + rins);
            }
        }
    })
    .factory("ScopeService", function () {
        var scope = {};
        return {
            setScope: function (scopeReceived) {
                scope = scopeReceived;
            },
            getScope: function () {
                return scope;
            },
            setSample: function (sample, account, messages) {
                scope.Sample = sample;
            },
            setAccount: function (account) {
                scope.Account = account;
            },
            setTopSoils: function (topsoils) {
                scope.TopSoils = topSoils;
            },
            setSampleChains: function (sampleChains) {
                scope.SampleChains = sampleChains;
            },
            setSampleChain: function (sampleChain) {
                scope.SampleChain = sampleChain;
                scope.rightSide = true;
                scope.soilView = true;
            },
            setSampleChainVars: function (chkTopSoil, sampleChainLink, chkLinkToSoil) {
                scope.chkTopSoil = chkTopSoil;
                scope.sampleChainLink = sampleChainLink;
                scope.chkLinkToSoil = chkLinkToSoil;
            },
            setRecommendations: function (recommendations) {
                scope.Recommendations = recommendations;
            }
        }        
    });