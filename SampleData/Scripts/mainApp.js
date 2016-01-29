angular.module("wardApp", [])
.constant("regNumeric", new RegExp("^[0-9]+$"))
.constant("regBatch", new RegExp('20(0[6-9]|[1-9][0-9])(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])'))
.constant("regDate", new RegExp('^20(0[7-9]|[1-9][0-9])-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$'))
.controller("wardCtrl", function ($scope, $http, $filter) {

});