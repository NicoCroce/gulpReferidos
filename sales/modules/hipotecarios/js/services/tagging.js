var taggingService = app.service('Tagging', ['$http','ConfigService', function($http, ConfigService){
	
	var config = null;
	
	this.getConfig = function(){
		return config;
	}
	
	this.init = function(){
		var mainConfig = ConfigService.getMsg();
		if(mainConfig.tagging){
			config = mainConfig.tagging;
		}
	}
	
	this.init();
	
}]);