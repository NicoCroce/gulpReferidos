app.controller('Paso4Controller', ['$scope', '$location', function($scope, $location){

    $scope.registerOption = 'theyGo';

    $scope.continue = function () {
        $location.path('/referidos/paso4');
    }
}]);