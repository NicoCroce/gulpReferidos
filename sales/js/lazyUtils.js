String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

jQuery.loadScript = function (url, callback) {
    jQuery.ajax({
        url: url,
        dataType: 'script',
        success: callback,
        async: false
    });
}

function loadModules(modules){
	for(i = 0; i < modules.length; i++){
		$.loadScript(modules[i], function(){
			//callback cuando se carga
		});
	}
}

function loadRoutes(rp, pasos, jsPath, htmlPath){
	for(i = 0; i < pasos.length; i++){
		var key = pasos[i];
		var name = key.substring(1);
		var controllerName = name.substring(name.lastIndexOf('/') + 1);
		
		rp = rp.when(key, {
            templateUrl: htmlPath + controllerName + '.html',
        	controller: controllerName.capitalizeFirstLetter() + 'Controller' //,
        });
	}
	
	rp = rp.when('/inexistente', {
		templateUrl: 'views/paginaInexistente.html',
		controller: ''
	});
			
	
	rp.otherwise({
        redirectTo: '/inexistente'
    });
//	
//	setTimeout(function(){
//		for(i = 0; i < pasos.length; i++){
//			var key = pasos[i];
//			var name = key.substring(1);
//			var controllerName = name.substring(name.lastIndexOf('/') + 1);
//			
//			$.loadScript(jsPath + controllerName + '.js', function(){
//				//callback cuando se carga
//			});
//			
//		}
//		
//	}, 20);
}

function obtainModuleName(hash){
	return hash.split('/')[1]
}

function loadStyles(styles){
	for(var i = 0; i < styles.length; i++){
		var style = styles[i];
		
		var head  = document.getElementsByTagName('head')[0];
		var link  = document.createElement('link');
		link.rel  = 'stylesheet';
		link.type = 'text/css';
		link.href = style;
		link.media = 'all';
		head.appendChild(link);
	}
}


