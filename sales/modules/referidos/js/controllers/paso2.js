app.controller('Paso2Controller', ['$scope', '$location', function($scope, $location){
    $scope.continue = function () {
        $location.path('/referidos/paso3');
    }
}]);