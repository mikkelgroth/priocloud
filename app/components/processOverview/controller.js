angular
    .module('riskApp')
    .controller('ProcessOverviewController', [
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

            var processId = $routeParams.id;

            companyService
                .getProcess(processId)
                .subscribe(function (process) {

                    $scope.year = (new Date()).getFullYear();
                    //console.log(process.title);
                    $scope.process = process;
                    $scope.user.isOwner = ($scope.process.bu.owner != null && $scope.process.bu.owner.email != null && $scope.process.bu.owner.email == $scope.user.email)

                    if (($scope.process.pm != null && $scope.user.email == $scope.process.pm.email) ||
                        ($scope.process.po != null && $scope.user.email == $scope.process.po.email) ||
                        ($scope.process.altpo != null && $scope.user.email == $scope.process.altpo.email) ||
                        ($scope.process.altpm != null && $scope.user.email == $scope.process.altpm.email) ||
                        $scope.user.isOwner || ($scope.user.financecontroller && $scope.process.financecontroller != null && $scope.user.email == $scope.process.financecontroller.email) || $scope.user.subadmin || $scope.user.admin) {

                        if ($scope.process.editUser == null) {
                            $scope.process.showRelease = false;
                            $scope.user.changeContent = true;
                        } else if ($scope.process.editUser != null && ($scope.process.editUser.email == $scope.user.email || $scope.user.subadmin || $scope.user.admin)) {
                            $scope.process.showRelease = true;
                            $scope.user.changeContent = true;
                        } else {
                            $scope.process.showRelease = false;
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
                .processs
                .subscribe(function (processs) {
                    $scope.processs = processs;
                });

            companyService
                .processs
                .subscribe(function (systems) {
                    $scope.systems = systems;
                });

            $scope.saveProcess = function (process) {

                companyService.saveProcessName(process, $scope.user, true);
                $scope.hasChanged = false;
            };
            $scope.editProcess = function (process) {
                process.editUser = $scope.user;
                $scope.process.showRelease = true;
                companyService.saveProcessOnLoad(process);
                $scope.hasChanged = false;
            };
            $scope.releaseProcess = function (process) {
                process.editUser = null;
                $scope.process.showRelease = false;
                companyService.saveProcessOnLoad(process);
                $scope.hasChanged = true;
                //$location.path('/');
            };

            $scope.saveNow = function (process) {
                $scope.hasChanged = true;
            };
        }
    ]);
