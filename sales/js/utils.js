$(function(){
	//Arma el modal antes que sea lanzado
	$(document).on("click", ".masInfo", function(){
		var title = $(this).data('title');
		var body = $(this).data('body');
		$('#modalTitle').html(title);
		$('#modalBody').html(body);
	});
});

function syncRequest(url, method, onSuccess, onError){
	$.ajax({
		async : false,
		url : url,
		type : method,
		dataType: "json",
		success: onSuccess,
		error: onError
	});
}

function inyectarHost(){

	var h = getParameterByName("targetHost", location.href);
	
	if(h != null && h != ''){
		return h;
	}else{
		return "";
	}
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}


function removeElement(id, array){
	for(var i = 0; i < array.length;  i++){
		if(array[i].id === id){
			array.splice(i, 1);
			return;
		}
	}
}

function addElement(preffix, array){
	array.push(
		{
			'id': preffix + '-' + (array.length + 1),
			'valor': ''
		}
	);
}

function toggleCollapse(col){
	$(col).find('.t-title, .t-toggle').attr('data-toggle', 'collapse');
}

function transformRequest(obj) {
	var str = [];
	for ( var key in obj) {
		if (obj[key] instanceof Array) {
			for ( var idx in obj[key]) {
				var subObj = obj[key][idx];
				for ( var subKey in subObj) {
					str.push(encodeURIComponent(key) + "[" + idx + "][" + encodeURIComponent(subKey) + "]=" + encodeURIComponent(subObj[subKey]));
				}
			}
		} else {
			str.push(encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]));
		}
	}
	return str.join("&");
}

function formatearImporte(valor) {
	var decimales;
	if (isInteger(valor)) {
		valor = valor + ",00";
	} else {
		valor = Reemplazar(valor, '.', ',');
		decimales = valor.substring(valor.indexOf(","));
		valor = valor.substring(0, valor.indexOf(","));
		valor = valor + completarDer(decimales, '0', 3);
	}
	return valor;
}

function isInteger(value) {
	/* devuelve true si el valor es Entero, en caso contrario devuelve false */
	return /^(?:\+)?\d+$/.test(value);
}

function Reemplazar(sCadena, Cual, PorCual) {
	var retVal = "";
	var i = 0;
	if (("" + sCadena).length == 0) {
		return retVal;
	}
	for (i = 0; i < sCadena.length; i++) {
		if (sCadena.charAt(i) == Cual) {
			retVal = retVal + PorCual;
		} else {
			retVal = retVal + sCadena.charAt(i);
		}
	}
	return retVal;
}

function completarDer(valor, caracter, longitud) {
	valor = String(valor);
	var lonStr = longitud - valor.length;
	for (i = 1; i <= lonStr; i++) {
		valor = valor + caracter;
	}
	return valor;
}

function importeACentavos(valor) {
	var decimales;
	if (isInteger(valor)) {
		valor = valor + "00";
	} else {
		valor = Reemplazar(valor, ',', '.');
		decimales = valor.substring(valor.indexOf(".") + 1);
		valor = valor.substring(0, valor.indexOf("."));
		valor = valor + completarDer(decimales, '0', 2);
	}
	return Math.abs(valor);
}

function scrollToTopError(){
	//Voy al primero
	$("html, body").animate({ scrollTop: $($(".errorEnInput")[0]).offset().top - 120}, 400);
}

function errorToFirebase(moduleName, errorMessage, errorStacktrace){
	
	var fecha = new Date();
	
	var dia = fecha.getDate();
	var mes = fecha.getMonth() + 1;
	var anio = fecha.getFullYear();
	
	dia = (dia < 10 ? '0' + dia : dia);
	mes = (mes < 10 ? '0' + mes : mes);
	
	firebase.database().ref('salesEngine/' + moduleName + '/' + anio + '/' + mes + '/' + dia + '/' + new Date().getTime()).set({ 
		errorMessage: errorMessage,
		errorStacktrace: errorStacktrace,
		timestamp: '' + new Date() + ''
	});
	
}
