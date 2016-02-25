angular.module("mainApp")
.directive('autoComplete', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var data = scope[attrs["autoComplete"]];
            function checkAvailable(term) {
                var length = term.length,
                    term = term.toUpperCase();
                for (var i = 0, z = data.length; i < z; i++) {
                    var start = data[i].indexOf("-") + 2;
                    if (data[i].substring(start, start + length).toUpperCase() === term || data[i].substring(0, length).toUpperCase() === term) {
                        return true;
                    }
                }
                return false;
            }
            element.on("keyup", function (event) {
                var ac_value = this.value;
                if (!checkAvailable(ac_value)) {
                    this.value = ac_value.substring(0, ac_value.length - 1);
                    angular.element(this).autocomplete("search", this.value);
                }
            }).autocomplete({
                source: data,
                minLength: 0,
                delay: 0,
                autoFocus: true
            }).focus(function () {
                angular.element(this).autocomplete("search");
            });
        }
    }
});