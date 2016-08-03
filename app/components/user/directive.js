angular
    .module('riskApp')
    .directive('userAuthenticated', ['userService', function(userService) {
        
        function linkFunction(scope, element, attrs, controller) {
            
            userService.userAuthenticated.subscribe(function(isAuthenticated) {

                if (isAuthenticated === scope.data.display) {
                    element.show();
                } else {
                    element.hide();
                }
            });
        }	
        
        return {
            restrict: 'A',
            scope: {
                data: '=userAuthenticated'
            },
            link: linkFunction
        };
    }]);
