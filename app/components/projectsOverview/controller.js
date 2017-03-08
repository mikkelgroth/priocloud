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

            companyService
                .company
                .subscribe(function (company) {

                    $scope.company = company;
                });
            
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
                    project.warn = "";
                    // set last status
                    project.lastStatus = project.statuses[project.statuses.length - 1];

                    var now = new Date();
                    var status = new Date(project.lastStatus.date);
                    if(Math.round((status.getTime()-now.getTime()) / (1000*60*60*24)) < -14){project.warn = "!";}
                    if(Math.round((status.getTime()-now.getTime()) / (1000*60*60*24)) < -30){project.warn = "!!";}
                    if(Math.round((status.getTime()-now.getTime()) / (1000*60*60*24)) < -45){project.warn = "!!!";}

                    return project;
                });
            }
        }
    ]);
