app.controller('ResultadosController', ['$http', '$scope', '$location', 'Servidor', 'ConfigService', function($http, $scope, $location, Servidor, ConfigService){

	$scope.resultados = Servidor.getDatosRepago();
	$scope.resultados.tasaUVA = {};
	$scope.resultados.tasaFija = {};
	
	$scope.resultados.tasaUVA.montoSolicitado = formatearImporte(200000);
	$scope.resultados.tasaFija.montoSolicitado = formatearImporte(200000);

	$scope.montoMinimo = formatearImporte(200000);
	
	$scope.valMontoSolicitadoTF = false;
	$scope.valMontoSolicitadoTV = false;
	$scope.valAccordionOne = false;
	$scope.tasaFijaAprobada = false;
	$scope.mensajeErrorTasaFija = ConfigService.getMsg().pasos["/hipotecarios/resultados"].mensajeErrorTasaFija;
	$scope.mensajeErrorMontos = "";
	
	$scope.cargarValores = function(){
		//debugger
		if($scope.resultados.resultadoTasaFija.value == ConfigService.getMsg().pasos["/hipotecarios/consulta"].validaciones.resultadoResponse){
			
			$scope.resultados.tasaFija.montoMaximo = formatearImporte($scope.resultados.respuesta.montoMaximoTasaFija);
			$scope.resultados.tasaFija.montoCuota = formatearImporte($scope.resultados.respuesta.cuotaTasaFija.toFixed(2).toString());
			$scope.tasaFijaAprobada = true;
		}
		if($scope.resultados.resultadoUVA.value == ConfigService.getMsg().pasos["/hipotecarios/consulta"].validaciones.resultadoResponse){
		
			$scope.resultados.tasaUVA.montoMaximo = formatearImporte($scope.resultados.respuesta.montoMaximoUVA);
			$scope.resultados.tasaUVA.montoCuota = formatearImporte($scope.resultados.respuesta.cuotaUVA.toFixed(2).toString());
		}
	}
	
	$scope.quiero = function(){
		$location.path("/hipotecarios/envio");
	};
	
	$scope.volver = function(){
		$location.path("/hipotecarios/consulta");
	};
	
	$scope.recalculo = function(){
		
		Servidor.recalcularOferta($scope.resultados.tasaUVA, function(response){
			//onSuccess
		},function(errorResponse){
			//onError
		});
	};
	
	$scope.montoValido = function(maximo, montoSolicitado){
		
		var valor = parseInt(formatearImporte(montoSolicitado));
		var montoMaximo = parseInt(maximo);
		var montoMinimo = parseInt($scope.montoMinimo);
		
		//debugger
		if ($scope.valAccordionOne){
			
			if(valor < montoMaximo  && valor > montoMinimo){
				$scope.valMontoSolicitadoTV = false;
			}else{
				$scope.valMontoSolicitadoTV = true;
			}
			
			$scope.resultados.tasaUVA.montoSolicitado = formatearImporte(valor);
		}else{
			
			if(valor < montoMaximo  && valor > montoMinimo){
				$scope.valMontoSolicitadoTF = false;
			}else{
				$scope.valMontoSolicitadoTF = true;
			}
			
			$scope.resultados.tasaFija.montoSolicitado = formatearImporte(valor);
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
	
}]);