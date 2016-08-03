angular
    .module('riskApp')
    .controller('LoginController', [
        '$scope',
        '$http',
        '$location',
        'userService',
        function (
            $scope,
            $http,
            $location,
            userService
        ) {

            $scope.login = function () {

                $http
                    .post(USERSERVER + '?action=login&application=priocloud&email=' + $scope.email + '&password=' + $scope.password)
                    .success(function (data, status, headers, config) {

                        if (!data.authenticated) {

                            alert('Login failure:\n\n' + data.message);

                        } else {

                            userService.authenticate(data);
                            $location.path('/');
                        }
                    });
            };

            $scope.logout = function () {

                userService.invalidate();
                $location.path('/');
            };

            $scope.resetPassword = function (email) {

                $http
                    .post(SERVER + '?action=resetpassword&application=priocloud&email=' + email)
                    .success(function (data, status, headers, config) {
                        
                        alert('PW reset and mail sent');
                    
                    }).error(function (dataResponse) {
                        
                        alert('failure: ' + dataResponse.message);
                    });
            };
        }
    ]);
