angular.module("mainApp")
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
});