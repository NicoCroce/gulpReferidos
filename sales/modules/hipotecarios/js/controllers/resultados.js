app.controller('ResultadosController', ['$http', '$scope', '$location', 'Servidor', 'ConfigService', function($http, $scope, $location, Servidor, ConfigService){

	$scope.resultados = Servidor.getDatosRepago();
	$scope.resultados.tasaUVA = {};
	$scope.resultados.tasaFija = {};
	$scope.datosConsulta = Servidor.getDatosConsulta();
	$scope.plazoMaximo = parseInt($scope.datosConsulta.plazoMaximo);
	$scope.plazos = [];
	$scope.plazoSeleccionado = $scope.plazoMaximo;

	$scope.montoMinimo = formatearImporte(200000);
	
	$scope.valMontoSolicitadoTF = false;
	$scope.valMontoSolicitadoTV = false;
	$scope.valAccordionOne = false;
	$scope.tasaFijaAprobada = false;
	$scope.mensajeErrorTasaFija = ConfigService.getMsg().pasos["/hipotecarios/resultados"].mensajeErrorTasaFija;
	$scope.mensajeErrorMontos = ConfigService.getMsg().pasos["/hipotecarios/resultados"].mensajeErrorMontos;
	
	$scope.cargarValores = function(){
		if($scope.resultados.repagos[0].tipoTasa == ConfigService.getMsg().pasos["/hipotecarios/consulta"].validaciones.tasaFija && (
			$scope.resultados.repagos[0].estado.value == ConfigService.getMsg().pasos["/hipotecarios/consulta"].validaciones.resultadoAprobado ||
			$scope.resultados.repagos[0].estado.value == ConfigService.getMsg().pasos["/hipotecarios/consulta"].validaciones.resultadoExcedido)){

			cargarValoresTasaFija($scope.resultados, $scope.resultados.repagos[0]);
		}
		if($scope.resultados.repagos[1].tipoTasa == ConfigService.getMsg().pasos["/hipotecarios/consulta"].validaciones.tasaUVA && (
			$scope.resultados.repagos[1].estado.value == ConfigService.getMsg().pasos["/hipotecarios/consulta"].validaciones.resultadoAprobado ||
			$scope.resultados.repagos[1].estado.value == ConfigService.getMsg().pasos["/hipotecarios/consulta"].validaciones.resultadoExcedido)){
		
			cargarValoresTasaUVA($scope.resultados, $scope.resultados.repagos[1]);
		}
		cargarPlazos();
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
					$scope.recargarValores(response.data);
				},function(errorResponse){
					//onError
					$location.path('/hipotecarios/error'); 
				});
			}else{
				Servidor.recalcularOferta($scope.resultados.tasaFija, function(response){
					//onSuccess
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
			if(valor <= montoMaximo  && valor >= montoMinimo){
				$scope.valMontoSolicitadoTV = false;
			}else{
				$scope.valMontoSolicitadoTV = true;
			}			
			$scope.resultados.tasaUVA.montoSolicitado = formatearImporte(valor);
			return $scope.valMontoSolicitadoTV;
		}else{			
			if(valor <= montoMaximo  && valor >= montoMinimo){
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
			$scope.montoValido($scope.resultados.tasaUVA.montoMaximo, $scope.resultados.tasaUVA.montoSolicitud)
		}else{
			$scope.valAccordionOne = id;
			$scope.montoValido($scope.resultados.tasaFija.montoMaximo , $scope.resultados.tasaFija.montoSolicitud)
		}
	};
	
	$scope.cargarValores();

	$scope.recargarValores = function(resultado){
		if(resultado.repagos.length > 1){
			$scope.cargarValores();
		}else{
			if(resultado.repagos[0].tipoTasa == ConfigService.getMsg().pasos["/hipotecarios/consulta"].validaciones.tasaFija){
				cargarValoresTasaFija(resultado, resultado.repagos[0]);
			}else{
				cargarValoresTasaUVA(resultado, resultado.repagos[0]);
			}
		}
	}

	function cargarValoresTasaFija(resultado, repago){
		$scope.resultados.tasaFija.montoSolicitud = formatearImporte(resultado.montoSolicitado);
		$scope.resultados.tasaFija.montoAprobado = formatearImporte(repago.phEnPesos.montoAprobado);
		$scope.resultados.tasaFija.montoMaximo = formatearImporte(repago.phEnPesos.montoMaximoAprobado.toString());
		$scope.resultados.tasaFija.montoCuota = formatearImporte(repago.phEnPesos.cuota);
		$scope.resultados.tasaFija.ingresoTotal = $scope.datosConsulta.ingresoTotal;
		$scope.resultados.tasaFija.valorPropiedad = $scope.datosConsulta.valorPropiedad;
		$scope.resultados.tasaFija.tipoVivienda = $scope.datosConsulta.tipoVivienda;
		$scope.resultados.tasaFija.minimoConsumoTarjeta = $scope.datosConsulta.minimoConsumoTarjeta;
		$scope.resultados.tasaFija.plazo = $scope.plazoSeleccionado;
		$scope.resultados.tasaFija.tasaASimular = repago.codigoTasa;
		$scope.tasaFijaAprobada = true;
	}

	function cargarValoresTasaUVA(resultado, repago){
		$scope.resultados.tasaUVA.montoSolicitud = formatearImporte(resultado.montoSolicitado);
		$scope.resultados.tasaUVA.montoAprobado = formatearImporte(repago.phEnPesos.montoAprobado);
		$scope.resultados.tasaUVA.montoMaximo = formatearImporte(parseFloat(repago.phEnPesos.montoMaximoAprobado).toFixed(2));
		$scope.resultados.tasaUVA.montoCuota = formatearImporte(repago.phEnPesos.cuota);
		$scope.resultados.tasaUVA.ingresoTotal = $scope.datosConsulta.ingresoTotal;
		$scope.resultados.tasaUVA.valorPropiedad = $scope.datosConsulta.valorPropiedad;
		$scope.resultados.tasaUVA.tipoVivienda = $scope.datosConsulta.tipoVivienda;
		$scope.resultados.tasaUVA.minimoConsumoTarjeta = $scope.datosConsulta.minimoConsumoTarjeta;
		$scope.resultados.tasaUVA.plazo = $scope.plazoMaximo;
		$scope.resultados.tasaUVA.tasaASimular = repago.codigoTasa;
	}

	function cargarPlazos(){
		if( $scope.plazoMaximo < ConfigService.getMsg().pasos["/hipotecarios/consulta"].validaciones.plazoMaximo){
			$scope.plazos = [{"anios":"1", "meses":"12"},{"anios":"2", "meses":"24"},{"anios":"3", "meses":"36"},{"anios":"4", "meses":"48"},{"anios":"5", "meses":"60"},{"anios":"6", "meses":"72"},{"anios":"7", "meses":"84"}, {"anios":"8", "meses":"96"}];
		}else{
			$scope.plazos = [{"anios":"1", "meses":"12"},{"anios":"2", "meses":"24"},{"anios":"3", "meses":"36"},{"anios":"4", "meses":"48"},{"anios":"5", "meses":"60"},{"anios":"6", "meses":"72"},{"anios":"7", "meses":"84"}, {"anios":"8", "meses":"96"},{"anios":"9", "meses":"108"},{"anios":"10", "meses":"120"},{"anios":"11", "meses":"132"},{"anios":"12", "meses":"144"},{"anios":"13", "meses":"156"},{"anios":"14", "meses":"168"},{"anios":"15", "meses":"180"}];
		}
	}
	
}]);