angular
    .module('riskApp')
    .controller('ProjectRisksController', [
        '$scope',
        '$routeParams',
        '$location',
        'userService',
        'companyService',
        'util',
        function (
            $scope,
            $routeParams,
            $location,
            userService,
            companyService,
            util
        ) {
            var projectId = $routeParams.id;
            var riskId = $routeParams.riskid;

            userService
                .user
                .subscribe(function (user) {

                    $scope.user = user;
                });

            companyService
                .getProject(projectId)
                .subscribe(function (project) {
                    $scope.project = project;
                    if (($scope.project.editUser != null && $scope.project.editUser.email == $scope.user.email)) {
                        $scope.user.changeContent = true;
                    } else {
                        $scope.user.changeContent = false;
                    }
                    showRisk();
                });

            companyService
                .businessUnits
                .subscribe(function (units) {
                    $scope.bus = units;
                });

            companyService
                .company
                .subscribe(function (company) {
                    $scope.company = company;
                });

            userService
                .users
                .subscribe(function (users) {
                    $scope.users = users;
                });

            $scope.newRisk = function () {
                if ($scope.user.changeContent) {
                    $scope.editrisk = {};
                    $scope.editrisk._id = util.uuid();
                    $scope.editrisk.title = 'NEW ITEM';
                    $scope.editrisk.proximity = 'Project';
                    $scope.editrisk.acc = $scope.project.pm.name;
                    $scope.editrisk.prob = '1';
                    $scope.editrisk.impact = '1';
                    $scope.editrisk.recComp = 'Green';
                    $scope.editrisk.total = 1;
                    $scope.editrisk.response = 'Accept';
                    $scope.editrisk.audience = 'Internal';
                    $scope.editrisk.status = 'Green';
                    $scope.editrisk.statusValue = '1';
                    $scope.editrisk.recCompValue = '1';
                    $scope.editrisk.showInReport = true;
                    $scope.editrisk.state = 'New';
                    $('.popup').addClass('active');
                    $scope.deleteThis = false;
                }
            };

            $scope.removeRisk = function (risk) {
                if ($scope.user.changeContent) {
                    $scope.project.risks.splice($scope.project.risks.indexOf(risk), 1);
                    companyService.saveProjectName($scope.project, $scope.user.name);
                    $('.popup').removeClass('active');
                    $scope.deleteThis = false;
                }
            };

            $scope.delete = function () {
                if ($scope.user.changeContent) {
                    $scope.deleteThis = true;
                }
            };

            $scope.beginEditRisk = function (risk) {
                $scope.editrisk = risk;
                $('.popup').addClass('active');
                $scope.deleteThis = false;
            };

            $scope.close = function () {
                $('.popup').removeClass('active');
                $scope.deleteThis = false;
            };

            $scope.saveRisk = function (risk) {
                if ($scope.user.changeContent) {
                    risk.total = risk.prob * risk.impact * risk.recCompValue;
                    risk.statusValue = 1;
                    if (risk.status == "Yellow") risk.statusValue = 2;
                    if (risk.status == "Orange") risk.statusValue = 3;
                    if (risk.status == "Red") risk.statusValue = 4;

                    risk.recCompValue = 1;
                    if (risk.recComp == "Yellow") risk.recCompValue = 2;
                    if (risk.recComp == "Orange") risk.recCompValue = 3;
                    if (risk.recComp == "Red") risk.recCompValue = 4;

                    if ($scope.project.risks == null) {
                        $scope.project.risks = [];
                    }
                    if ($scope.project.risks.indexOf(risk) == -1) {
                        $scope.project.risks.push(risk);
                    }
                    companyService.saveProjectName($scope.project, $scope.user, true);
                    $scope.deleteThis = false;
                    $scope.hasChanged = false;
                    $('.popup').removeClass('active');
                }
            };
            $scope.saveAllRisk = function () {
                if ($scope.user.changeContent) {
                    if ($scope.project.risks == null) {
                        $scope.project.risks = [];
                    }
                    companyService.saveProjectName($scope.project, $scope.user, true);
                    $scope.hasChanged = false;
                    $('.popup').removeClass('active');
                }
            };

            $scope.saveNow = function (project) {
                if ($scope.user.changeContent) {
                    $scope.hasChanged = true;
                }
            };

            function showRisk() {
                $scope.deleteThis = false;
                if (riskId) {
                    var risk = $scope.project.risks.filter(function (risk) {
                        return risk._id === riskId;
                    });
                    if (risk[0]) {
                        $scope.editrisk = risk[0];
                        $('.popup').removeClass('active');
                        $scope.deleteThis = false;
                    }
                }
            }
        }
    ]);
