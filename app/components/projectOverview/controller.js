angular
    .module('riskApp')
    .controller('ProjectOverviewController', [
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

            companyService
                .getProject(projectId)
                .subscribe(function (project) {

                    $scope.project = project;

                    if ($scope.project.statuses.length > 0) {

                        $scope.editstatus = angular.copy($scope.project.statuses[$scope.project.statuses.length - 1]);
                        $scope.saveStatusEnabled = true;
                    }
                });

            companyService
                .company
                .subscribe(function (company) {

                    $scope.company = company;
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
                startbase.setFullYear(thisyear.getFullYear()-1, 0, 1);

                var today = Math.round((((thisyear.getTime() - base.getTime()) / 86400000) * 33 / 365)+33);
                var oneday = today + 1;

//console.log("thisyear-1 = " + (thisyear.getFullYear()-1));

                if ((thisyear.getFullYear()-1) == s.getFullYear()||thisyear.getFullYear() == s.getFullYear()||(thisyear.getFullYear()+1) == s.getFullYear()) start = Math.round(((s.getTime() - startbase.getTime()) / 86400000) * 100 / (3*365));
                if ((thisyear.getFullYear()-1) == e.getFullYear()||thisyear.getFullYear() == e.getFullYear()||(thisyear.getFullYear()+1) == e.getFullYear()) end = Math.round(((e.getTime() - startbase.getTime()) / 86400000) * 100 / (3*365));
                if (start == end && end != 100) end = end + 1;
                if (start == 100) start--;
//console.log("Start = " + start);
//console.log("End = " + end);

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
                    if ((thisyear.getFullYear()-1) > s.getFullYear() && (thisyear.getFullYear()-1) > e.getFullYear()) {
                        var dist = Math.round(today / 4);
                        if ((mi.state == "Progress" || mi.state == "Target" || mi.state == "Qualified")) color = "red";
                        ret = "linear-gradient(to right, " + colorlevel + " 0%, #f6f1d3 " + dist + "%, #f6f1d3 " + today + "%, " + color + " " + today + "%, " + color + " " + oneday + "%, #f6f1d3 " + oneday + "%)";
                    }
                    if ((thisyear.getFullYear()+1) < s.getFullYear() && (thisyear.getFullYear()+1) < e.getFullYear()) {
                        var dist = 100 - Math.round((100 - today) / 4);
                        ret = "linear-gradient(to right, #f6f1d3 " + today + "%, " + color + " " + today + "%, " + color + " " + oneday + "%, #f6f1d3 " + oneday + "%, #f6f1d3 " + dist + "%, " + colorlevel + " 100%)";
                    }
                }

                return { background: ret }
            }
//BarRender END

        }
    ]);
