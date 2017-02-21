(function () {
    'use strict'
    angular
        .module('bbvaApp')
        .directive('radioButton', radioButton)

    function radioButton() {
        return {
            restrict: 'A',
            templateUrl: '../sales/views/components/radio-button.html',
            replace: false,
            scope: {
                radioOptions: "="
            },
            link: function (scope, element, attr) {
                scope.mainClasess = '{ "active": radioOptions.selected == radioInput.option, "inline": radioOptions.inline }';
            }
        }
    };
})();