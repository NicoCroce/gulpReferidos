var enviroments = [ {
	name : "pre",
	description : "Pre-produccion",
	host : "desainternet70.arg.igrupobbva"
}, {
	name : "prod",
	description : "Produccion",
	host : "www.bbvafrances.com.ar"
}, {
	name : "qa",
	description : "Calidad",
	host : "was70internettest1"
} ];

function setDLPageInstanceID() {
	var host = window.location.hostname;
	for (var i = 0; i < enviroments; i++) {
		if (enviroments[i].host == host) {
			digitalData.pageInstanceID = enviroments[i].name;
			return;
		}
	}
	digitalData.pageInstanceID = "de";
}

function clearDLVars(tipo) {
	if (tipo == "page") {
		var pageSegment = digitalData.page.pageInfo.pageSegment;
		var channel = digitalData.page.pageInfo.channel;
		var language = digitalData.page.pageInfo.language;
		var bussinessUnit = digitalData.page.pageInfo.bussinessUnit;
		var page = {
			pageInfo : {
				pageName : "",
				pageIntent : "",
				pageSegment : pageSegment,
				sysEnv : "",
				version : "",
				channel : channel,
				language : language,
				level1 : "",
				level2 : "",
				level3 : "",
				level4 : "",
				level5 : "",
				level6 : "",
				level7 : "",
				level8 : "",
				level9 : "",
				level10 : "",
				area : "",
				server : "",
				errorPage : "",
				bussinessUnit : bussinessUnit,
			},
			pageActivity : {
				search : {
					onSiteSearchResults : "",
					onSiteSearchTerm : "",
					originalPage : "",
				},
				nameOfVideoDisplayed : "",
			}
		};

		digitalData.page = page;
		digitalData.user.device.userAgent = "";
		digitalData.user.device.mobile = "";
		digitalData.internalCampaign.attributes.location = "";
		digitalData.internalCampaign.attributes.campaignFormat = "";
		digitalData.internalCampaign.attributes.collectiveCode = "";
		digitalData.internalCampaign.attributes.campaignName = "";

	} else if (tipo == "application") {
		var application = {
			transactionID : "",
			application : {
				type : "",
				name : "",
			},
			fulfilmentModel : "",
			amount : "",
			feeAmount : "",
			numberOfFees : "",
			paymentDate : "",
			paymentType : "",
			serviceCharge : "",
			typology : "",
			currency : "",
			programTypeHired : "",
			offer : "",
			operationNumber : "",
			term : "",
			interestRate : "",
			process : "",
			step : "",
			interactionLevel : "",
			state : "",
			errorType : "",
		};
		digitalData.visitorInfo.profile = "";
		digitalData.application = application;

	} else if (tipo == "products") {
		var product = {
			primaryCategory : "",
			productSubtype : "",
			productName : "",
		};

		digitalData.product = product;

	} else if (tipo == "pageChannel") {
		digitalData.page.pageInfo.pageChannel = "";

	} else if (tipo == "language") {
		digitalData.page.pageInfo.language = "";

	} else if (tipo == "userState") {
		digitalData.user.userState = "";

	} else if (tipo == "campaign") {
		digitalData.internalCampaign.event.eventInfo.eventAction = "";
		digitalData.internalCampaign.event.eventInfo.siteActionName = "";

	}

}

function setDLArea(area) {
	digitalData.page.pageInfo.area = area;
}

function setDLAreaAutomatically() {
	var dominiosPublicos = [ "bbvafrances.com.ar", "bancofrances" ];
	var dominiosPrivados = [ "hb.bbv.com.ar" ];
	var url = window.location.href;
	var area = "";
	for (var i = 0; i < dominiosPublicos.length; i++) {
		if (url.indexOf(dominiosPublicos[i]) > -1) {
			setDLArea("publica");
			return;
		}
	}
	for (var j = 0; j < dominiosPrivados.length; j++) {
		if (url.indexOf(dominiosPrivados[j]) > -1) {
			setDLArea("privada");
			return;
		}
	}
	setDLArea("");
}

function getDLArea() {
	return digitalData.page.pageInfo.area;
}

function setDLSegment(segment) {
	digitalData.page.pageInfo.pageSegment = segment;
}

function getDLSegment() {
	return digitalData.page.pageInfo.pageSegment;
}

function setDLLevel(level, levelDescription) {
	switch (level) {
	case 1:
		digitalData.page.pageInfo.level1 = levelDescription;
		break;
	case 2:
		digitalData.page.pageInfo.level2 = levelDescription;
		break;
	case 3:
		digitalData.page.pageInfo.level3 = levelDescription;
		break;
	case 4:
		digitalData.page.pageInfo.level4 = levelDescription;
		break;
	case 5:
		digitalData.page.pageInfo.level5 = levelDescription;
		break;
	case 6:
		digitalData.page.pageInfo.level6 = levelDescription;
		break;
	case 7:
		digitalData.page.pageInfo.level7 = levelDescription;
		break;
	case 8:
		digitalData.page.pageInfo.level8 = levelDescription;
		break;
	case 9:
		digitalData.page.pageInfo.level9 = levelDescription;
		break;
	case 10:
		digitalData.page.pageInfo.level10 = levelDescription;
		break;
	default:
		break;
	}
}

function getDLLevel(level) {
	var levelValue = null;
	switch (level) {
	case 1:
		levelValue = digitalData.page.pageInfo.level1;
		break;
	case 2:
		levelValue = digitalData.page.pageInfo.level2;
		break;
	case 3:
		levelValue = digitalData.page.pageInfo.level3;
		break;
	case 4:
		levelValue = digitalData.page.pageInfo.level4;
		break;
	case 5:
		levelValue = digitalData.page.pageInfo.level5;
		break;
	case 6:
		levelValue = digitalData.page.pageInfo.level6;
		break;
	case 7:
		levelValue = digitalData.page.pageInfo.level7;
		break;
	case 8:
		levelValue = digitalData.page.pageInfo.level8;
		break;
	case 9:
		levelValue = digitalData.page.pageInfo.level9;
		break;
	case 10:
		levelValue = digitalData.page.pageInfo.level10;
		break;
	default:
		break;
	}
	return levelValue;
}

function setDLPageIntent(pageIntent) {
	digitalData.page.pageInfo.pageIntent = pageIntent;
}

function setDLServer() {
	digitalData.page.pageInfo.server = window.location.hostname;
}

function setDLUserAgent() {
	digitalData.user.device.userAgent = navigator.userAgent;
}

function isMobile() {
	var isMobile = false; // initiate as false
	// device detection
	if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i
			.test(navigator.userAgent)
			|| /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i
					.test(navigator.userAgent.substr(0, 4)))
		isMobile = true;
}

function setDLMobile() {
	if (isMobile()) {
		digitalData.user.device.mobile = "si";
	} else {
		digitalData.user.device.mobile = "no";
	}
}

function setDLUserState(userState) {
	digitalData.user.userState = userState;
}

function setDLSysEnv(sysEnv) {
	digitalData.page.pageInfo.sysEnv = sysEnv;
}

function setDLVersion(version) {
	digitalData.page.pageInfo.version = version;
}

function setDLChannel(channel) {
	digitalData.page.pageInfo.channel = channel;
}

function setDLLanguage(language) {
	digitalData.page.pageInfo.language = language;
}

function setDLGeoRegion(geoRegion) {
	digitalData.page.pageInfo.geoRegion = geoRegion;
}

function setDLBussinessUnit(bussinessUnit) {
	digitalData.page.pageInfo.bussinessUnit = bussinessUnit;
}

function setDLPageName(pageName) {
	digitalData.page.pageInfo.pageName = pageName;
}

function setDLApplicationType(applicationType) {
	digitalData.application.application.type = applicationType;
}

function setDLApplicationName(applicationName) {
	digitalData.application.application.name = applicationName;
}

function setDLFulfillmentModel(fulfillmentModel) {
	digitalData.application.fulfillmentModel = fulfillmentModel;
}

function setDLApplicationProcess(appProcess) {
	digitalData.application.process = appProcess;
}

function setDLApplicationStep(appStep) {
	digitalData.application.step = appStep;
}

function setDLApplicationState(appState) {
	digitalData.application.state = appState;
}

function setDLProductPrimaryCategory(productPrimaryCategory) {
	digitalData.product.primaryCategory = productPrimaryCategory;
}

function setDLProductSubtype(productSubtype) {
	digitalData.product.productSubtype = productSubtype;
}

function setDLProductName(productName) {
	digitalData.product.productName = productName;
}

function setDLApplicationAmount(offerAmount) {
	digitalData.application.amount = offerAmount;
}

function setDLApplicationOffer(offer) {
	digitalData.application.offer = offer;
}

function setDLApplicationTransactionID(transactionID){
	digitalData.application.transactionID = transactionID;
}

function setDLApplicationOperationNumber(operationNumber){
	digitalData.application.operationNumber = operationNumber;
}

function setDLApplicationTypology(typology){
	digitalData.application.typology = typology;
}

function applyNewTransactionID(transactionID){
	setDLApplicationTransactionID(transactionID);
}

function applyNewOperationNumber(operationNumber){
	setDLApplicationOperationNumber(operationNumber);
}

function chageDL(levels, applicationName, appStep, appState, appProductName,
		offerAmount, applicationOffer, typology) {
	// DL Properties
	setDLPageInstanceID();
	
	// DL PageInfo
	setDLPageIntent("transaccion");
	setDLArea("publica");
	setDLSegment("general");
	var pageName = getDLArea() + ":" + getDLSegment();
	for (var i = 0; i < levels.length; i++) {
		setDLLevel((i + 1), levels[i]);
		pageName += ":" + getDLLevel((i + 1));
	}
	setDLPageName(pageName);
	setDLSysEnv("escritorio");
	//setDLVersion("1.0");
	setDLChannel("online");
	setDLLanguage("ES");
	obtenerGeoLocalizacion();
	setDLServer();
	setDLBussinessUnit("BBVA Frances");
	
	// DL User
	setDLUserAgent();
	setDLMobile();
	setDLUserState("no logado");
	
	// DL Application
	setDLApplicationType("contratacion");
	setDLApplicationName(applicationName);
	setDLFulfillmentModel("offline");
	//setDLApplicationProcess(applicationName);
	setDLApplicationStep(appStep);
	setDLApplicationState(appState);
	setDLApplicationAmount(formatAmount(offerAmount));
	setDLApplicationOffer(applicationOffer);
	//setDLApplicationTypology(typology);

	// DL Product
	setDLProductPrimaryCategory("prestamos");
	setDLProductSubtype("prestamos hipotecarios");
	setDLProductName(appProductName);

}

function formatAmount(offerAmount){
	// Eliminamos los ceros
	return offerAmount.toString().replace(".", "");
	
}

function obtenerGeoLocalizacion() {
	setDLGeoRegion("");
	return;
	// Chequeo por HTML5
	// if(window.location){
	// navigator.geolocation.getCurrentPosition(definirGEO);
	// }else{
		// Browser NO soporta GEOLocalizacion
	// setDLGeoRegion("N/A");
	// }
}

function definirGEO(posicion) {
	var lat = posicion.coords.latitude;
	var lng = posicion.coords.longitude;
	$.get(
			"https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat
					+ "," + lng + "&sensor=false", function(data) {
		var addresses = data.results[0].address_components;
				for (var i = 0; i < addresses.length; i++) {
					if (addresses[i].types[0] == 'country') {
				setDLGeoRegion(addresses[i].short_name);
				return;
			}
		}
		setDLGeoRegion("N/A");
			}).fail(function(error) {
		setDLGeoRegion("N/A");
	});
	
}