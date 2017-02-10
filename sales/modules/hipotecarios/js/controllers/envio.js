app.controller('EnvioController', ['$http', '$scope', '$location', function($http, $scope, $location){
	$scope.envio = {};
	
	$scope.envio.sucursal = undefined;
	

	$.getJSON("conf/sucursales.json").then(function(data){
	    $scope.sucursales = data;  
	});
	
	$.getJSON("conf/localidades/provincias.json").then(function(data){
	    $scope.provincias = data;  
	});
	
	$scope.$watch('envio.provincia', function(){
		var $provincia = $scope.envio.provincia;
		if(typeof $provincia != 'undefined'){
			$.getJSON("conf/localidades/" + $provincia.id + ".json").then(function(data){
				$scope.localidades = data;
				$scope.envio.localidad = null;
			});
		}else{
			$scope.localidades = [];
			$scope.envio.localidad = null;
		}
		
	}, true);
	
	
	
	/////////////////////////////////////////////////////////
	
	$scope.enviar = function(){
		$location.path("/hipotecarios/gracias");
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
	
	
	$scope.addNewEmail();
	
}]);