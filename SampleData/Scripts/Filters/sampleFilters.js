angular.module("wardApp")
    .filter("parseDate", function () {
        return function (value) {
            console.log(value);
            var date = new Date(parseInt(value.replace(/(^.*\()|([+-].*$)/g, ''))).toISOString().substring(0, 10);
        }
    });