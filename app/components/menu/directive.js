angular
    .module('riskApp')
    .directive('menu', [function() {
        
        function menuController($scope) {
            
        }
        
        function linkFunction(scope, element, attributes) {
            
        }	
        
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'components/menu/template.html',
            controller: ['$scope', menuController],
            link: linkFunction
        };
    }]);
