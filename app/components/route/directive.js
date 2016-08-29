angular
    .module('riskApp')
    .directive('prioRouteActive', ['routeService', function(routeService) {
        
        function linkFunction(scope, element, attrs, controller) {
            
            var expressions = [scope.expression];
            if (scope.expression.indexOf('|') > -1) {
                expressions = scope.expression.split('|')
            }

            routeService.route.subscribe(function (route) {

                var isActive = false;
                for (var i = 0; i < expressions.length; i++) {

                    if (route.indexOf('/' + expressions[i]) === 0) {

                        isActive = true;
                        break;
                    }
                }

                if (isActive) {
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
