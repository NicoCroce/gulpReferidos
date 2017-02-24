app.controller('ConsultaController', ['$http', '$scope', '$location', 'Servidor', 'ConfigService', 'Tagging', '$timeout', function($http, $scope, $location, Servidor, ConfigService, Tagging, $timeout){
	$scope.consulta = Servidor.getDatosConsulta();
	
	$scope.submitted = false;
	$scope.errorValidarMontoSolicitud = false;
	$scope.errorPrestamoAbono = false;
	$scope.errorIngresos = false;
	$scope.errorAntiguedad = false;
	$scope.mensajeErrorAntiguedad = "";
	$scope.mensajeInfoTipoVivienda = "";
	
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
		$scope.consulta.antiguedad = $scope.antiguedad;
		
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
			$scope.consulta.plazoMaximo = $scope.datosViviendasAMostrar[0].plazo;
    		
    		cargarArrayViviendas($scope.consulta.tipoVivienda);
    		$scope.obtenerMensajeInfoParaTipoVivienda();
			
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
		
	$scope.tipoVivienda = function(tipoVivienda, plazo){
		$scope.consulta.tipoVivienda = tipoVivienda;
		$scope.consulta.plazoMaximo = plazo;
		cargarArrayViviendas($scope.consulta.tipoVivienda);
		//Cambiamos el mensaje de informacion
		$scope.obtenerMensajeInfoParaTipoVivienda();
	};
	
	$scope.obtenerMensajeInfoParaTipoVivienda = function(){
		var tipos = ConfigService.getMsg().pasos["/hipotecarios/consulta"].validaciones.tipoVivienda;
		for(var key in tipos){
			if(tipos[key].titulo == $scope.consulta.tipoVivienda){
				$scope.mensajeInfoTipoVivienda = tipos[key].mensajeInfo;
			}
		}
	}
	
	$scope.consultar = function(){
		
		$scope.submitted = true;
		
		if((validarAntiguedad() && validarIngresos($scope.consulta.ingresos))
				&& validarMontoSolicitud($scope.consulta.montoSolicitud, $scope.consulta.tipoVivienda)
				&& Servidor.campoObligatorio($scope.consulta.minimoConsumoTarjeta)
				&& Servidor.campoObligatorio($scope.consulta.valorPropiedad)
				&& Servidor.campoObligatorio($scope.consulta.montoSolicitud)){
			
			$scope.consulta.datosViviendas = JSON.stringify($scope.consulta.viviendas);
			
			Servidor.setDatosConsulta($scope.consulta);
			
			Servidor.calcularOferta($scope.consulta, function(response){
				
				var resultado = ConfigService.getMsg().pasos["/hipotecarios/consulta"].validaciones.resultadoAprobado;
				//onSuccess
				if((response.data.repagos[0].estado.value == ConfigService.getMsg().pasos["/hipotecarios/consulta"].validaciones.resultadoAprobado || 
						response.data.repagos[1].estado.value == ConfigService.getMsg().pasos["/hipotecarios/consulta"].validaciones.resultadoAprobado) || 
						(response.data.repagos[0].estado.value == ConfigService.getMsg().pasos["/hipotecarios/consulta"].validaciones.resultadoExcedido || 
						response.data.repagos[1].estado.value == ConfigService.getMsg().pasos["/hipotecarios/consulta"].validaciones.resultadoExcedido)){
					
					Servidor.setDatosRepago(response.data);
					$location.path('/hipotecarios/resultados');
				}else{

					Servidor.setDatosRepago(response.data);
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
	
	function validarMontoSolicitud(monto, vivienda){

		var montoReal = parseInt(monto);
		var montoMinimo = parseInt($scope.consulta.viviendas[ConfigService.getMsg().pasos["/hipotecarios/consulta"].validaciones.tasaFija].montoMinimo);
		var montoMaximo = parseInt($scope.consulta.viviendas[ConfigService.getMsg().pasos["/hipotecarios/consulta"].validaciones.tasaFija].montoMaximo);
		var array = buscarPorTipoValor($scope.datosViviendasAMostrar, vivienda);
		var porcentaje = parseFloat(array[0]);
		
		if(montoReal >= montoMinimo){
			if(montoReal <= montoMaximo){
				$scope.errorValidarMontoSolicitud = false;
				$scope.mensajeErrorMonto = "";
			}else{
				$scope.errorValidarMontoSolicitud = true;
				$scope.mensajeErrorMonto = "El monto máximo que puede solicitar es $" + $scope.consulta.viviendas[ConfigService.getMsg().pasos["/hipotecarios/consulta"].validaciones.tasaFija].montoMaximo;
			}
		}else{
			$scope.errorValidarMontoSolicitud = true;
			$scope.mensajeErrorMonto = "El monto mínimo que puede solicitar es $" + $scope.consulta.viviendas[ConfigService.getMsg().pasos["/hipotecarios/consulta"].validaciones.tasaFija].montoMinimo;
		}
		
		if(!$scope.errorValidarMontoSolicitud){
			var montoMaximoAPrestar = parseInt($scope.consulta.valorPropiedad) * porcentaje;
			if(montoReal > montoMaximoAPrestar){
				$scope.errorValidarMontoSolicitud = true;
				$scope.mensajeErrorMonto = array[1];
			}
		}
		
		return !$scope.errorValidarMontoSolicitud;
	};
	
	function cargarViviendasAMostrar(viviendas){
		var indice = 0;
		for(var i = 0; i < viviendas.length; i++){
			if(viviendas[i].nombreDeLinea.indexOf(ConfigService.getMsg().pasos["/hipotecarios/consulta"].validaciones.tasaUVA) == -1){
				
				var validaciones = buscarPorTipoVivienda(ConfigService.getMsg().pasos["/hipotecarios/consulta"].validaciones.tipoVivienda, viviendas[i].nombreDeLinea);
				var index = viviendas[i].nombreDeLinea.indexOf(" ");
				$scope.datosViviendasAMostrar[indice] = {"descripcion": viviendas[i].nombreDeLinea.replace(" ",'\n'), 
														"valor": viviendas[i].nombreDeLinea,
														"montoMaximo": parseInt(viviendas[i].montoMaximo),
														"montoMinimo": parseInt(viviendas[i].montoMinimo),
														"porcentaje" : validaciones[0],
														"mensajeError": validaciones[1],
														"plazo": validaciones[3]
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
				$scope.consulta.viviendas[arrayDatosViviendas[i].nombreDeLinea.indexOf(ConfigService.getMsg().pasos["/hipotecarios/consulta"].validaciones.tasaUVA)== -1 ? ConfigService.getMsg().pasos["/hipotecarios/consulta"].validaciones.tasaFija: ConfigService.getMsg().pasos["/hipotecarios/consulta"].validaciones.tasaUVA] = arrayDatosViviendas[i];
				indice++;
			}
		}
	};

	function buscarPorTipoVivienda(arrayAIterar, cadena){
		var array = [];
		var tipoVivienda;
		for(tipoVivienda in arrayAIterar){
			if(arrayAIterar[tipoVivienda].titulo == cadena){
				array = [arrayAIterar[tipoVivienda].porcentaje, arrayAIterar[tipoVivienda].mensajeError, arrayAIterar[tipoVivienda].mensajeInfo, arrayAIterar[tipoVivienda].plazoMaximo]
				return array;
			}
		}
	};

	function buscarPorTipoValor(arrayAIterar, cadena){
		var array = [];
		var tipoVivienda;
		for(tipoVivienda in arrayAIterar){
			if(arrayAIterar[tipoVivienda].valor == cadena){
				array = [arrayAIterar[tipoVivienda].porcentaje, arrayAIterar[tipoVivienda].mensajeError]
				return array;
			}
		}
	};
}]);