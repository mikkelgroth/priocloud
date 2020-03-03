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

            $scope.editUser = function (user) {
                if (user.bu == null || user.bu.length == 0) {
                    user.bu = [user.bu];
                }
                $scope.edituser = user;
                $('.popup').addClass('active');
            };

            $scope.saveUser = function (user) {
                userService.updateUser(user);
                $('.popup').removeClass('active');
            };

            $scope.addUser = function () {
                $scope.edituser = {};
                userService.createUser($scope.edituser);
                $('.popup').addClass('active');
            };

            $scope.deleteUser = function (user) {
                userService.deleteUser(user);
                $('.popup').removeClass('active');
            };

            $scope.close = function () {
                $('.popup').removeClass('active');
            };

            $scope.resetPassword = function (user) {
                userService.resetPassword(user);
            };
        }
    ]);
