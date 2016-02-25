angular.module("mainApp")
.factory("AccountService", function ($http) {
    return {
        find: function (an, stn) {
            return $http.get("/Sample/FindAccount?an=" + an + "&stn=" + stn);
        }
    }
})