angular
    .module('riskApp')
    .controller('ProjectsOverviewController', [
        '$scope', 
        '$rootScope',
        'stateService',
        function (
            $scope, 
            $rootScope,
            stateService
        ) {

            console.log("ProjectsOverviewController init");

            $scope.projects = stateService.getProjects();
        }
    ]);
