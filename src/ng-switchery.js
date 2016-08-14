angular.module('Postblazer')
    .directive('uiSwitch', ['$window', '$timeout', '$log', '$parse', function ($window, $timeout, $log, $parse) {

    /**
     * Initializes the HTML element as a Switchery switch.
     *
     * $timeout is in place as a workaround to work within angular-ui tabs.
     *
     * @param scope
     * @param elem
     * @param attrs
     * @param ngModel
     */
    function linkSwitchery(scope, elem, attrs, ngModel) {
        if (!ngModel) return false;
        var options = {};
        try {
            options = $parse(attrs.uiSwitch)(scope);
        }
        catch (e) {
        }
        var instanceTrueValue = true; // default value if no ui-switch-true-value provided
        var instanceFalseValue = false; // default value if no ui-switch-false-value provided
        var switcher;

        //set model true/false value if ui-switch-true/false-value provided
        if (attrs.uiSwitchTrueValue) {
            instanceTrueValue = isNaN(parseInt(attrs.uiSwitchTrueValue)) ? attrs.uiSwitchTrueValue : parseInt(attrs.uiSwitchTrueValue);
        }
        if (attrs.uiSwitchFalseValue) {
            instanceFalseValue = isNaN(parseInt(attrs.uiSwitchFalseValue)) ? attrs.uiSwitchFalseValue : parseInt(attrs.uiSwitchFalseValue);
        }

        attrs.$observe('disabled', function (value) {
            if (!switcher) {
                return;
            }

            if (value) {
                switcher.disable();
            }
            else {
                switcher.enable();
            }
        });

        initializeSwitch();

        function initializeSwitch() {
            $timeout(function () {
                // Remove any old switcher
                if (switcher) {
                    angular.element(switcher.switcher).remove();
                }
                // (re)create switcher to reflect latest state of the checkbox element
                switcher = new $window.Switchery(elem[0], options);
                var element = switcher.element;
                element.checked = scope.ngModel == instanceTrueValue;
                if (attrs.disabled) {
                    switcher.disable();
                }

                switcher.setPosition(false);
                element.addEventListener('change', function (evt) {
                    scope.$apply(function () {
                        scope.ngModel = element.checked ? instanceTrueValue : instanceFalseValue; // overwrites ngModel ngModel
                    })
                });
                scope.$watch('ngModel', function (newngModel, oldngModel) {
                    switcher.setPosition(false);
                });
            }, 0);
        }
    }

    return {
        require: 'ngModel',
        restrict: 'AE',
        scope: {
            ngModel: '=ngModel'
        },
        link: linkSwitchery
    }
}]);
