angular
    .module('riskApp')
    .directive('prioProjectStatusMenu', [function() {
        
        function linkFunction(scope, element, attributes) {
            
        }	
        return {
            restrict: 'E',
            replace: true,
            scope: {
                id: "@prioProjectId"
            },
            templateUrl: 'components/projectStatusMenu/template.html',
            link: linkFunction
        };
    }]);
