app.service('ConfigService', [ '$http', "$location", '$routeParams', '$rootScope', function($http,$location, $routeParams,$rootScope) {
	var campaign = '';
	var targetHost = '';
	var moduleName = ''; 
	var msg = {};
	var debug = false;
	
	this.isDebug = function(){
		return debug;
	}

	this.setDebug = function(value){
		value = (value == null ? false : value);
		debug = value;
	};
	
	this.getCampaign = function(){
		return campaign;
	};

	this.getModuleName = function(){
		return moduleName;
	};
	
	this.setTargetHost = function(th){
		targetHost = th;
	};
	
	this.getTargetHost = function(){
		return targetHost;
	};
	
	this.getMsg = function(){
		return msg;
	};
	
	this.init = function(){
		if(appConfigCache != null){
			msg = appConfigCache.json;
			campaign = appConfigCache.campaign;
			moduleName = appConfigCache.moduleName;
		}else{
			$("#vista").empty().append("<h1>Página inexistente</h1>");
			appConfigCache = null;
		}
	};
	

	this.init();
}]);
