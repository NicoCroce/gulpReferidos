(function () {
    'use strict'
    angular
        .module('bbvaApp')
        .directive('checkbox', checkbox)

    function checkbox() {
        return {
            restrict: 'A',
            templateUrl: '../sales/views/components/checkbox.html',
            replace: false,
            transclude: true,
            scope: {
                checked: "="
            },
            link: function (scope, element, attr) {
                scope.changeState = function() {
                    scope.checked = !scope.checked;
                }
            }
        }
    };
})();