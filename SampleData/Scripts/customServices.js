angular.module("wardApp")
.factory("Account", function ($http) {
    return {
        find: function (accountNumber, sampleTypeNumber) {
            $http.get("/SampleModels/FindAccount?an=" + accountNumber + "&stn=" + sampleTypeNumber)
                .success(function (data) {
                    return data;
                })
                .error(function () { console.log("Error on FindAccount") });
        },
        add: function (account) {
            $http({
                method: 'POST',
                url: '/SampleModels/AddAccount',
                data: { 'account': account }
            })
              .success(function (data) {
                  return data;
              })
              .error(function () { console.log("Error on AddAccount") });
        },
        update: function (account) {
            $http({
                method: 'POST',
                url: '/SampleModels/UpdateAccount',
                data: { 'account': account }
            })
              .success(function (data) {
                  return data;
              })
              .error(function () { console.log("Error on UpdateAccount") });
        },
        remove: function (accountNumber) {
            $http({
                method: 'POST',
                url: '/SampleModels/DeleteAccount',
                data: { 'accountNumber': accountNumber }
            })
              .success(function (data) {
                  return data
              })
              .error(function () { console.log("Error on RemoveAccount") });
        }
    }
})
.factory("Sample", function ($http) {
    return {
        find: function (stn, ln, bn) {
            return $http.get('/SampleModels/FindSample?sampleTypeNumber=' + stn + '&labNumber=' + ln + '&batchNumber=' + bn)
              //.success(function (data) {
              //    console.log(data);
              //    return data;
              //})
              //.error(function () { console.log("Error on FindSample") });
        },
        add: function (sample, sampleChain, sampleRecs, subSampleInfo) {
            $http({
                method: 'POST',
                url: '/SampleModels/AddSample',
                data: { 'sampleView': sample, 'sampleChain': sampleChain, 'sampleRecs': sampleRecs, 'subSampleInfo': subSampleInfo }
            })
              .success(function (data) {
                  return data;
              })
              .error(function () { console.log("Error on AddSample") });
        },
        update: function (sample, sampleChain, sampleRecs, subSampleInfo) {
            $http({
                method: 'POST',
                url: '/SampleModels/UpdateSample',
                data: { 'sampleView': sample, 'sampleChain': sampleChain, 'sampleRecs': sampleRecs, 'subSampleInfo': subSampleInfo }
            })
              .success(function (data) {
                  return data;
              })
              .error(function () { console.log("Error on UpdateSample") });
        },
        remove: function (stn, bn, ln) {
            $http({
                method: 'POST',
                url: '/SampleModels/DeleteSample',
                data: { 'sampleTypeNumber': stn, 'batchNumber': bn, 'labNumber': ln }
            })
              .success(function (data) {
                  return data;
              })
              .error(function () { console.log("Error on RemoveSample") });
        }
    }
});