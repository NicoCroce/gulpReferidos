app.controller('ConsultaController', ['$http', '$scope', '$location', 'Servidor', 'ConfigService', 'Tagging', '$timeout', function($http, $scope, $location, Servidor, ConfigService, Tagging, $timeout){
	$scope.consulta = Servidor.getDatosConsulta();

	$scope.submitted = false;
	$scope.errorValidarMontoSolicitud = false;
	$scope.errorPrestamoAbono = false;
	$scope.errorIngresos = false;
	$scope.errorAntiguedad = false;
	$scope.mensajeErrorAntiguedad = "";
	
	$scope.consulta.ingresoTotal = '0';
	$scope.datosViviendas = [];
	$scope.datosViviendasAMostrar = [];
	
	$scope.$on('$errorEnInputs', function() {
		$timeout(function () {
			scrollToTopError();
		});
	});

	
	$scope.$watch('antiguedad', function(){

		$scope.antiguedadDesc = $scope.antiguedad + ' año';
		
		if($scope.antiguedad > 1){
			$scope.antiguedadDesc += 's' 
		}
		
	}, true);
	
	$scope.antiguedad = 1;
	
	$scope.menosAntiguedad = function(){
		if($scope.antiguedad > 1){
			$scope.antiguedad--
		}
	};
	
	$scope.masAntiguedad = function(){
		$scope.antiguedad++;
	};
	
	$scope.addNewIngreso = function(){
		if($scope.consulta.ingresos.length < 2){
			addElement('ingreso', $scope.consulta.ingresos);
		}
	};
	
	$scope.removeIngreso = function(id){
		$(id).remove();
		removeElement(id, $scope.consulta.ingresos);
		if($scope.submitted){
			validarIngresos($scope.consulta.ingresos);
		}
	};
	
	$scope.consultarOpcionesYValidaciones = function(){
		
		Servidor.consultarOpcionesYValidaciones(function(response){
			//onSuccess
			$scope.datosViviendas = response.data;
    		cargarViviendasAMostrar($scope.datosViviendas.lineas);
    		$scope.consulta.tipoVivienda = $scope.datosViviendasAMostrar[0].valor;
    		
    		cargarArrayViviendas($scope.consulta.tipoVivienda);
			
		}, function(errorResponse){
			//onError
			if(!ConfigService.isDebug()){
				$location.path('/hipotecarios/error'); 
			}
		});
	};
	
	
	$scope.trabajo = function(trabajo){
		$scope.consulta.trabajo = trabajo;
	};
	
	$scope.prestamo = function(prestamo){
		$scope.consulta.prestamo = prestamo;
	};
		
	$scope.tipoVivienda = function(tipoVivienda){
		$scope.consulta.tipoVivienda = tipoVivienda;
		cargarArrayViviendas($scope.consulta.tipoVivienda);
	};
	
	$scope.consultar = function(){
		
		$scope.submitted = true;
		
		if((validarPrestamoAbono() && validarAntiguedad() && validarIngresos($scope.consulta.ingresos))
				&& validarMontoSolicitud($scope.consulta.montoSolicitud)
				&& Servidor.campoObligatorio($scope.consulta.minimoConsumoTarjeta)
				&& Servidor.campoObligatorio($scope.consulta.valorPropiedad)
				&& Servidor.campoObligatorio($scope.consulta.montoSolicitud)){
			
			Servidor.setDatosConsulta($scope.consulta);
			
			Servidor.calcularOferta($scope.consulta, function(response){
				//onSuccess
				if(response.data.repago.resultado.value == "APROBADO"){
					$location.path('/hipotecarios/resultados');
				}else{
					$location.path('/hipotecarios/sinOferta');
				}
			}, function(errorResponse){
				//onError
				$location.path('/hipotecarios/error');
			});
		}
		$scope.$broadcast("$errorEnInputs");
	};
	
	$scope.addNewIngreso();
	
	$scope.consultarOpcionesYValidaciones();
	
	function validarPrestamoAbono(){
		
		if($scope.consulta.prestamo == 'si'){
			if($scope.consulta.prestamoAbono == undefined || $scope.consulta.prestamoAbono == ""){
				$scope.errorPrestamoAbono = true;
			}else{
				$scope.errorPrestamoAbono = false;
			}
		}else{
			$scope.errorPrestamoAbono = false;
		}
		
		return !$scope.errorPrestamoAbono;
	};
	
	function validarIngresos(ingresos){
		$scope.errorIngresos = true;
		if(ingresos.length > 1){
			var suma = 0;
			
			for(var x=0; x < ingresos.length; x++){
				if(ingresos[x].valor){
					suma = suma + parseInt(ingresos[x].valor);
				}
			}
			
			if(suma >= ConfigService.getMsg().pasos["/hipotecarios/consulta"].validaciones.ingresoTotalMinimo){
				for (var i=0; i<ingresos.length; i++){
					if(ingresos[i].valor >= ConfigService.getMsg().pasos["/hipotecarios/consulta"].validaciones.ingresoMinimo){
						$scope.consulta.ingresoTotal = suma;
						$scope.errorIngresos = false;
						return !$scope.errorIngresos;
					}
				}
			}
		}else{
			if(ingresos[0].valor){
				if(parseInt(ingresos[0].valor) >= ConfigService.getMsg().pasos["/hipotecarios/consulta"].validaciones.ingresoTotalMinimo){
					$scope.consulta.ingresoTotal = parseInt(ingresos[0].valor);
					$scope.errorIngresos = false;
					return !$scope.errorIngresos;
				}
			}
		}

		return !$scope.errorIngresos;
	};
	
	$scope.validarIngresosAsinc = function(){
		
		if($scope.submitted){
			validarIngresos($scope.consulta.ingresos);
		}
	}
	
	$scope.validarAntiguedadAsinc = function(){

		if($scope.submitted){
			validarAntiguedad();
		}
	}
	
	function validarAntiguedad(){
		
		var validacion = ConfigService.getMsg().pasos["/hipotecarios/consulta"].validaciones.trabajo[$scope.consulta.trabajo];
		var antiguedad = $scope.antiguedadDesc.split(" ");
		var anios = parseInt(antiguedad[0]);
		
		if(anios < validacion.antiguedadMinima){
			$scope.errorAntiguedad = true;
			$scope.mensajeErrorAntiguedad = validacion.mensajeError;
		}else{
			$scope.errorAntiguedad = false;
			$scope.mensajeErrorAntiguedad = "";
		}
		
		return !$scope.errorAntiguedad;
	};
	
	function validarMontoSolicitud(monto){
		debugger
		if(monto > $scope.consulta.viviendas[0].montoMinimo){
			if(monto > $scope.consulta.viviendas[0].montoMaximo){
				$scope.errorValidarMontoSolicitud = false;
				$scope.mensajeErrorMonto = "";
			}else{
				$scope.errorValidarMontoSolicitud = true;
				$scope.mensajeErrorMonto = "El monto máximo que puede solicitar es $" + $scope.consulta.viviendas[0].montoMaximo;
			}
		}else{
			$scope.errorValidarMontoSolicitud = true;
			$scope.mensajeErrorMonto = "El monto mínimo que puede solicitar es $" + $scope.consulta.viviendas[0].montoMinimo;
		}
		
		return !$scope.errorValidarMontoSolicitud;
	};
	
	function cargarViviendasAMostrar(viviendas){
		var indice = 0;
		for(var i = 0; i < viviendas.length; i++){
			
			if(viviendas[i].nombreDeLinea.indexOf(ConfigService.getMsg().pasos["/hipotecarios/consulta"].validaciones.includeNombreVivienda) != -1){
				
				var index = viviendas[i].nombreDeLinea.indexOf(" ");
				$scope.datosViviendasAMostrar[indice] = {"descripcion": viviendas[i].nombreDeLinea.replace(" ",'\n'), 
														"porcentaje": viviendas[i].porcentajeMaximo,
														"valor": viviendas[i].nombreDeLinea,
														"montoMaximo": parseInt(viviendas[i].montoMaximo),
														"montoMinimo": parseInt(viviendas[i].montoMinimo)
														};
				indice++;
			}
		}
	};
	
	function cargarArrayViviendas(tipoViviendaSelected){

		var arrayDatosViviendas = $scope.datosViviendas.lineas;
		var indice = 0;
		for(var i = 0; i < arrayDatosViviendas.length; i++){
			
			if(arrayDatosViviendas[i].nombreDeLinea.indexOf(tipoViviendaSelected) != -1){
				$scope.consulta.viviendas[indice] = arrayDatosViviendas[i];
				indice++;
			}
		}
	};
}]);