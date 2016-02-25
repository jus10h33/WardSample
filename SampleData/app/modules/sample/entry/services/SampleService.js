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
            },
            loadSampleTypes: function () {
                return $http.get('/Sample/LoadSampleTypes');
            },
            loadSampleColumns: function () {
                return $http.get('/Sample/LoadSampleColumns');
            }
        }
    });