'use strict';

var fs = require('fs');

/***************  PROYECTOS  ***************/
exports.getProjects = function () {
    return [
        'hipotecarios',
        'referidos'
    ];
}
/*************************************/


/***************  DETERMINAR MÓDULO  ***************/
exports.selectProject = function (process) {
    //Primero se obtiene el parámetro 3. Luego se eliminan los --
    var projectName = process.argv.slice(3).toString().replace('--', '');
    // Si no se ingresa proyecto
    if (projectName == '') {
        log('Debes especificar el nombre del proyecto. Ejemplo: gulp start --NOMBRE');
        return false;
    }
    // Se valida que el proyecto exista.
    var validate = false;
    exports.getProjects().forEach(function (project) {
        if (project == projectName) validate = true;
    });

    // Si no existe retorna
    if (!validate) { console.log('PROYECTO INEXISTENTE'); return false; }

    // Si existe se obtiene el JSON de configuración de ese módulo.
    var jsonEle = JSON.parse(fs.readFileSync('sales/modules/' + projectName + '/conf/ofertasDigitales.json'));

    // Se obtiene el primer objeto de PASOS.
    var urlIndexModule = Object.keys(jsonEle.pasos)[0],
        // Solo se almacena el INDEX que se encuentra luego de la última /
        clearIndex = urlIndexModule.substring(urlIndexModule.lastIndexOf('/') + 1);
    
    return {
        'module': projectName,
        'clearIndex': clearIndex
    };
}
/*************************************/