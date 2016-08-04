angular
    .module('riskApp')
    .controller('RegisterController', [
        '$scope',
        '$http',
        'restService',
        function (
            $scope,
            $http,
            restService
        ) {

            $scope.register = function () {

                $http
                    .post(UERSERVER + '?action=createproject&application=priocloud&email=' + $scope.email + '&password=' + $scope.password)
                    .success(function (data, status, headers, config) {

                        if (data.authenticated) {

                            restService
                                .saveData('company', {
                                    name: $scope.companyname,
                                    projkpi1lable: 'Strategy',
                                    projkpi2lable: 'Customer focus',
                                    projkpi3lable: 'Compliance',
                                    projkpi1weight: 1,
                                    projkpi2weight: 1,
                                    projkpi3weight: 1,
                                    projkpi1sort: 'tophigh',
                                    projkpi2sort: 'tophigh',
                                    projkpi3sort: 'tophigh',
                                    riskkpi1lable: 'Probability',
                                    riskkpi2lable: 'Customer impact',
                                    riskkpi3lable: 'Project delay',
                                    riskkpi1weight: 1,
                                    riskkpi2weight: 1,
                                    riskkpi3weight: 1,
                                    riskkpi1sort: 'tophigh',
                                    riskkpi2sort: 'tophigh',
                                    riskkpi3sort: 'tophigh'
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
