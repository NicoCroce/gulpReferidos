app.controller('Paso4Controller', ['$scope', '$location', function ($scope, $location) {

    $scope.envio = {};
    $scope.envio.sucursal = undefined;

    $scope.radio = {
        options: [
            { 'option': 'goToOffice', 'label': 'Voy a una sucursal' },
            { 'option': 'theyGo', 'label': 'Visitenme a mi trabajo' }
        ],
        inline: false,
        selected: 'goToOffice'
    }

    $scope.continue = function () {
        $location.path('/referidos/paso4');
    };

    $.getJSON("conf/localidades/provincias.json").then(function (data) {
        $scope.provincias = data;
    });

    $scope.$watch('envio.provincia', function () {
        var $provincia = $scope.envio.provincia;
        if (typeof $provincia != 'undefined') {
            $.getJSON("conf/localidades/" + $provincia.id + ".json").then(function (data) {
                $scope.localidades = data;
                $scope.envio.localidad = null;
            });
        } else {
            $scope.localidades = [];
            $scope.envio.localidad = null;
        }

    }, true);
}]);