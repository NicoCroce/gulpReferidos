app.directive('onlyNum', function() {
	return {
		require : 'ngModel',
		link : function(scope, element, attrs, modelCtrl) {
			modelCtrl.$parsers.push(function(inputValue) {
				if (inputValue == undefined)
					return ''
				var transformedInput = inputValue.replace(/[^0-9]/g, '');
				if (transformedInput != inputValue) {
					modelCtrl.$setViewValue(transformedInput);
					modelCtrl.$render();
				}
				return transformedInput;
			});
		}
	};
});

app.directive('toolTip', function() {
	return {
		link : function(scope, element, attrs, modelCtrl) {
			$(element).tooltip();
		}
	};
});


app.directive('copyElement', function() {
	return {
		scope : {
			id : '@'
		},
		link : function(scope, element, attrs, modelCtrl) {
			$(element).css("display", $('#' + attrs.id).css("display"));
			$(element).css('width', $('#' + attrs.id).width() + 'px');
			$(element).css('height', $('#' + attrs.id).height() + 'px');
		}
	};
});

app.directive('onlyDecimal', function() {
	return {
		require : 'ngModel',
		link : function(scope, element, attrs, modelCtrl) {
			modelCtrl.$parsers.push(function(inputValue) {
				if (inputValue == undefined)
					return ''
				var transformedInput = inputValue.replace(/[^0-9]\d*(\.\d+)?$/g, '');
				if (transformedInput != inputValue) {
					modelCtrl.$setViewValue(transformedInput);
					modelCtrl.$render();
				}
				return transformedInput;
			});
		}
	};
});