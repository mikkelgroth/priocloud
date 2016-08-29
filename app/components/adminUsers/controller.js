angular
    .module('riskApp')
    .controller('AdminUsersController', [
        '$scope',
        'userService',
        'companyService',
        'restService',
        function (
            $scope,
            userService,
            companyService,
            restService
        ) {
            userService
                .user
                .subscribe(function (user) {

                    $scope.user = user;
                });

            userService
                .users
                .subscribe(function (users) {

                    $scope.users = users;
                });

            companyService
                .businessUnits
                .subscribe(function (units) {

                    $scope.bus = units;
                });

            $scope.fillUser = function (user) {

                if (!user.bu.length) {
                    user.bu = [user.bu];
                }

                $scope.edituser = user;
            };

            $scope.saveUser = function (user) {

                userService.updateUser(user);
            };

            $scope.addUser = function (user) {

                userService.createUser(user).then(function () {

			        $scope.newuser = {};
                });
            };

            $scope.deleteUser = function (user) {

                userService.deleteUser(user);
            };

            $scope.resetPassword = function (user) {

                userService.resetPassword(user);
            };
        }
    ]);
