app.service('serviciosReferidos', function serviciosReferidos($resource) {
    return {
        getInfoReferido: getInfoReferido
    }

    function getInfoReferido() {
        console.log("Se muestra");
        /*return $resource('').save().$promise;*/
    }

    getInfoReferido();
});