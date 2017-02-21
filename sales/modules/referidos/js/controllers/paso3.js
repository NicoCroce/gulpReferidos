app.controller('Paso3Controller', function($scope, $location){

    $scope.officeOptions = {
        officeSelected: ''
    }

    $scope.continue = function () {
        $location.path('/referidos/paso4');
    };
});