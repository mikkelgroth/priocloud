angular
    .module('riskApp')
    .controller('ProjectMilestoneController', [
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
                    mile.wsjf = Math.floor((mile.bena * mile.sena * mile.cena * mile.mena) /
                        (mile.effort * mile.risklevel) * 100 / (4 * 4 * 4 * 4));
                    mile.enablerlable = "XS";
                    mile.enablervalue = 0;
                    mile.enablervaluetotal = mile.bena * mile.sena * mile.cena * mile.mena;
                    if (mile.enablervaluetotal > 1) { mile.enablervalue = 1; mile.enablerlable = "S"; }
                    if (mile.enablervaluetotal > 8) { mile.enablervalue = 2; mile.enablerlable = "M"; }
                    if (mile.enablervaluetotal > 50) { mile.enablervalue = 3; mile.enablerlable = "L"; }
                    if (mile.enablervaluetotal > 100) { mile.enablervalue = 4; mile.enablerlable = "XL"; }

                    mile.limiterlable = "XS";
                    mile.limitervalue = 0;
                    mile.limitervaluetotal = mile.effort * mile.risklevel;
                    if (mile.limitervaluetotal > 1) { mile.limitervalue = 1; mile.limiterlable = "S"; }
                    if (mile.limitervaluetotal > 2) { mile.limitervalue = 2; mile.limiterlable = "M"; }
                    if (mile.limitervaluetotal > 4) { mile.limitervalue = 3; mile.limiterlable = "L"; }
                    if (mile.limitervaluetotal > 9) { mile.limitervalue = 4; mile.limiterlable = "XL"; }

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
                    $scope.editmile._id = Math.random().toString(36).substr(2, 9);
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
                    mile.enablerlable = "XS";
                    mile.enablervalue = 0;
                    mile.enablervaluetotal = 1;
                    mile.limiterlable = "XS";
                    mile.limitervalue = 0;
                    mile.limitervaluetotal = 1;
                    $scope.editmile.title = 'NEW DELIVERABLE';

                    $scope.deleteThis = false;
                    $scope.saveNow($scope.editmile);
                    $('.popup').addClass('active');
                }
            };

            $scope.newCloneMilestone = function (m) {
                if ($scope.user.changeContent) {
                    $scope.editmile = angular.copy(m);
                    $scope.editmile._id = Math.random().toString(36).substr(2, 9);
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

                return barRender(mile);
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
            //BarRender START
            function barRender(mi) {

                var s = new Date(Date.parse(mi.date));
                var e = new Date(Date.parse(mi.enddate));
                var start = 0;
                var end = 100;

                var thisyear = new Date();
                var base = new Date();
                var startbase = new Date();
                base.setFullYear(thisyear.getFullYear(), 0, 1);
                startbase.setFullYear(thisyear.getFullYear() - 1, 0, 1);

                var today = Math.round((((thisyear.getTime() - base.getTime()) / 86400000) * 33 / 365) + 33);
                var oneday = today + 1;

                //console.log("thisyear-1 = " + (thisyear.getFullYear()-1));

                if ((thisyear.getFullYear() - 1) == s.getFullYear() || thisyear.getFullYear() == s.getFullYear() || (thisyear.getFullYear() + 1) == s.getFullYear()) start = Math.round(((s.getTime() - startbase.getTime()) / 86400000) * 100 / (3 * 365));
                if ((thisyear.getFullYear() - 1) == e.getFullYear() || thisyear.getFullYear() == e.getFullYear() || (thisyear.getFullYear() + 1) == e.getFullYear()) end = Math.round(((e.getTime() - startbase.getTime()) / 86400000) * 100 / (3 * 365));
                if (start == end && end != 100) end = end + 1;
                if (start == 100) start--;
                //console.log("Start = " + start);
                //console.log("End = " + end);

                var colorbackground = "#f7f8f9";
                var color = "rgb(38,38,38)";
                var colorlevel = "rgba(243,54,49)";

                if (mi.risklevel != null && mi.risklevel != "" && mi.effort != null && mi.effort != "") {
                    var val = mi.risklevel * mi.effort;
                    if (val <= 12) colorlevel = "rgba(245,160,47)";
                    if (val <= 6) colorlevel = "rgb(254,236,2)";
                    if (val <= 3) colorlevel = "rgb(95,185,59)";
                }

                var ret = "#f6f1d3";
                if (start < end) {
                    if (today <= start) {
                        ret = "linear-gradient(to right, " + colorbackground + " " + today + "%, " + color + " " + today + "%, " + color + " " + oneday + "%, " + colorbackground + " " + oneday + "%, " + colorbackground + " " + start + "%, " + colorlevel + " " + start + "%, " + colorlevel + " " + end + "%, " + colorbackground + " " + end + "%)";
                    }
                    if (today > start && today <= end) {
                        ret = "linear-gradient(to right, " + colorbackground + " " + start + "%, " + colorlevel + " " + start + "%, " + colorlevel + " " + today + "%, " + color + " " + today + "%, " + color + " " + oneday + "%, " + colorlevel + " " + oneday + "%," + colorlevel + " " + end + "%, " + colorbackground + " " + end + "%)";
                    }
                    if (today > end) {
                        if ((mi.state == "Progress" || mi.state == "Target" || mi.state == "Qualified")) color = "red";
                        ret = "linear-gradient(to right, " + colorbackground + " " + start + "%, " + colorlevel + " " + start + "%, " + colorlevel + " " + end + "%, " + colorbackground + " " + end + "%, " + colorbackground + " " + today + "%, " + color + " " + today + "%, " + color + " " + oneday + "%, " + colorbackground + " " + oneday + "%)";
                    }
                    if ((thisyear.getFullYear() - 1) > s.getFullYear() && (thisyear.getFullYear() - 1) > e.getFullYear()) {
                        var dist = Math.round(today / 4);
                        if ((mi.state == "Progress" || mi.state == "Target" || mi.state == "Qualified")) color = "red";
                        ret = "linear-gradient(to right, " + colorlevel + " 0%, " + colorbackground + " " + dist + "%, " + colorbackground + " " + today + "%, " + color + " " + today + "%, " + color + " " + oneday + "%, " + colorbackground + " " + oneday + "%)";
                    }
                    if ((thisyear.getFullYear() + 1) < s.getFullYear() && (thisyear.getFullYear() + 1) < e.getFullYear()) {
                        var dist = 100 - Math.round((100 - today) / 4);
                        ret = "linear-gradient(to right, " + colorbackground + " " + today + "%, " + color + " " + today + "%, " + color + " " + oneday + "%, " + colorbackground + " " + oneday + "%, " + colorbackground + " " + dist + "%, " + colorlevel + " 100%)";
                    }
                }

                return { background: ret }
            }
            //BarRender END
        }
    ]);
