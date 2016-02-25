angular.module("mainApp")

.directive('validateOnblur', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            console.log(element);
            var message = element.context.attributes["validate-onblur"].nodeValue;
            var id = element.context.id;
            element.bind('blur', function () {                
                if (element.$invalid && element.$dirty) {
                    DisplayPopover(id, message);
                    id = "#" + id;
                    angular.element(id).addClass('has-error');
                    angular.element(id).focus();
                } else if (element.$valid && element.$dirty) {
                    RemovePopover(id);
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