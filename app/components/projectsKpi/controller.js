angular
    .module('riskApp')
    .controller('ProjectsKpiController', [
        '$scope',
        '$location',
        'userService',
        'companyService',
        function (
            $scope,
            $location,
            userService,
            companyService
        ) {

            companyService.projects.subscribe(function (projects) {

                $scope.projectList = setProjectList(projects);
                $scope.showmepmbutton=true;
                $scope.showmepobutton=true;
            });

            companyService.businessUnits.subscribe(function (units) {

                $scope.bus = units;
            });

            userService.users.subscribe(function (users) {

                $scope.users = users;
            });
            
            companyService
                .company
                .subscribe(function (company) {

                    $scope.company = company;
            });

            $scope.goToProject = function (projectId) {

		        $location.path('/project/' + projectId);
            };

            $scope.showmepm = function () {

                $scope.search.pmname = [$scope.user.name];
                $scope.showmepmbutton=false;
            };
            $scope.clearmepm = function () {

                $scope.search.pmname = [];
                $scope.showmepmbutton=true;
            };
            $scope.showmepo = function () {

                $scope.search.poname = [$scope.user.name];
                $scope.showmepobutton=false;
            };
            $scope.clearmepo = function () {

                $scope.search.poname = [];
                $scope.showmepobutton=true;
            };

            function setProjectList(projects) {

                return projects.map(function (project) {

                    project.buname = project.bu.name;
                    project.poname = project.po.name;
                    project.pmname = project.pm.name;

                    // set last status
                    project.lastStatus = project.statuses[project.statuses.length - 1];
                    project.lastStatusFlag = project.lastStatus.status;

                    return project;
                });
            }
        }
    ]);
