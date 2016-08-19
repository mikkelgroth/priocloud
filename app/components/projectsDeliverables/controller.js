angular
    .module('riskApp')
    .controller('ProjectsDeliverablesController', [
        '$scope',
        '$location',
        'userService',
        'companyService',
        function (
            $scope,
            $location,
            userService,
            companyService
        ) {

            companyService.projects.subscribe(function (projects) {

                $scope.projects = projects;
                $scope.milestoneList = setMilestoneList(projects);
            });

            companyService.businessUnits.subscribe(function (units) {

                $scope.bus = units;
            });

            userService.users.subscribe(function (users) {

                $scope.users = users;
            });

            $scope.goToMilestoneInProject = function (projectId) {

                $location.path('/project/' + projectId + '/milestone');
            };

            $scope.barRender = function (mile) {
                return barRender(mile);
            }

            function setMilestoneList(projects) {

                var milestones = [];
                milestones = milestones.concat.apply([], projects.map(function (project) {

                    return project.milestones.map(function (milestone) {

                        milestone['projectid'] = project._id.$oid;
                        milestone['projectoid'] = project._id.$oid;
                        milestone['projecttitle'] = project.title;
                        milestone['buname'] = project.bu.name;
                        milestone['acname'] = (milestone.acountable != null) ? milestone.acountable.name : 'TBD';

                        return milestone;
                    });
                }));

                return milestones;
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
