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

            userService
                .user
                .subscribe(function (user) {

                    $scope.user = user;
                });

            companyService
                .getProject(projectId)
                .subscribe(function (project) {

                    $scope.project = project;

                    showMilestone();
                });

            companyService
                .businessUnits
                .subscribe(function (units) {

                    $scope.bus = units;
                });

            userService
                .users
                .subscribe(function (users) {

                    $scope.users = users;
                });

            $scope.beginEditMile = function (mile) {

                $scope.editmile = mile;

                $scope.showMilestoneForm = true;
            };

            $scope.saveMilestones = function (mile) {

                var md = new Date($("#miledate")[0].value);
                if (md instanceof Date && !isNaN(md.valueOf())) { 
                    mile.date = md.toISOString(); 
                }

                var med = new Date($("#mileenddate")[0].value);
                if (med instanceof Date && !isNaN(med.valueOf())) { 
                    mile.enddate = med.toISOString(); 
                }

                mile.wsjf = Math.floor((mile.bena * mile.sena) /
                    (mile.effort * mile.risklevel) * 100 / 16);

                companyService.saveProject($scope.project);

                $scope.showMilestoneForm = false;
            };

            $scope.newMilestone = function () {

                var newdate = (new Date()).toISOString();
                
                $scope.editmile = $scope.project.milestones[$scope.project.milestones.length - 1];
                $scope.editmile._id = Math.random().toString(36).substr(2, 9);
                $scope.editmile.date = newdate;
                $scope.editmile.enddate = newdate;
                $scope.editmile.status = 'Green';
                $scope.editmile.state = 'Target';
                $scope.editmile.audience = 'Project';
                $scope.editmile.acountable = 'TBD';

                $scope.project.milestones.push({});

                $scope.showMilestoneForm = true;
            };

            $scope.hideMilestoneForm = function () {

                $scope.showMilestoneForm = false;
            };

            $scope.removeMilestone = function (milestone) {

                $scope.project.milestones.splice($scope.project.milestones.indexOf(milestone), 1);

                companyService.saveProject($scope.project);

                $scope.showMilestoneForm = false;
            };

            $scope.barRender = function (mile) {

                return barRender(mile);
            }

            function showMilestone() {
                
                // TODO(2): this doesn't work until correct id's for milestones has been implemented

                if (milestoneId) {

                    var milestone = $scope.project.milestones.filter(function (milestone) {
                        return milestone._id === milestoneId;
                    });

                    if (milestone[0]) {

                        $scope.editmile = milestone[0];
                        $scope.showMilestoneForm = true;
                    }
                }
            }

            function barRender(mi) {

                var s = new Date(Date.parse(mi.date));
                var e = new Date(Date.parse(mi.enddate));
                var start = 0;
                var end = 100;

                var thisyear = new Date();
                var base = new Date();
                base.setFullYear(thisyear.getFullYear(), 0, 1);

                var today = Math.round(((thisyear.getTime() - base.getTime()) / 86400000) * 100 / 365);
                var oneday = today + 1;

                if (today == 100) { today = 99; oneday = 100; }
                if (thisyear.getFullYear() == s.getFullYear()) start = Math.round(((s.getTime() - base.getTime()) / 86400000) * 100 / 365);
                if (thisyear.getFullYear() == e.getFullYear()) end = Math.round(((e.getTime() - base.getTime()) / 86400000) * 100 / 365);
                if (start == end && end != 100) end = end + 1;
                if (start == 100) start--;

                var color = "grey";
                var colorlevel = "Red";

                if (mi.risklevel != null && mi.risklevel != "" && mi.effort != null && mi.effort != "") {
                    var val = mi.risklevel * mi.effort;
                    if (val <= 12) colorlevel = "Orange";
                    if (val <= 6) colorlevel = "Yellow";
                    if (val <= 3) colorlevel = "Green";
                }

                var ret = "#f6f1d3";
                if (start < end) {
                    if (today <= start) {
                        ret = "linear-gradient(to right, #f6f1d3 " + today + "%, " + color + " " + today + "%, " + color + " " + oneday + "%, #f6f1d3 " + oneday + "%, #f6f1d3 " + start + "%, " + colorlevel + " " + start + "%, " + colorlevel + " " + end + "%, #f6f1d3 " + end + "%)";
                    }
                    if (today > start && today <= end) {
                        ret = "linear-gradient(to right, #f6f1d3 " + start + "%, " + colorlevel + " " + start + "%, " + colorlevel + " " + today + "%, " + color + " " + today + "%, " + color + " " + oneday + "%, " + colorlevel + " " + oneday + "%," + colorlevel + " " + end + "%, #f6f1d3 " + end + "%)";
                    }
                    if (today > end) {
                        if ((mi.state == "Progress" || mi.state == "Target" || mi.state == "Qualified")) color = "red";
                        ret = "linear-gradient(to right, #f6f1d3 " + start + "%, " + colorlevel + " " + start + "%, " + colorlevel + " " + end + "%, #f6f1d3 " + end + "%, #f6f1d3 " + today + "%, " + color + " " + today + "%, " + color + " " + oneday + "%, #f6f1d3 " + oneday + "%)";
                    }
                    if (thisyear.getFullYear() > s.getFullYear() && thisyear.getFullYear() > e.getFullYear()) {
                        var dist = Math.round(today / 2);
                        if ((mi.state == "Progress" || mi.state == "Target" || mi.state == "Qualified")) color = "red";
                        ret = "linear-gradient(to right, " + colorlevel + " 0%, #f6f1d3 " + dist + "%, #f6f1d3 " + today + "%, " + color + " " + today + "%, " + color + " " + oneday + "%, #f6f1d3 " + oneday + "%)";
                    }
                    if (thisyear.getFullYear() < s.getFullYear() && thisyear.getFullYear() < e.getFullYear()) {
                        var dist = 100 - Math.round((100 - today) / 2);
                        ret = "linear-gradient(to right, #f6f1d3 " + today + "%, " + color + " " + today + "%, " + color + " " + oneday + "%, #f6f1d3 " + oneday + "%, #f6f1d3 " + dist + "%, " + colorlevel + " 100%)";
                    }
                }

                return { background: ret }
            }
        }
    ]);
