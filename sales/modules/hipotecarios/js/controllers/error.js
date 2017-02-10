app.controller('ErrorController', ['$scope', function($scope){

	$scope.volver = function(){
		history.back();
	};
	
}]);