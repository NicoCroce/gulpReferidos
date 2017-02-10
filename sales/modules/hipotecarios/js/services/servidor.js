app.service('Servidor', [ '$http', "$location", '$routeParams', '$rootScope', 'ConfigService', function($http,$location, $routeParams,$rootScope, ConfigService) {
	var datosConsulta = {};
	
	datosConsulta.trabajo = 'relacion';
	datosConsulta.prestamo = 'no';
	datosConsulta.tipoVivienda = '';
	datosConsulta.viviendas = {};
	datosConsulta.ingresos = [];
	
	this.setDatosConsulta = function(datos){
		datosConsulta = datos;
	};
	
	this.getDatosConsulta = function(){
		return datosConsulta;
	}
	
	this.consultarOpcionesYValidaciones = function(onSuccess, onError){
		var req = {
				method : 'POST',
				url : ConfigService.getTargetHost() + '/fnet/mod/bbva/NL-VentaPPHip.do?method=consultarOpcionesYValidaciones&POOL=CICS5',
				headers : {
					'Content-Type' : 'application/x-www-form-urlencoded; charset=ISO-8859-1'
				},
				dataType: "json"
		}
		
    	$http(req).then(function(response) {
    		onSuccess(response);
		}, function(errorResponse){
			onError(errorResponse);
		});
	}
	
	
	this.calcularOferta = function(consulta, onSuccess, onError){

		var req = {
				method : 'POST',
				url : ConfigService.getTargetHost() + '/fnet/mod/bbva/NL-VentaPPHip.do?method=consultaPH',
				data : consulta,
				headers : {
					'Content-Type' : 'application/x-www-form-urlencoded; charset=ISO-8859-1'
				},
				transformRequest : transformRequest
			}
		
		$http(req).then(function(response) {
			onSuccess(response);
		}, function(errorResponse){
			onError(errorResponse);
		});
	};
	
	this.recalcularOferta = function(datosRecalculo, onSuccess, onError){

		var req = {
				method : 'POST',
				url : ConfigService.getTargetHost() + '/fnet/mod/bbva/NL-VentaPPHip.do?method=calcularRepago',
				data : datosRecalculo,
				headers : {
					'Content-Type' : 'application/x-www-form-urlencoded; charset=ISO-8859-1'
				},
				transformRequest : transformRequest
			}
		
		$http(req).then(function(response) {
			onSuccess(response);
		}, function(errorResponse){
			onError(errorResponse);
		});
	};
	
	this.campoObligatorio = function(input){
		if(input){
			return true;
		}else{
			return false;
		}
	};
	
}]);
