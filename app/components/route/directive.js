angular
    .module('riskApp')
    .directive('prioRouteActive', ['routeService', function(routeService) {
        
        function linkFunction(scope, element, attrs, controller) {
            
            routeService.route.subscribe(function (route) {

                if (route.indexOf(scope.expression) > -1) {
                    element.addClass('active');
                } else {
                    element.removeClass('active');
                }
            });
        }	
        
        return {
            restrict: 'A',
            scope: {
                expression: '@prioRouteActive'
            },
            link: linkFunction
        };
    }]);
