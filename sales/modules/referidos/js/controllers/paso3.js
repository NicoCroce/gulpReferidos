app.controller('Paso3Controller', ['$scope', '$location', function($scope, $location){
    $scope.continue = function () {
        $location.path('/referidos/paso4');
    }
}]);