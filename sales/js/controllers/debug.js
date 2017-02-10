app.controller('DebugController', ['$scope', '$location', '$compile', 'ConfigService', function($scope, $location, $compile, ConfigService){
	$scope.debug = getParameterByName("debug", location.href);

	$scope.$watch('debug', function(){
		ConfigService.setDebug($scope.debug);
		
	}, true);
	
	
	$scope.setDebug = function(value){
		$scope.debug = value;
	};
	
	$scope.moveTo = function(to){
		$location.path(to);
	}
	
	
	this.init = function(){
		var pasosIds = Object.keys(ConfigService.getMsg().pasos);
		//Genero navegación en consola debug
		var $botones = $("<div/>");
		$("#navDebug").empty();
		angular.forEach(pasosIds, function(value, key) {
			var controllerName = value.substring(value.lastIndexOf('/') + 1);
			$botones.append("<input type='button' value='" + controllerName + "' ng-click='moveTo(\"" + value + "\")'>")
		});
		
		$botones.appendTo("#navDebug");
		
		$compile($botones)($scope);
	};

	this.init();

}]);

