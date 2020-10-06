angular
    .module('riskApp')
    .controller('ProjectMilestoneController', [
        '$scope',
        '$routeParams',
        '$location',
        'userService',
        'companyService',
        'util',
        function (
            $scope,
            $routeParams,
            $location,
            userService,
            companyService,
            util
        ) {

            var projectId = $routeParams.id;
            var milestoneId = $routeParams.milestoneid;

            $scope.showMilestoneForm = false;
            $scope.mileview = "all";

            userService
                .user
                .subscribe(function (user) {

                    $scope.user = user;
                });

            companyService
                .getProject(projectId)
                .subscribe(function (project) {
                    $scope.year = (new Date()).getFullYear();

                    $scope.project = project;
                    if (($scope.project.editUser != null && $scope.project.editUser.email == $scope.user.email)) {
                        $scope.user.changeContent = true;
                    } else {
                        $scope.user.changeContent = false;
                    }

                    showMilestone();
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

            $scope.beginEditMile = function (mile) {
                $scope.editmile = mile;
                $scope.deleteThis = false;
                $('.popup').addClass('active');
            };

            $scope.saveMilestones = function (open) {
                if ($scope.user.changeContent) {
                    $scope.hasChanged = false;
                    $scope.deleteThis = false;
                    $scope.project.milestones[0].prime = true;
                    companyService.saveProjectName($scope.project, $scope.user, true);
                    $scope.statehasChanged = false;
                    $('.popup').removeClass('active');
                }
            };

            $scope.saveNow = function (mile) {
                if ($scope.user.changeContent) {
                    var md = new Date($("#miledate")[0].value);
                    if (md instanceof Date && !isNaN(md.valueOf())) {
                        mile.date = md.toISOString();
                    }
                    var med = new Date($("#mileenddate")[0].value);
                    if (med instanceof Date && !isNaN(med.valueOf())) {
                        mile.enddate = med.toISOString();
                    }
                    if (md instanceof Date && !isNaN(md.valueOf()) && med instanceof Date && !isNaN(med.valueOf()) && md.valueOf() > med.valueOf()) {
                        mile.enddate = md.toISOString();
                        mile.rawenddate = $("#miledate")[0].value;
                    }

                    util.setmileflags(mile);

                    $scope.hasChanged = true;
                }
            };

            $scope.newMilestone = function () {
                if ($scope.user.changeContent) {
                    if ($scope.project.milestones == null) {
                        $scope.project.milestones = [];
                    }
                    $scope.project.milestones.push({});
                    $scope.editmile = $scope.project.milestones[$scope.project.milestones.length - 1];
                    var newdate = (new Date()).toISOString();
                    var end = new Date();
                    end.setFullYear(end.getFullYear() + 1);
                    if ($scope.project.milestones.length == 1) {
                        $scope.editmile.prime = true;
                    }
                    $scope.editmile._id = util.uuid();
                    $scope.editmile.date = newdate;
                    $scope.editmile.enddate = end.toISOString();
                    $scope.editmile.status = 'Green';
                    $scope.editmile.state = 'Target';
                    $scope.editmile.type = 'Project';
                    $scope.editmile.showInReport = true;
                    $scope.editmile.audience = 'Internal';
                    $scope.editmile.acountable = $scope.user.name;
                    $scope.editmile.responsible = $scope.user.name;
                    $scope.editmile.bena = '1';
                    $scope.editmile.effort = '1';
                    $scope.editmile.sena = '1';
                    $scope.editmile.cena = '1';
                    $scope.editmile.mena = '1';
                    $scope.editmile.risklevel = '1';
                    $scope.editmile.enablerlable = "XS";
                    $scope.editmile.enablervalue = 0;
                    $scope.editmile.enablervaluetotal = 1;
                    $scope.editmile.limiterlable = "XS";
                    $scope.editmile.limitervalue = 0;
                    $scope.editmile.limitervaluetotal = 1;
                    $scope.editmile.title = 'NEW DELIVERABLE';
                    $scope.editmile.priority = '5. Valued';

                    $scope.deleteThis = false;
                    $scope.saveNow($scope.editmile);
                    $('.popup').addClass('active');
                }
            };

            $scope.newCloneMilestone = function (m) {
                if ($scope.user.changeContent) {
                    $scope.editmile = angular.copy(m);
                    $scope.editmile._id = util.uuid();
                    $scope.editmile.prime = false;
                    $scope.editmile.title = 'NEW CLONE DELIVERABLE';
                    $scope.project.milestones.push($scope.editmile);
                    $('.popup').addClass('active');
                    $scope.deleteThis = false;
                    $scope.saveNow($scope.editmile);
                }
            };

            $scope.close = function () {
                $('.popup').removeClass('active');
            };

            $scope.removeMilestone = function (dep) {
                if ($scope.user.changeContent) {
                    $scope.project.milestones.splice($scope.project.milestones.indexOf(dep), 1);
                    companyService.saveProjectName($scope.project, $scope.user.name);
                    $('.popup').removeClass('active');
                }
            };

            $scope.barRender = function (mile) {
                return util.barRender(mile);
            }

            function showMilestone() {
                if (milestoneId) {
                    var milestone = $scope.project.milestones.filter(function (milestone) {
                        return milestone._id === milestoneId;
                    });
                    if (milestone[0]) {
                        $scope.editmile = milestone[0];
                        $('.popup').addClass('active');
                    }
                }
            }
        }
    ]);
