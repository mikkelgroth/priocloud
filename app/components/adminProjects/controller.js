angular
    .module('riskApp')
    .controller('AdminProjectsController', [
        '$scope',
        '$location',
        'userService',
        'companyService',
        'restService',
        function (
            $scope,
            $location,
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

            companyService
                .projects
                .subscribe(function (projects) {

                    $scope.projects = projects;
                });

            $scope.newProject = function (project) {

                project.state = 'Proposed';
                project.kpi1 = 0;
                project.kpi2 = 0;
                project.kpi3 = 0;
                project.kpi4 = 0;
                project.kpi5 = 0;
                project.kpi6 = 0;
                project.total = 0;
                project.statuses = [];
                project.statuses.push({});
                project.statuses[0].date = new Date();
                project.statuses[0].status = 'Green';
                project.statuses[0].title = 'Project created';

                companyService.saveProject(project);
            };

            $scope.editProject = function (project) {

                $location.path('/project/' + project._id.$oid + '/details')
            };

            $scope.deleteProject = function (project) {

                companyService.deleteProject(project);
            };
        }
    ]);
