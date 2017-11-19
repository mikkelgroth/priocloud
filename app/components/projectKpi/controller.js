angular
    .module('riskApp')
    .controller('ProjectKpiController', [
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

            userService
                .user
                .subscribe(function (user) {

                    $scope.user = user;
                });

            companyService
                .getProject(projectId)
                .subscribe(function (project) {

                    $scope.project = project;
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

            $scope.saveProject = function (project) {
                companyService.saveProjectName(project, $scope.user.name);
                $scope.hasChanged=false;
            };

            $scope.saveNow = function (project) {
                
                $scope.hasChanged=true;               
            };
                
                //radar stuff
                $scope.radarkpilabels =[$scope.company.projkpi1lable, $scope.company.projkpi2lable, $scope.company.projkpi3lable, $scope.company.projkpi4lable, $scope.company.projkpi5lable, $scope.company.projkpi6lable];
                $scope.radarkpidata = [[$scope.project.kpi1, $scope.project.kpi2, $scope.project.kpi3, $scope.project.kpi4, $scope.project.kpi5, $scope.project.kpi6]];
                $scope.radarkpioptions = {
                    responsive: false,
                    maintainAspectRatio: false,
                    scale: {
                        ticks: {
                            beginAtZero: true,
                            max: 100
                        }
                    }
                };
                


        }
    ]);
