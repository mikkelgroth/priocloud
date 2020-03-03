angular
    .module('riskApp')
    .directive('prioMenu', [function() {
        
        function linkFunction(scope, element, attributes) {
            
        }	
        
        return {
            restrict: 'E',
            replace: true,
            
            templateUrl: 'components/menu/template.html',
            link: linkFunction
        };
    }]);
