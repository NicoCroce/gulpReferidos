app.controller('CuentaController', ['$scope', '$location', function ($scope, $location) {
    $scope.empezar = function () {
        $location.path('/referidos/firma');
    };
}]);