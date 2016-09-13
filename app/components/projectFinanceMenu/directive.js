angular
    .module('riskApp')
    .directive('prioProjectFinanceMenu', [function() {
        
        function linkFunction(scope, element, attributes) {
            
        }	
        return {
            restrict: 'E',
            replace: true,
            scope: {
                id: "@prioProjectId"
            },
            templateUrl: 'components/projectFinanceMenu/template.html',
            link: linkFunction
        };
    }]);
