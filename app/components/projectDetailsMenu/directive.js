angular
    .module('riskApp')
    .directive('prioProjectDetailsMenu', [function() {
        
        function linkFunction(scope, element, attributes) {
        
        }	
        return {
            restrict: 'E',
            replace: true,
            
            templateUrl: 'components/projectDetailsMenu/template.html',
            link: linkFunction
        };
    }]);
