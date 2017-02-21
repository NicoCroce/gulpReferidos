app.controller('ResultadosController', ['$http', '$scope', '$location', 'Servidor', 'ConfigService', function($http, $scope, $location, Servidor, ConfigService){

	$scope.resultados = Servidor.getDatosRepago();
	$scope.resultados.tasaUVA = {};
	$scope.resultados.tasaFija = {};
	$scope.datosConsulta = Servidor.getDatosConsulta();

	$scope.montoMinimo = formatearImporte(200000);
	
	$scope.valMontoSolicitadoTF = false;
	$scope.valMontoSolicitadoTV = false;
	$scope.valAccordionOne = false;
	$scope.tasaFijaAprobada = false;
	$scope.mensajeErrorTasaFija = ConfigService.getMsg().pasos["/hipotecarios/resultados"].mensajeErrorTasaFija;
	$scope.mensajeErrorMontos = ConfigService.getMsg().pasos["/hipotecarios/resultados"].mensajeErrorMontos;
	
	$scope.cargarValores = function(){
		debugger
		if($scope.resultados.repagos[0].tipoTasa == ConfigService.getMsg().pasos["/hipotecarios/consulta"].validaciones.tasaFija && 
			$scope.resultados.repagos[0].estado.value == ConfigService.getMsg().pasos["/hipotecarios/consulta"].validaciones.resultadoResponse){

			cargarValoresTasaFija($scope.resultados, $scope.resultados.repagos[0]);
		}
		if($scope.resultados.repagos[1].tipoTasa == ConfigService.getMsg().pasos["/hipotecarios/consulta"].validaciones.tasaUVA && 
			$scope.resultados.repagos[1].estado.value == ConfigService.getMsg().pasos["/hipotecarios/consulta"].validaciones.resultadoResponse){
		
			cargarValoresTasaUVA($scope.resultados, $scope.resultados.repagos[1]);
		}
	}
	
	$scope.quiero = function(){
		$location.path("/hipotecarios/envio");
	};
	
	$scope.volver = function(){
		$location.path("/hipotecarios/consulta");
	};
	
	$scope.recalculo = function(maximo, montoSolicitud){		
		if(!$scope.montoValido(maximo, montoSolicitud)){
			if($scope.valAccordionOne){
				Servidor.recalcularOferta($scope.resultados.tasaUVA, function(response){
					//onSuccess
					//Servidor.setDatosRepago(response.data);
					//$scope.resultados = Servidor.getDatosRepago();
					$scope.recargarValores(response.data);
				},function(errorResponse){
					//onError
					$location.path('/hipotecarios/error'); 
				});
			}else{
				Servidor.recalcularOferta($scope.resultados.tasaFija, function(response){
					//onSuccess
					//Servidor.setDatosRepago(response.data);
					//$scope.resultados = Servidor.getDatosRepago();
					$scope.recargarValores(response.data);
				},function(errorResponse){
					//onError
					$location.path('/hipotecarios/error'); 
				});
			}
		}

	};
	
	$scope.montoValido = function(maximo, montoSolicitud){
		var valor = parseInt(formatearImporte(montoSolicitud));
		var montoMaximo = parseInt(maximo);
		var montoMinimo = parseInt($scope.montoMinimo);
		if ($scope.valAccordionOne){
			if(valor < montoMaximo  && valor > montoMinimo){
				$scope.valMontoSolicitadoTV = false;
			}else{
				$scope.valMontoSolicitadoTV = true;
			}			
			$scope.resultados.tasaUVA.montoSolicitado = formatearImporte(valor);
			return $scope.valMontoSolicitadoTV;
		}else{			
			if(valor < montoMaximo  && valor > montoMinimo){
				$scope.valMontoSolicitadoTF = false;
			}else{
				$scope.valMontoSolicitadoTF = true;
			}	
			$scope.resultados.tasaFija.montoSolicitado = formatearImporte(valor);
			return $scope.valMontoSolicitadoTF;
		}
	};
	
	$scope.accordion = function(id){
		if(id){
			$scope.valAccordionOne = id;
		}else{
			$scope.valAccordionOne = id;
		}
	};
	
	$scope.cargarValores();

	$scope.recargarValores = function(resultado){
		debugger
		if(resultado.repagos.length > 1){
			$scope.cargarValores();
		}else{
			if(resultado.repagos[0].tipoTasa == ConfigService.getMsg().pasos["/hipotecarios/consulta"].validaciones.tasaFija){
				cargarValoresTasaFija(resultado, $scope.resultados.repagos[0]);
			}else{
				cargarValoresTasaUVA(resultado, $scope.resultados.repagos[0]);
			}
		}
	}

	function cargarValoresTasaFija(resultado, repago){
		$scope.resultados.tasaFija.montoSolicitud = formatearImporte(resultado.montoSolicitado);
		$scope.resultados.tasaFija.montoMaximo = formatearImporte(repago.phEnPesos.montoAprobado);
		$scope.resultados.tasaFija.montoCuota = formatearImporte(repago.phEnPesos.cuota);
		$scope.resultados.tasaFija.ingresoTotal = $scope.datosConsulta.ingresoTotal;
		$scope.resultados.tasaFija.valorPropiedad = $scope.datosConsulta.valorPropiedad;
		$scope.resultados.tasaFija.tipoVivienda = $scope.datosConsulta.tipoVivienda;
		$scope.resultados.tasaFija.minimoConsumoTarjeta = $scope.datosConsulta.minimoConsumoTarjeta;
		$scope.resultados.tasaFija.plazo = 180;
		$scope.resultados.tasaFija.tasaASimular = repago.codigoTasa;
		$scope.tasaFijaAprobada = true;
	}

	function cargarValoresTasaUVA(resultado, repago){
		$scope.resultados.tasaUVA.montoSolicitud = formatearImporte(resultado.montoSolicitado);
		$scope.resultados.tasaUVA.montoMaximo = formatearImporte(repago.phEnPesos.montoAprobado);
		$scope.resultados.tasaUVA.montoCuota = formatearImporte(repago.phEnPesos.cuota);
		$scope.resultados.tasaUVA.ingresoTotal = $scope.datosConsulta.ingresoTotal;
		$scope.resultados.tasaUVA.valorPropiedad = $scope.datosConsulta.valorPropiedad;
		$scope.resultados.tasaUVA.tipoVivienda = $scope.datosConsulta.tipoVivienda;
		$scope.resultados.tasaUVA.minimoConsumoTarjeta = $scope.datosConsulta.minimoConsumoTarjeta;
		$scope.resultados.tasaUVA.plazo = 180;
		$scope.resultados.tasaUVA.tasaASimular = repago.codigoTasa;
	}
	
}]);