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

            // LOCK
            $scope.companyedit = false;
            if ($scope.company.locked && $scope.company.lockedby != undefined && $scope.company.lockedby != {} && $scope.company.lockedby.name == $scope.user.name) {
                $scope.companyedit = true;
            }



            $scope.editUser = function (user) {
                $scope.edituser = user;
                $('.popup').addClass('active');
            };

            $scope.saveUser = function (user) {
                if (user.uuid) {
                    userService.updateUser(user);
                } else {
                    userService.createUser(user);
                }
                $('.popup').removeClass('active');
            };

            $scope.newUser = function () {
                $scope.edituser = {};
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
