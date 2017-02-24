app.controller('Paso4Controller', ['$scope', '$location', function ($scope, $location) {

    $scope.radio = {
        options: [
            { 'option': 'goToOffice', 'label': 'Voy a una sucursal' },
            { 'option': 'theyGo', 'label': 'Visitenme a mi trabajo' }
        ],
        inline: false,
        selected: 'goToOffice'
    }

    $scope.locationSelected = {
        state: null,
        city: null
    };

    $scope.continue = function () {
        $location.path('/referidos/paso4');
    };
}]);