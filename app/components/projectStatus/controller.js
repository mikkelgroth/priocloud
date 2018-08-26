angular
    .module('riskApp')
    .controller('ProjectStatusController', [
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

            $scope.showStatusForm = false;

            userService
                .user
                .subscribe(function (user) {

                    $scope.user = user;
                });

            companyService
                .getProject(projectId)
                .subscribe(function (project) {

                    $scope.project = project;
                    if(($scope.project.editUser != null && $scope.project.editUser.email == $scope.user.email) ){                       
                        $scope.user.changeContent=true;
                    } else {
                        $scope.user.changeContent=false;
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


            $scope.newStatus = function () {

                var newdate = (new Date()).toISOString();

                $scope.editstatus = {};
                $scope.editstatus.date = newdate;
                $scope.editstatus.demodate = newdate;
                $scope.editstatus.title = "No title";

                $scope.editstatus.status = "Green";
                $scope.editstatus.overallcomments = "TBD";
                $scope.editstatus.statusbc = "Green";
                $scope.editstatus.statussc = "Green";
                $scope.editstatus.statustl = "Green";
                $scope.editstatus.statusres = "Green";
                $scope.editstatus.statusbud = "Green";
                $scope.editstatus.statusrisk = "Green";
                
                $scope.editstatus.apo = "Not evaluated";
                $scope.editstatus.statusstate = "Draft";
                $scope.editstatus.active = true;
                $scope.saveStatusEnabled = true;
                $scope.showStatusForm = true;

                $scope.editstatus.cs = "4";
                $scope.editstatus.productcs = "4";
            
                $scope.project.statuses.push($scope.editstatus);
                companyService.saveProjectName($scope.project, $scope.user.name);
            };

            $scope.newCloneStatus = function (status) {
                status.active = false;
                status.statusstate = "Final";

                $scope.editstatus = angular.copy(status);
                $scope.editstatus.apo = "Not evaluated";
                $scope.editstatus.title = "No title";
                $scope.editstatus.statusstate = "Draft";
                $scope.editstatus.active = true;
                $scope.saveStatusEnabled = true;

                $scope.project.statuses.push($scope.editstatus);
                $scope.showStatusForm = false;
                $scope.deleteThis = false;
                companyService.saveProjectName($scope.project, $scope.user.name);
            };

            $scope.viewStatus = function (status) {

                var last = $scope.project.statuses.indexOf(status) == $scope.project.statuses.length - 1;

                $scope.editstatus = status;
                $scope.editstatus.active = last;
                $scope.saveStatusEnabled = last && $scope.editstatus.statusstate != "Final";
                $scope.showStatusForm = true;
                $scope.deleteThis = false;

                $scope.deleteLast = false;
                if($scope.project.statuses.length > 1){
                    $scope.deleteLast = true;
                }

            };

            
            $scope.hideStatusForm = function () {

                $scope.showStatusForm = false;
            };

            $scope.removeStatus = function (status) {

                if($scope.project.statuses.length > 1){

                $scope.project.statuses.splice($scope.project.statuses.indexOf(status), 1);

                companyService.saveProjectName($scope.project, $scope.user.name);
                }

                $scope.showStatusForm = false;
                $scope.deleteThis = false;
            };
            
            $scope.delete = function () {

                $scope.deleteThis = true;
                
            };


            $scope.saveNow = function (status) {
                var dd = new Date(Date.parse($("#demodate")[0].value));
                if (dd instanceof Date && !isNaN(dd.valueOf())) {
                    status.demodate = dd.toISOString();
                }
                var sdd = new Date(Date.parse($("#steercodate")[0].value));
                if (sdd instanceof Date && !isNaN(sdd.valueOf())) {
                    status.steercodate = sdd.toISOString();
                }
                $scope.hasChanged=true;               
            };

            $scope.saveStatus = function (status) {

                var ed = new Date();
                if (ed instanceof Date && !isNaN(ed.valueOf())) {
                    status.date = ed;
                }

                if ($scope.project.pm.email == $scope.user.email) {
                    status.apo = "Not evaluated";
                }

                // RISK: this can be manipulated with and set even if you are not admin
                if ((($scope.project.altpo != null && $scope.project.altpo.email == $scope.user.email) || ($scope.project.po != null && $scope.project.po.email == $scope.user.email) || $scope.user.admin) &&
                    (status.statusstate == "Final" || status.apo == "Approved")) {

                    status.apo = "Approved";
                    status.statusstate = "Final";
                    status.savedfinalby=$scope.user.name;
                    status.active = false;
                }

                if ($scope.project.statuses.length == 0) {

                    $scope.project.statuses.push(status);

                } else {

                    $scope.project.statuses[$scope.project.statuses.length - 1] = status;
                }

                //$scope.logProject(true, "Status saved");

                companyService.saveProjectName($scope.project, $scope.user.name);
                companyService.saveProjectName($scope.project, $scope.user, true);
                
                $scope.hasChanged=false;

            }
        }
    ]);
