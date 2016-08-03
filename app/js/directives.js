angular.module('riskApp').directive('menu', [function() {
	
	function menuController($scope) {
		
		$scope.showPanel = function(index) {
			
			$('div[id*=\'linkdiv\']').addClass('hide');
			$('#linkdiv' + index).removeClass('hide');
		};
	}
	
	function linkFunction(scope, element, attributes) {
		
		
	}	
	
	return {
		restrict: 'AE',
		replace: true,
		scope: {
			user: "=user",
			route: "=route"
		},
		templateUrl: 'partials/Menu.html',
		controller: ['$scope', menuController],
		link: linkFunction
	};
	
}]);