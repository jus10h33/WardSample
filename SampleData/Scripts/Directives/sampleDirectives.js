angular.module("wardApp")
.directive('autoComplete', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var data = scope[attrs["autoComplete"]];
            function checkAvailable(term) {
                var length = term.length,
                    chck = false,
                    term = term.toUpperCase();
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
    };
})