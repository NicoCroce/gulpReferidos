app.service('Servidor', [ '$http', "$location", '$routeParams', '$rootScope', 'ConfigService', function($http,$location, $routeParams,$rootScope, ConfigService) {
	var datosConsulta = {};
	var datosEnvio = {};
	
	datosConsulta.trabajo = 'relacion';
	datosConsulta.prestamo = 'no';
	datosConsulta.tipoVivienda = '';
	datosConsulta.viviendas = {};
	datosConsulta.ingresos = [];
	
	var datosRepago = {};
	
	this.setDatosConsulta = function(datos){
		datosConsulta = datos;
	};
	
	this.getDatosConsulta = function(){
		return datosConsulta;
	};

	this.setDatosEnvio = function(datos){
		datosEnvio = datos;
	};
	
	this.getDatosEnvio = function(){
		return datosEnvio;
	};
	
	this.setDatosRepago = function(response){
		datosRepago = response;
	};
	
	this.getDatosRepago = function(){
		return datosRepago;
	};
	
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
				url : ConfigService.getTargetHost() + '/fnet/mod/bbva/NL-VentaPPHip.do?method=consultaPH',
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
	
	this.confirmarOferta = function(onSuccess, onError){
		// Juntar los datos de consulta y Envio
		var req = {
				method : 'POST',
				url : ConfigService.getTargetHost() + '/fnet/mod/bbva/NL-VentaPPHip.do?method=confirmarPH',
				data : this.getDatosDeConfirmacion(),
				headers : {
					'Content-Type' : 'application/x-www-form-urlencoded; charset=ISO-8859-1'
				},
				transformRequest : transformRequest
		}
		$http(req).then(function(response){
			onSuccess(response);
		}, function(errorResponse){
			onError(errorResponse);
		});
	}
	
	this.getDatosDeConfirmacion = function(){
		var confirmacion = {};
		// Datos de envio
		confirmacion.nombre = datosEnvio.nombre;
		confirmacion.apellido = datosEnvio.apellido;
		confirmacion.tipoDoc = datosEnvio.tipoDoc;
		confirmacion.nroDoc = datosEnvio.nroDoc;
		confirmacion.tipoTel = datosEnvio.tipoTel;
		confirmacion.nroTel = datosEnvio.nroTel;
		confirmacion.nacionalidad = datosEnvio.nacionalidad;
		confirmacion.sexo = datosEnvio.sexo;
		confirmacion.email = datosEnvio.email;
		confirmacion.emailRef = datosEnvio.emailRef;
		confirmacion.nroSuc = datosEnvio.nroSucursal;
		
		// Datos de consulta
		confimacion.antLaboral = datosConsulta.antiguedad;
		confimacion.ingrNetMens = datosConsulta.ingresos[0];
		if(datosConsulta.ingresos.length > 1){
			confimacion.ingrNetCony = datosConsulta.ingresos[1];
		}
		confimacion.tipoPHElegido = datosConsulta.tipoVivienda;
		confimacion.otroPPCuota = datosConsulta.prestamoAbono;
		confimacion.pagoMinTC = datosConsulta.minimoConsumoTarjeta;
		confimacion.sitLaboral = datosConsulta.trabajo;
		confimacion.valorProp = datosConsulta.valorPropiedad;
		//TASA FIJA
		confimacion.dineroSolTF = datosRepago.tasaFija.montoSolicitud;
		confimacion.plazoTF = datosRepago.tasaFija.plazo;
		confimacion.cuotaPHMensualTF = datosRepago.tasaFija.cuotaMensual;
		//TASA UVA
		confimacion.dineroSolUVA = datosRepago.tasaUVA.montoSolicitud;
		confimacion.plazoUVA = datosRepago.tasaUVA.plazo;
		confimacion.cuotaPHMensualUVA = datosRepago.tasaUVA.cuotaMensual;
		return confirmacion;
	}
	
	this.campoObligatorio = function(input){
		if(input){
			return true;
		}else{
			return false;
		}
	};
	
}]);
