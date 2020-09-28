angular
    .module('riskApp')
    .controller('ProjectDetailsController', [
        '$scope',
        '$routeParams',
        '$location',
        'userService',
        'routeService',
        'companyService',
        'util',
        function (
            $scope,
            $routeParams,
            $location,
            userService,
            routeService,
            companyService,
            util
        ) {

            var projectId = $routeParams.id;
            $scope.id = $routeParams.id;
            $scope.showsimplestatus = !$scope.company.filters.companyshowStatus

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

            companyService
                .systems
                .subscribe(function (systems) {
                    $scope.systems = systems;
                });

            companyService
                .processs
                .subscribe(function (processs) {
                    $scope.processs = processs;
                });

            routeService
                .route
                .subscribe(function (route) {
                    $scope.route = route.substring(route.lastIndexOf('/') + 1);
                });

            userService
                .users
                .subscribe(function (users) {
                    $scope.tempusers = JSON.parse(JSON.stringify(users));
                    for (let i = 0; i < $scope.tempusers.length; i++) {
                        $scope.tempusers[i].bu = {};
                    }
                });

            if (($scope.project.editUser != null && $scope.project.editUser.email == $scope.user.email)) {
                $scope.user.changeContent = true;
            } else {
                $scope.user.changeContent = false;
            }

            if ($scope.project.statuses.length > 0) {

                $scope.editstatus = angular.copy($scope.project.statuses[$scope.project.statuses.length - 1]);
                $scope.saveStatusEnabled = $scope.editstatus.statusstate != "Final";


            }
            if ($scope.project.startdate == null || $scope.project.enddate == null) {
                var start = (new Date()).toISOString();
                var end = new Date();
                end.setFullYear(end.getFullYear() + 1);

                $scope.project.startdate = start;
                $scope.project.enddate = end;
                $scope.project.rawstartdate = $("#projdate")[0].value;
                $scope.project.rawenddate = $("#projenddate")[0].value;
            }

            //  Start LINK ENGINE

            $scope.closelink = function (link) {
                if (link.lable == "orglink") {
                    $scope.showeditlinkorg = false;
                }
                if (link.lable == "Details") {
                    $scope.showeditlinkbusi = false;
                }
            };

            $scope.savelink = function (link) {
                if ($scope.user.changeContent) {
                    companyService.saveProjectName($scope.project, $scope.user, true);
                    $scope.editlink = {};
                    if (link.lable == "orglink") {
                        $scope.showeditlinkorg = false;
                    }
                    if (link.lable == "Details") {
                        $scope.showeditlinkbusi = false;
                    } $scope.hasChanged = false;
                }
            };

            $scope.addlink = function (lable) {
                if ($scope.user.changeContent) {
                    if ($scope.project.linklist == null) $scope.project.linklist = [];
                    var n = {};
                    n.linkuid = util.uuid();

                    n.lable = lable;
                    n.showinreport = true;

                    $scope.project.linklist.push(n);
                    companyService.saveProjectName($scope.project, $scope.user, true);

                    $scope.editlink = n;
                    if (lable == "orglink") {
                        $scope.showeditlinkorg = true;
                    }
                    if (lable == "Details") {
                        $scope.showeditlinkbusi = true;
                    }
                }
            };

            $scope.editlinkitem = function (c) {
                if (c.linkuid == undefined) {
                    c.linkuid = util.uuid();
                }
                $scope.editlink = c;
                if (c.lable == "orglink") {
                    $scope.showeditlinkorg = true;
                }
                if (c.lable == "Details") {
                    $scope.showeditlinkbusi = true;
                }
            };

            $scope.dellink = function (c) {
                if ($scope.user.changeContent) {
                    $scope.project.linklist.splice($scope.project.linklist.indexOf(c), 1);
                    companyService.saveProjectName($scope.project, $scope.user, true);
                    $scope.editlink = {};
                    if (c.lable == "orglink") {
                        $scope.showeditlinkorg = false;
                    }
                    if (c.lable == "Details") {
                        $scope.showeditlinkbusi = false;
                    } $scope.hasChanged = false;
                }
            };
            // END LINK ENGINE






            $scope.saveProject = function () {
                if ($scope.user.changeContent) {
                    var ed = new Date();
                    //project.statelog = null;
                    if ($scope.statehasChanged) {
                        if ($scope.project.statelog == null || $scope.project.statelog.substr(0, 5) != "STATE") {
                            $scope.project.statelog = "STATE | PRIORITY | DEADLINE | ENTRY USER | ENTRY DATE \n";
                        }
                        $scope.project.statelog += "- " + $scope.project.state + " | " + $scope.project.priority + " | " + (new Date($scope.project.milestones[0].enddate)).toDateString() + " | " + $scope.user.name + " | " + ed.toDateString() + "\n";
                    }
                    if (ed instanceof Date && !isNaN(ed.valueOf())) {
                        $scope.editstatus.date = ed;
                    }
                    $scope.project.statuses[$scope.project.statuses.length - 1] = $scope.editstatus;

                    $scope.project.projbuownername = "";
                    let o = $scope.bus.find(x => x.name === $scope.project.bu.name);
                    if (o != undefined && o.owner != undefined) {
                        $scope.project.bu = o;
                        $scope.project.projbuownername = o.owner.name;
                    }

                    if ($scope.project.creationdate == undefined) {
                        $scope.project.creationdate = $scope.project.startdate;
                    }

                    if ($scope.project.state == "Closed" || $scope.project.state == "Rejected") {
                        var i = 0;
                        for (i = 0; i < $scope.project.deps.length; i++) {
                            $scope.project.deps[i].state = "Done";
                        }
                        for (i = 0; i < $scope.project.milestones.length; i++) {
                            $scope.project.milestones[i].state = "Done";
                        }
                        for (i = 0; i < $scope.project.risks.length; i++) {
                            $scope.project.risks[i].state = "Closed";
                        }
                    }

                    companyService.saveProjectName($scope.project, $scope.user, true);
                    $scope.hasChanged = false;
                    $scope.statehasChanged = false;
                }
            };
            $scope.statechange = function () {
                $scope.statehasChanged = true;
            }
            $scope.saveNow = function () {
                $scope.hasChanged = true;

                var md = new Date($("#projdate")[0].value);
                if (md instanceof Date && !isNaN(md.valueOf())) {
                    $scope.project.milestones[0].date = md.toISOString();
                }

                var med = new Date($("#projenddate")[0].value);
                if (med instanceof Date && !isNaN(med.valueOf())) {
                    $scope.project.milestones[0].enddate = med.toISOString();
                }
                if (md instanceof Date && !isNaN(md.valueOf()) && med instanceof Date && !isNaN(med.valueOf()) && md.valueOf() > med.valueOf()) {
                    $scope.project.milestones[0].enddate = md.toISOString();
                    $scope.project.milestones[0].rawenddate = $("#projdate")[0].value;

                }
                $scope.project.milestones[0].priority = $scope.project.priority;
                $scope.project.milestones[0].title = $scope.project.title;

                $scope.project.milestones[0].wsjf = Math.floor(($scope.project.milestones[0].bena * $scope.project.milestones[0].sena) /
                    ($scope.project.milestones[0].effort * $scope.project.milestones[0].risklevel) * 100 / 16);

                $scope.project.milestones[0].enablerlable = "XS";
                $scope.project.milestones[0].enablervalue = 0;
                if ($scope.project.milestones[0].bena * $scope.project.milestones[0].sena > 1) { $scope.project.milestones[0].enablervalue = 1; $scope.project.milestones[0].enablerlable = "S"; }
                if ($scope.project.milestones[0].bena * $scope.project.milestones[0].sena > 2) { $scope.project.milestones[0].enablervalue = 2; $scope.project.milestones[0].enablerlable = "M"; }
                if ($scope.project.milestones[0].bena * $scope.project.milestones[0].sena > 4) { $scope.project.milestones[0].enablervalue = 3; $scope.project.milestones[0].enablerlable = "L"; }
                if ($scope.project.milestones[0].bena * $scope.project.milestones[0].sena > 9) { $scope.project.milestones[0].enablervalue = 4; $scope.project.milestones[0].enablerlable = "XL"; }

                $scope.project.milestones[0].limiterlable = "XS";
                $scope.project.milestones[0].limitervalue = 0;
                if ($scope.project.milestones[0].effort * $scope.project.milestones[0].risklevel > 1) { $scope.project.milestones[0].limitervalue = 1; $scope.project.milestones[0].limiterlable = "S"; }
                if ($scope.project.milestones[0].effort * $scope.project.milestones[0].risklevel > 2) { $scope.project.milestones[0].limitervalue = 2; $scope.project.milestones[0].limiterlable = "M"; }
                if ($scope.project.milestones[0].effort * $scope.project.milestones[0].risklevel > 4) { $scope.project.milestones[0].limitervalue = 3; $scope.project.milestones[0].limiterlable = "L"; }
                if ($scope.project.milestones[0].effort * $scope.project.milestones[0].risklevel > 9) { $scope.project.milestones[0].limitervalue = 4; $scope.project.milestones[0].limiterlable = "XL"; }
            };
        }
    ]);
