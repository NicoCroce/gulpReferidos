app.controller('ResultadosController', ['$http', '$scope', '$location', 'Servidor', function($http, $scope, $location, Servidor){

	$scope.resultados = {};
	$scope.resultados.tasaVariable = {};
	$scope.resultados.tasaFija = {};
	
	$scope.resultados.tasaVariable.montoSolicitado = formatearImporte(2402020);
	$scope.resultados.tasaFija.montoSolicitado = formatearImporte(1350430);
	
	$scope.resultados.tasaVariable.montoMaximo = formatearImporte(3000000);
	$scope.resultados.tasaVariable.montoCuota = formatearImporte(2500);
	$scope.resultados.tasaFija.montoMaximo = formatearImporte(3000000);
	$scope.resultados.tasaFija.montoCuota = formatearImporte(2500);
	$scope.montoMinimo = formatearImporte(200000);
	
	$scope.valMontoSolicitadoTF = false;
	$scope.valMontoSolicitadoTV = false;
	$scope.valAccordionOne = false;
	
	$scope.quiero = function(){
		$location.path("/hipotecarios/envio");
	};
	
	$scope.volver = function(){
		$location.path("/hipotecarios/consulta");
	};
	
	$scope.recalculo = function(){
		
		debugger
		Servidor.recalcularOferta($scope.resultados.tasaVariable, function(response){
			//onSuccess
		},function(errorResponse){
			//onError
		});
	};
	
	$scope.montoValido = function(maximo, montoSolicitado){
		
		var valor = parseInt(formatearImporte(montoSolicitado));
		var montoMaximo = parseInt(maximo);
		var montoMinimo = parseInt($scope.montoMinimo);
		
		if ($scope.valAccordionOne){
			
			if(valor < montoMaximo  && valor > montoMinimo){
				$scope.valMontoSolicitadoTV = false;
			}else{
				$scope.valMontoSolicitadoTV = true;
			}
			
			$scope.resultados.tasaVariable.montoSolicitado = formatearImporte(valor);
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
	
}]);