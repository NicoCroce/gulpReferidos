app.controller('EnvioController', ['$http', '$scope', '$location', 'Servidor',function($http, $scope, $location, Servidor){
	$scope.envio = {};
	$scope.nombreError = false;
	$scope.apellidoError = false;
	$scope.nroDocError = false;
	$scope.nroTelError = false;
	$scope.emailError = false;
	$scope.nacionalidades = null;
	$scope.informarAclaracionDeNacionalidad = false;
	$scope.envio.sexo = 'masculino'
	$scope.envio.sexoOptions = {
			options: [
				{'option':'femenino', 'label':'Femenino'},
				{'option': 'masculino', 'label': 'Masculino'}
			],
			selected: $scope.envio.sexo,
			inline: true,
	}
	
	$.getJSON("conf/nacionalidades.json").then(function(data){
		$scope.nacionalidades = data.nacionalidades;
		// Se elige como default argentina
		$scope.envio.nacionalidad = "80";
		$scope.$watch('envio.nacionalidad', function(){
			$scope.evaluarNacionalidad();
		})
		$scope.$apply();
	});
	
	$.getJSON("conf/sucursales.json").then(function(data){
	    $scope.sucursales = data;
	    $scope.$apply();
	});
	
	$scope.enviar = function(){
		if($scope.validarCampos()){
			$scope.setEnvio();
			// Enviar FOrm
			Servidor.confirmarOferta(function(response){
				if(response.data.Respuesta == 'OK'){
					$location.path("/hipotecarios/gracias");
				}else{
					alert("error");
				}
			});
		}
	};
	
	$scope.volver = function(){
		$location.path("/hipotecarios/resultados");
	};
	
	$scope.envio.emails = [];
	
	$scope.addNewEmail = function(){
		addElement('email', $scope.envio.emails);
	};
	
	$scope.removeEmail = function(id){
		removeElement(id, $scope.envio.emails);
	};
	
	$scope.init = function(){
		$scope.envio.tipoDoc = "0";
		$scope.envio.tipoTel = "Celular";
		$scope.envio.nroSucursal = "0099";
	}
	
	$scope.validarCampos = function(){
		$scope.nombreError = false;
		$scope.apellidoError = false;
		$scope.nroDocError = false;
		$scope.nroTelError = false;
		$scope.emailError = false;
		valido = true;
		if($scope.envio.nombre == "" || $scope.envio.nombre == null){
			$scope.nombreError = true;
			valido = false;
		}
		if($scope.envio.apellido == "" || $scope.envio.apellido == null){
			$scope.apellidoError = true;
			valido = false;
		}
		if($scope.envio.nroDoc == "" || $scope.envio.nroDoc == null){
			$scope.nroDocError = true;
			valido = false;
		}
		if($scope.envio.nroTel == "" || $scope.envio.nroTel == null){
			$scope.nroTelError = true;
			valido = true;
		}
		if($scope.envio.emails[0].valor == "" || $scope.envio.emails[0] == null){
			$scope.emailError = true;
			valido = false;
		}
		return valido;
	}
	
	$scope.evaluarNacionalidad = function(){
		if($scope.envio.nacionalidad == "80"){
			$scope.informarAclaracionDeNacionalidad = false;
		}else{
			$scope.informarAclaracionDeNacionalidad = true;
		}
	}
	
	$scope.setEnvio = function(){
		var datosEnvio = {};
		datosEnvio.nombre = $scope.envio.nombre;
		datosEnvio.apellido = $scope.envio.apellido;
		datosEnvio.tipoDoc = $scope.envio.tipoDoc;
		datosEnvio.nroDoc = $scope.envio.nroDoc;
		datosEnvio.tipoTel = $scope.envio.tipoTel;
		datosEnvio.nroTel = $scope.envio.nroTel;
		datosEnvio.nacionalidad = $scope.envio.nacionalidad;
		datosEnvio.sexo = $scope.envio.sexoOptions.selected;
		datosEnvio.email = $scope.envio.emails[0].valor;
		if($scope.envio.emails.length > 1){
			datosEnvio.emailRef = $scope.envio.emails[1].valor;
		}
		datosEnvio.nroSucursal = $scope.envio.nroSucursal;
		Servidor.setDatosEnvio(datosEnvio);
	}
	
	$scope.init();
	
	$scope.addNewEmail();
	
}]);