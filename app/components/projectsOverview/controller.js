angular
    .module('riskApp')
    .controller('ProjectsOverviewController', [
        '$scope',
        '$location',
        'companyService',
        function (
            $scope,
            $location,
            companyService
        ) {

            companyService.projects.subscribe(function (projects) {

                $scope.projectList = projects.map(function (project) {

                    project.buname = project.bu.name;
                    project.poname = project.po.name;
                    project.pmname = project.pm.name;

                    return project;
                });
            });

            $scope.goToProject = function (projectId) {

		        $location.path('/project/' + projectId);
            };
        }
    ]);
