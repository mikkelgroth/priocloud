angular
    .module('riskApp')
    .controller('ProjectDependenciesController', [
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
            var depId = $routeParams.depid;

            $scope.showDepForm = false;

            userService
                .user
                .subscribe(function (user) {

                    $scope.user = user;
                });

            companyService
                .getProject(projectId)
                .subscribe(function (project) {

                    $scope.project = project;

                    showDep();
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

            
            $scope.beginEditDep = function (dep) {
                
                $scope.editdep = dep;
                
                $scope.showMilestoneForm = false;
                $scope.showDepForm = true;
                $scope.deleteThis=false;
                                
            };
                


            $scope.saveDeps = function (open) {
                companyService.saveProjectName($scope.project, $scope.user.name);
                $scope.hasChanged=false;
                $scope.deleteThis=false;
                
                if (open) {
                    $scope.showDepForm = true;
                }
                
            };
            
            $scope.saveNow = function (dep) {
                var md = new Date($("#depdate")[0].value);
                if (md instanceof Date && !isNaN(md.valueOf())) { 
                    dep.depdate = md.toISOString(); 
                }


                $scope.hasChanged=true;               
            };
            $scope.saveNowQuick = function () {
                $scope.hasChanged=true;               
            };


            $scope.newDep = function () {
                
                if($scope.project.deps==null){
                    $scope.project.deps=[];
                }
                $scope.project.deps.push({});
                $scope.editdep=$scope.project.deps[$scope.project.deps.length-1];
                
                $scope.editdep._id = Math.random().toString(36).substr(2, 9);
                $scope.editdep.status = 'Green';
                $scope.editdep.title = 'NEW DEPENDENCY';
                $scope.editdep.agreement = 'None';
                $scope.editdep.names = 'TBD';
                $scope.editdep.showInReport = true;
                $scope.editdep.audience = 'Project';
                $scope.editdep.requester = $scope.user.name;
                $scope.editdep.resowner = $scope.user.name;
                $scope.editdep.quantum = 'Minor task';
                $scope.editdep.delmap = 'None';
                $scope.editdep.description = 'None';
                
                $scope.showDepForm = true;
                $scope.showMilestoneForm = false;
                $scope.deleteThis=false;
                                
            };
                    
         
            $scope.hideDepForm = function () {    
                $scope.showDepForm = false;                
            };
                
            $scope.removeDep = function (dep) {
                $scope.project.deps.splice($scope.project.deps.indexOf(dep), 1);
                companyService.saveProjectName($scope.project, $scope.user.name);
                $scope.showDepForm = false;
            };



            
            function showDep() {
                
                // TODO(2): this doesn't work until correct id's for deps has been implemented

                if (depId) {

                    var dep = $scope.project.deps.filter(function (dep) {
                        return dep._id === depId;
                    });

                    if (dep[0]) {

                        $scope.editdep = dep[0];
                        $scope.showDepForm = true;
                    }
                }
            }

        }
    ]);
