angular
    .module('riskApp')
    .controller('ProjectRisksController', [
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

            var projectId = $routeParams.id;
            var riskId = $routeParams.riskid;

            $scope.showRiskForm = false;

            userService
                .user
                .subscribe(function (user) {

                    $scope.user = user;
                });

            companyService
                .getProject(projectId)
                .subscribe(function (project) {

                    $scope.project = project;

                    showRisk();
                });

            companyService
                .businessUnits
                .subscribe(function (units) {

                    $scope.bus = units;
                });

            userService
                .users
                .subscribe(function (users) {

                    $scope.users = users;
                });

            $scope.newRisk = function () {

                $scope.editrisk = {};
                $scope.editrisk.freq = {};
                $scope.editrisk.freq.kpi1 = 0;
                $scope.editrisk.freq.kpi2 = 0;
                $scope.editrisk.freq.kpi3 = 0;
                $scope.editrisk.prob = 1;
                $scope.editrisk.impact = 1;
                $scope.editrisk.total = 1;
                $scope.editrisk.response = 'Accept';
                $scope.editrisk.acc = 'TBD';
                $scope.editrisk.audience = 'Project';
                $scope.editrisk.status = 'Green';
                $scope.editrisk.state = 'New';
                $scope.editrisk.prob = 1;
                $scope.editrisk.impact = 1;

                $scope.showRiskForm = true;
            };

            $scope.removeRisk = function (risk) {

                $scope.project.risks.splice($scope.project.risks.indexOf(risk), 1);

                companyService.saveProject($scope.project);

                $scope.showRiskForm = false;
            };

            $scope.beginEditRisk = function (risk) {

                $scope.editrisk = risk;

                $scope.showRiskForm = true;
            };

            $scope.hideRiskForm = function () {

                $scope.showRiskForm = false;
            };

            $scope.saveRisk = function (risk) {

                risk.total = risk.prob * risk.impact;

                if (!risk.freq) {

                    risk.freq = {};
                    risk.freq.kpi1 = 0;
                    risk.freq.kpi2 = 0;
                    risk.freq.kpi3 = 0;
                }

                if ($scope.project.risks.indexOf(risk) == -1) {

                    $scope.project.risks.push(risk);
                }
                
                companyService.saveProject($scope.project);
                $scope.editrisk = {};

                $scope.showRiskForm = false;
            };

            function showRisk() {

                // TODO(2): this doesn't work until correct id's for risks has been implemented

                if (riskId) {

                    var risk = $scope.project.risks.filter(function (risk) {
                        return risk._id === riskId;
                    });

                    if (risk) {

                        $scope.editrisk = risk;
                        $scope.showRiskForm = true;
                    }
                }
            }
        }
    ]);