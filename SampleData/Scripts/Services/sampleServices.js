angular.module("wardApp")
.factory("Sample", function ($http) {
    return {
        load: function (stn) {
            return $http.get("/SampleModels/Load?sampleTypeNumber=" + stn)
                .then(function (result) {
                    console.log(result.data);
                return result.data;
            });
        },
        find: function (stn, ln, bn) {
            return $http.get('/SampleModels/FindSample?sampleTypeNumber=' + stn + '&labNumber=' + ln + '&batchNumber=' + bn)
              .then(function (result) {
                  console.log(result.data);
                  return result.data;
              })
        },
        add: function (sample, sampleChain, sampleRecs, subSampleInfo) {
            $http({
                method: 'POST',
                url: '/SampleModels/AddSample',
                data: { 'sampleView': sample, 'sampleChain': sampleChain, 'sampleRecs': sampleRecs, 'subSampleInfo': subSampleInfo }
            })
              .then(function (result) {
                  console.log(result.data);
                  return result.data;
              });
        },
        update: function (sample, sampleChain, sampleRecs, subSampleInfo) {
            $http({
                method: 'POST',
                url: '/SampleModels/UpdateSample',
                data: { 'sampleView': sample, 'sampleChain': sampleChain, 'sampleRecs': sampleRecs, 'subSampleInfo': subSampleInfo }
            })
              .then(function (result) {
                  console.log(result.data);
                  return result.data;
              });
        },
        remove: function (stn, bn, ln) {
            $http({
                method: 'POST',
                url: '/SampleModels/DeleteSample',
                data: { 'sampleTypeNumber': stn, 'batchNumber': bn, 'labNumber': ln }
            })
              .then(function (result) {
                  console.log(result.data);
                  return result.data;
              });
        }
    }
});