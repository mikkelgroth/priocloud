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

                    if ($scope.project.statuses.length > 0) {

                        $scope.editstatus = angular.copy($scope.project.statuses[$scope.project.statuses.length - 1]);
                        $scope.saveStatusEnabled = true;
                    }
                });

            $scope.isAllowedToSave = function () {

                return $scope.user.email == $scope.project.po.email || 
                    $scope.user.email == $scope.project.pm.email || 
                    $scope.user.email == $scope.project.altpo.email || 
                    $scope.user.email == $scope.project.altpm.email || 
                    $scope.user.isOwner || 
                    $scope.user.admin;
            };
        }
    ]);
