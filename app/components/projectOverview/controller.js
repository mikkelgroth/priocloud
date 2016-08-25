angular
    .module('riskApp')
    .controller('ProjectOverviewController', [
        '$scope',
        '$routeParams',
        '$location',
        'userService',
        'companyService',
        'rx',
        function (
            $scope,
            $routeParams,
            $location,
            userService,
            companyService,
            rx
        ) {

            var projectId = $routeParams.id;

            companyService
                .getProject(projectId)
                .subscribe(function (project) {

                    $scope.project = project;

                    if ($scope.project.statuses.length > 0) {

                        $scope.editstatus = angular.copy($scope.project.statuses[$scope.project.statuses.length - 1]);
                        $scope.saveStatusEnabled = true;
                    }
                });

            $scope.goToRiskInProject = function (risk) {

                $location.path('/project/' + projectId + '/risks/' + risk._id);
            };

            $scope.goToMilestoneInProject = function (milestone) {

                $location.path('/project/' + projectId + '/milestone/' + milestone._id);
            };

            $scope.barRender = function (mile) {
                return barRender(mile);
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
