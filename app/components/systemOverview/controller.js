angular
    .module('riskApp')
    .controller('SystemOverviewController', [
        '$scope',
        '$routeParams',
        '$location',
        'userService',
        'companyService',
        function (
            $scope,
            $routeParams,
            $location,
            userService,
            companyService
        ) {

            var systemId = $routeParams.id;

            companyService
                .getSystem(systemId)
                .subscribe(function (system) {

                    $scope.year = (new Date()).getFullYear();
                    console.log(system.title);
                    $scope.system = system;
                    $scope.user.isOwner = ($scope.system.bu.owner != null && $scope.system.bu.owner.email != null && $scope.system.bu.owner.email == $scope.user.email)

                    if (($scope.system.pm != null && $scope.user.email == $scope.system.pm.email) ||
                        ($scope.system.po != null && $scope.user.email == $scope.system.po.email) ||
                        ($scope.system.altpo != null && $scope.user.email == $scope.system.altpo.email) ||
                        ($scope.system.altpm != null && $scope.user.email == $scope.system.altpm.email) ||
                        $scope.user.isOwner || ($scope.user.financecontroller && $scope.system.financecontroller != null && $scope.user.email == $scope.system.financecontroller.email) || $scope.user.subadmin || $scope.user.admin) {

                        if ($scope.system.editUser == null) {
                            $scope.system.showRelease = false;
                            $scope.user.changeContent = true;
                        } else if ($scope.system.editUser != null && ($scope.system.editUser.email == $scope.user.email || $scope.user.subadmin || $scope.user.admin)) {
                            $scope.system.showRelease = true;
                            $scope.user.changeContent = true;
                        } else {
                            $scope.system.showRelease = false;
                            $scope.user.changeContent = false;
                        }
                    } else {
                        $scope.user.changeContent = false;
                    }
                });

            companyService
                .company
                .subscribe(function (company) {
                    $scope.company = company;
                });
            
            companyService
                .systems
                .subscribe(function (systems) {
                    $scope.systems = systems;
                });

            $scope.saveSystem = function (system) {

                companyService.saveSystemName(system, $scope.user, true);
                $scope.hasChanged = false;
            };
            $scope.editSystem = function (system) {
                system.editUser = $scope.user;
                $scope.system.showRelease = true;
                companyService.saveSystemOnLoad(system);
                $scope.hasChanged = false;
            };
            $scope.releaseSystem = function (system) {
                system.editUser = null;
                $scope.system.showRelease = false;
                companyService.saveSystemOnLoad(system);
                $scope.hasChanged = true;
                //$location.path('/');
            };

            $scope.saveNow = function (system) {
                $scope.hasChanged = true;
            };
        }
    ]);
