angular
    .module('riskApp')
    .controller('SettingsController', [
        '$scope', 
        '$http',
        'userService',
        function (
            $scope,
            $http,
            userService
        ) {

            userService
                .user
                .subscribe(function (user) {

                    $scope.user = user;
                });

            $scope.updateUser = function (user) {

                var data = angular.fromJson(user);

                $http
                    .post(SERVER + '?action=updateuser&application=priocloud&auid=' + user.auid + '&uuid=' + user.uuid, data)
                    .success(function (data, status, headers, config) {
                        
                        userService.authenticate(data);
                    })
                    .error(function (dataResponse) {
                        
                        alert('failure: ' + dataResponse.message);
                    });
            };
        }
    ]);
