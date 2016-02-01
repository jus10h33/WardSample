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
        }
    }
});