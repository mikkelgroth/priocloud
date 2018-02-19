angular
    .module('riskApp')
    .controller('ProjectDetailsController', [
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
                    if( ($scope.project.po !=null && $scope.user.email == $scope.project.po.email) || 
                        ($scope.project.pm !=null && $scope.user.email == $scope.project.pm.email) || 
                        ($scope.project.altpo !=null && $scope.user.email == $scope.project.altpo.email) || 
                        ($scope.project.altpm !=null && $scope.user.email == $scope.project.altpm.email) || 
                        $scope.user.isOwner || 
                        
                        $scope.user.admin)
                    {
                        $scope.user.changeContent=true;
                    }else{
                        $scope.user.changeContent=false;
                    }

                    if ($scope.project.statuses.length > 0) {

                        $scope.editstatus = angular.copy($scope.project.statuses[$scope.project.statuses.length - 1]);
                        
                    }
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
            
        }
    ]);
