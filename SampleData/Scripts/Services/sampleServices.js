angular.module("wardApp")
.factory("Sample", function ($http) {
    return {
        load: function (stn) {
            return $http.get("/SampleModels/Load?sampleTypeNumber=" + stn);
        },
        find: function (stn, ln, bn) {
            return $http.get('/SampleModels/FindSample?sampleTypeNumber=' + stn + '&labNumber=' + ln + '&batchNumber=' + bn);
        },
        add: function (sample, sampleChain, sampleRecs, subSampleInfo) {
            return $http({
                method: 'POST',
                url: '/SampleModels/AddSample',
                data: { 'sampleView': sample, 'sampleChain': sampleChain, 'sampleRecs': sampleRecs, 'subSampleInfo': subSampleInfo }
            });
        },
        update: function (sample, sampleChain, sampleRecs, subSampleInfo) {
            return $http({
                method: 'POST',
                url: '/SampleModels/UpdateSample',
                data: { 'sampleView': sample, 'sampleChain': sampleChain, 'sampleRecs': sampleRecs, 'subSampleInfo': subSampleInfo }
            });
        },
        remove: function (stn, bn, ln) {
            return $http({
                method: 'POST',
                url: '/SampleModels/DeleteSample',
                data: { 'sampleTypeNumber': stn, 'batchNumber': bn, 'labNumber': ln }
            });
        },
        next: function (stn, bn, ln) {
            return $http({
                method: 'POST',
                url: '/SampleModels/GetNext',
                data: { 'stn': stn, 'bn': bn, 'ln': ln }
            });
        },
        prev: function (stn, bn, ln) {
            return $http({
                method: 'POST',
                url: '/SampleModels/GetPrev',
                data: { 'stn': stn, 'bn': bn, 'ln': ln }
            });
        }
    }
})
.factory("Account", function ($http) {
    return {
        find: function (an, stn) {
            return $http.get("/SampleModels/Load?an=" + an + "&stn=" + stn);
        }
    }
})
.factory("Report", function ($http) {
    return {
        reportName: function (stn, rtn) {
            return $http.get('/SampleModels/GetReportName?sampleTypeNumber=' + stn + '&reportTypeNumber=' + rtn);
        },
        reportItems: function (stn) {
            return $http.get('/SampleModels/GetReportItems?sampleTypeNumber=' + stn);
        },
        reportList: function (stn, rins) {
            return $http.get('/SampleModels/GetReportList?stn=' + stn + '&rins=' + rins);
        }
    }
});