angular
    .module('riskApp')
    .controller('ProjectsStatusController', [
        '$scope',
        '$rootScope',
        '$location',
        'userService',
        'companyService',
        function (
            $scope,
            $rootScope,
            $location,
            userService,
            companyService
        ) {
            companyService.reloadCompany();
            companyService
                .company
                .subscribe(function (company) {

                    $scope.company = company;  

                });
            companyService
                .company
                .subscribe(function (company) {

                    $scope.company = company;
                });
            
                companyService.projects.subscribe(function (projects) {

                    $scope.projectList = setProjectList(projects);
                    $scope.showmepmbutton=true;
                    $scope.showmepobutton=true;
                    $scope.showmeownerbutton=true;
    
                    $scope.search=$rootScope.filtersProjectsStatusOverview;
    
                });
    
                //use same as onuserchange
                $scope.saveSearch = function (){
                    $rootScope.filtersProjectsStatusOverview=$scope.search;
                }
                
                //Save filters to user
                $scope.saveFilters = function (){
                    $scope.user.filtersProjectsStatusOverview = $rootScope.filtersProjectsStatusOverview;
                    userService.updateUser($scope.user);
                }

            companyService.businessUnits.subscribe(function (units) {

                $scope.bus = units;
            });

            userService.users.subscribe(function (users) {

                $scope.users = users;
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
            $scope.showmebuowner = function () {

                $scope.search.projbuownername = [$scope.user.name];
                $scope.showmeownerbutton=false;
            };
            $scope.clearmebuowner = function () {

                $scope.search.projbuownername = [];
                $scope.showmeownerbutton=true;
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
                    project.projbuownername = "";
                    if(project.bu != null && project.bu.owner != null) project.projbuownername = project.bu.owner.name;
                    
                    project.portname = '';
                    if(project.support != null) project.portname = project.support.name;

                    // set last status
                    project.lastStatus = project.statuses[project.statuses.length - 1];
                    project.lastStatusFlag = project.lastStatus.status;
                    project.financeFlag = project.financeControl;

                    return project;
                });
            }

        }
    ]);
