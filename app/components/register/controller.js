angular
    .module('riskApp')
    .controller('RegisterController', [
        '$scope',
        '$http',
        'restService',
        'stateService',
        function (
            $scope,
            $http,
            restService,
            stateService
        ) {

            $scope.register = function () {

                $http
                    .post(USERSERVER + '?action=createproject&application=priocloud&email=' + $scope.email + '&password=' + $scope.password)
                    .success(function (data, status, headers, config) {

                        if (data.authenticated) {

                            restService
                                .saveData('company', {
                                    name: $scope.companyname,
                                    
                                })
                                .success(function (dataResponse) {

                                    stateService.loadCompany();

                                    restService
                                        .saveData('bu', angular.fromJson({ name: $scope.companyname }))
                                        .success(function (dataResponse) {
                                            $scope.bus[0] = dataResponse;
                                        });
                                });

                        } else {

                            alert('User creation failure:\n\n' + data.message);
                        }
                    });
            };
        }
    ]);
