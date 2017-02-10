app.controller('ConsultaController', ['$scope', '$location', function ($scope, $location) {
    $scope.empezar = function () {
        $location.path('/referidos/paso1');
    };
}]);