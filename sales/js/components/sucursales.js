(function () {
    'use strict'
    angular
        .module('bbvaApp')
        .directive('sucursales', sucursales)

    function sucursales() {
        return {
            restrict: 'A',
            templateUrl: '../sales/views/components/sucursales.html',
            replace: false,
            scope: {
                options: "="
            },
            link: function (scope, element, attr) {
                $.getJSON("conf/sucursales.json").then(function (data) {
                    scope.sucursales = data;
                });
            }
        }
    };
})();