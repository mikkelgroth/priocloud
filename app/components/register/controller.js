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

    $scope.createTemplateProject = function() {
        console.log("create template account");
        $http.post(USERSERVER+'?action=createtemplateproject&application=priocloud')
            .success(function (data, status, headers, config) {
                if (data.authenticated) {
                    userService.authenticate(data);
                    companyService.loadCompany();
                    alert('Your username is: ' + data.email + "\nYour password is: t\nThe project will be automatically erased in 1 week");
                }
            }).error(function (dataResponse) {
                alert('failure: ' + dataResponse.message);
            });
    }


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
