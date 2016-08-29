angular
    .module('riskApp')
    .controller('AdminDeleteController', [
        '$scope',
        'userService',
        function (
            $scope,
            userService
        ) {

            userService
                .user
                .subscribe(function (user) {

                    $scope.user = user;
                });
        }
    ]);
