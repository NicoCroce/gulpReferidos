(function () {
    'use strict'
    angular
        .module('bbvaApp')
        .directive('localidades', localidades)

    function localidades() {
        return {
            restrict: 'A',
            templateUrl: '../sales/views/components/localidades.html',
            replace: false,
            scope: {
                locationSelected: "="
            },
            link: function (scope, element, attr) {
                scope.states,
                scope.cities,

                $.getJSON("conf/localidades/provincias.json").then(function (data) {
                    scope.states = data;
                });                


                scope.$watch('locationSelected.state', function () {
                    var $state = scope.locationSelected.state;
                    if (!angular.isUndefinedOrNullOrEmpty($state) && $state.codigo != "01") {
                        $.getJSON("conf/localidades/" + $state.id + ".json").then(function (data) {
                            scope.cities = data;
                            scope.locationSelected.city = null;
                        });
                    } else {
                        scope.cities = [];
                        scope.locationSelected.city = null;
                    }

                }, true);

                scope.checkInput = function () {
                    return angular.isUndefinedOrNullOrEmpty(scope.locationSelected.state);
                };
            }
        }
    };
})();