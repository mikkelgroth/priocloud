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
                $scope.editstatus.demodate = newdate;
                $scope.editstatus.apo = "Not evaluated";
                $scope.editstatus.title = "No title";
                $scope.editstatus.statusstate = "Draft";
                $scope.editstatus.active = true;
                $scope.saveStatusEnabled = true;
                $scope.showStatusForm = true;

                $scope.project.statuses.push({});
            };

            $scope.newCloneStatus = function (status) {

                $scope.editstatus = angular.copy(status);
                $scope.editstatus.apo = "Not evaluated";
                $scope.editstatus.title = "No title";
                $scope.editstatus.statusstate = "Draft";
                $scope.editstatus.active = true;
                $scope.saveStatusEnabled = true;
                $scope.showStatusForm = true;

                $scope.project.statuses.push($scope.editstatus);
            };

            $scope.viewStatus = function (status) {

                var last = $scope.project.statuses.indexOf(status) == $scope.project.statuses.length - 1;

                $scope.saveStatusEnabled = last;
                $scope.editstatus = status;
                $scope.showStatusForm = true;
            };

            $scope.hideStatusForm = function () {

                $scope.showStatusForm = false;
            };

            $scope.removeStatus = function (status) {

                $scope.project.statuses.splice($scope.project.statuses.indexOf(status), 1);

                companyService.saveProject($scope.project);

                $scope.showStatusForm = false;
            };
            
            $scope.saveNow = function (project) {
                
                $scope.hasChanged=true;               
            };

            $scope.saveStatus = function (status) {

                //TODO: change datepickr to be integrated with angular objects


                var ed = new Date();
                if (ed instanceof Date && !isNaN(ed.valueOf())) {
                    status.date = ed;
                }

                
                var dd = new Date(Date.parse($("#demodate")[0].value));
                if (dd instanceof Date && !isNaN(dd.valueOf())) {
                    status.demodate = dd.toISOString();
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

                companyService.saveProject($scope.project);
                $scope.hasChanged=false;

            }
        }
    ]);
