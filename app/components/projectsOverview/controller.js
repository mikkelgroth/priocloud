angular
    .module('riskApp')
    .controller('ProjectsOverviewController', [
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

            console.log($routeParams.id);

            companyService.projects.subscribe(function (projects) {

                $scope.projectList = setProjectList(projects);
            });

            companyService.businessUnits.subscribe(function (units) {

                $scope.bus = units;
            });

            userService.users.subscribe(function (users) {

                $scope.users = users;
            });

            $scope.goToProject = function (projectId) {

		        $location.path('/project/' + projectId);
            };

            function setProjectList(projects) {

                return projects.map(function (project) {

                    project.buname = project.bu.name;
                    project.poname = project.po.name;
                    project.pmname = project.pm.name;

                    // set last status
                    project.lastStatus = project.statuses[project.statuses.length - 1];

                    return project;
                });
            }
        }
    ]);
