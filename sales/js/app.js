var app = angular.module('bbvaApp', ['ngRoute', 'ngSanitize', 'ui.bootstrap', 'ngResource'])
var appConfigCache = {};
appConfigCache.campaign = null;
appConfigCache.json = null;

app.config(['$routeProvider', '$locationProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$httpProvider',
	function ($routeProvider, $locationProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $httpProvider) {
	
		//Intercepción de errores para mostrar la consola debug (mobile)
		$httpProvider.interceptors.push(function($q) {
			return {
				responseError : function(rejection, sd) {
					$("#divConsole").append("<span class='consola-error'><span>" + rejection.config.method + "</span><span>" + rejection.config.url + "</span><span>" + rejection.status + "</span><span>" + rejection.statusText + "</span></span>");
					
					return $q.reject(rejection);
				}
			};
		});
		

	
		/// app def
		app.controller = $controllerProvider.register;
	    app.directive = $compileProvider.directive;
	    app.filter = $filterProvider.register;
	    app.factory = $provide.factory;
	    app.service = $provide.service;
	    app.constant = $provide.constant;
	    app.value = $provide.value;
		
	    var moduleName = obtainModuleName(location.hash);
	    var campaign = getParameterByName("camp", location.href);
	    
	    if(campaign == null || campaign === ''){
	    	campaign = 'ofertasDigitales';
	    }
	    
		syncRequest('modules/' + moduleName + '/conf/' + campaign + '.json', 'GET', function(data){
			appConfigCache.campaign = campaign;
			appConfigCache.json = data;
			appConfigCache.moduleName = moduleName;
			
			
			//cargo styles default
			/*if(data.styles && data.styles.length > 0){
				data.styles.unshift('modules/' + moduleName + '/css/' + campaign  + '.css');			//cargo style por defecto
				loadStyles(data.styles);
			}else{
				data.styles = [];
				data.styles.unshift('modules/' + moduleName + '/css/' + campaign  + '.css');			//cargo style por defecto
				loadStyles(data.styles);
			}*/
			
			//Cargo services y controllers de la app
			loadStyles('modules/' + moduleName + '/css/style.css');
			loadAppScripts('modules/' + moduleName + '/js/concat/scriptApp.js');
			
			var pasosIds = Object.keys(data.pasos);
			
			//Cargo controllers y route configs
			loadRoutes($routeProvider, pasosIds, 'modules/' + moduleName + '/js/controllers/', 'modules/' + moduleName + '/views/');
			
		}, function(error){
			alert("Error: " + error);
		});
		
	    
		$locationProvider.hashPrefix('');
	}
]);

app.run(['$rootScope', '$location', '$timeout', 'ConfigService', function($rootScope, $location, $timeout, ConfigService) {
//	ConfigService.init('ofertasDigitales');
	
	$rootScope.msg = function(){
		return ConfigService.getMsg();
	};
	
	$rootScope.campaign = function(){
		return ConfigService.getCampaign();
	};
	
	$rootScope.getModuleName = function(){
		return ConfigService.getModuleName();
	};
	
	$rootScope.showDebugSwitch = function(){
		return ($location.host() !== 'www.bbvafrances.com.ar' || getParameterByName("debug", location.href))
	};
	
	
	ConfigService.setTargetHost(inyectarHost());
	
	$rootScope.$on('$viewContentLoaded', function(e, next, cur){
		setTimeout(function(){
			window.scrollTo(0,0);
		},800);
	});
	
	$rootScope.$on('$routeChangeSuccess', function(e, next, cur){
		var nextPath = next.$$route.originalPath;
		
		var paso = ConfigService.getMsg().pasos[nextPath];
		$rootScope.pasos = ConfigService.getMsg().cantPasos;
		
		$rootScope.paso = paso;
		$rootScope.proximoPaso = ConfigService.getMsg().pasos[paso.proximo];
		
	});
	
}]);

//app.factory('$exceptionHandler', ['$injector', function($injector) {
//    return function errorCatcherHandler(exception, cause) {
//    	var $logging = $injector.get('$rootScope').msg().logging;
//    	var $moduleName = $injector.get('$rootScope').getModuleName();
//
//    	if($logging != null && $logging.firebase){
//    		 errorToFirebase($moduleName, exception.message, exception.stack);
//    	}
//    	
//    	$("#divConsole").append("<span class='consola-error'><span>ERROR " + exception.message + "</span><span class='stacktrace'>" + exception.stack + "</span></span>");
//    	console.error("PROXY CONSOLE: " + exception.message + ". Stacktrace: " + exception.stack);
//    };
//}]);

