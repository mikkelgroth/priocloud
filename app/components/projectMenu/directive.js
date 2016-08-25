angular
    .module('riskApp')
    .directive('prioProjectMenu', [function() {
        
        function linkFunction(scope, element, attributes) {
            
        }	
        
        return {
            restrict: 'E',
            replace: true,
            scope: {
                id: "@prioProjectId",
                title: "@prioProjectTitle"
            },
            templateUrl: 'components/projectMenu/template.html',
            link: linkFunction
        };
    }]);
