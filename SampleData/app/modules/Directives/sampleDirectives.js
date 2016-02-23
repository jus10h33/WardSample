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
})
.directive('validateInput', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var message = element.context.attributes["validate-input"].nodeValue;
            var id = element.context.id;
            element.bind('blur', function() {
                if (element.$invalid && element.$dirty) {
                    $scope.DisplayPopover(id, message);
                    id = "#" + id;
                    angular.element(id).addClass('has-error');
                    angular.element(id).focus();
                } else if (element.$valid && element.$dirty) {
                    $scope.RemovePopover(id);
                    id = "#" + id;
                    angular.element(id).removeClass('has-error');
                }

                function DisplayPopover(id, message) {
                    id = "#" + id;
                    angular.element(id).attr("data-container", "body");
                    angular.element(id).attr("data-toggle", "popover");
                    angular.element(id).attr("data-placement", "right");
                    angular.element(id).attr("data-content", message);
                    angular.element(id).popover('show');
                    return;
                };

                function RemovePopover(id) {
                    id = "#" + id;
                    angular.element(id).popover('hide');
                    angular.element(id).removeAttr("data-container");
                    angular.element(id).removeAttr("data-toggle");
                    angular.element(id).removeAttr("data-placement");
                    angular.element(id).removeAttr("data-content");
                    angular.element(id).removeAttr("data-original-title");
                    angular.element(id).removeAttr("title");
                    return;
                };
            })
        }        
    }
});