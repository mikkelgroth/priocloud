angular
    .module('riskApp')
    .controller('RegisterController', [
        '$scope',
        '$http',
        'companyService',
        'restService',
        'userService',
        '$location',
        
        function (
            $scope,
            $http,
            companyService,
            restService,
            userService,
            $location
            
        ) {

            $scope.register = function () {

                $http
                    .post(USERSERVER + '?action=createproject&application=priocloud&email=' + $scope.email + '&password=' + $scope.password)
                    .success(function (data, status, headers, config) {

                        if (data.authenticated) {
                          userService.authenticate(data);
                            restService
                                .saveData('company', {
                                    name: $scope.companyname,
                                    
                                })
                                .success(function (dataResponse) {

                                    companyService.loadCompany();

                                    restService
                                        .saveData('bu', angular.fromJson({ name: $scope.companyname }))
                                        .success(function (dataResponse) {
                                            userService.authenticate(data);
                                            $location.path('/admin');

                                        });
                                });

                        } else {

                            alert('User creation failure:\n\n' + data.message);
                        }
                    });
            };
        }
    ]);
