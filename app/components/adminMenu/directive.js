angular
    .module('riskApp')
    .directive('prioAdminMenu', [function() {
        
        function linkFunction(scope, element, attributes) {
            
        }	
        
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'components/adminMenu/template.html',
            link: linkFunction
        };
    }]);
