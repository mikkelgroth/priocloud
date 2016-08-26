angular
    .module('riskApp')
    .directive('prioMenu', [function() {
        
        function linkFunction(scope, element, attributes) {
            
        }	
        
        return {
            restrict: 'E',
            replace: true,
            scope: {
                user: "=prioMenuUser"
            },
            templateUrl: 'components/menu/template.html',
            link: linkFunction
        };
    }]);
