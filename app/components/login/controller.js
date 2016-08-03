angular
    .module('riskApp')
    .controller('LoginController', [
        '$scope', 
        '$rootScope',
        function (
            $scope, 
            $rootScope
        ) {

            $scope.doLogout = function() {

                $rootScope.user = {
                    'authenticated': false,
                    'email': null
                };

                $window.sessionStorage["user"] = null;
                
                $location.path('/');
            };
        }
    ]);
