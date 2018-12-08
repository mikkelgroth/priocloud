angular
    .module('riskApp')
    .controller('ProjectsGanttController', [
        '$scope',
        '$rootScope',
        '$routeParams',
        '$location',
        'userService',
        'companyService',
        function (
            $scope,
            $rootScope,
            $routeParams,
            $location,
            userService,
            companyService
        ) {

            companyService.reloadCompany();
            companyService
                .company
                .subscribe(function (company) {

                    $scope.company = company;

                });

            companyService.projects.subscribe(function (projects) {

                $scope.projectList = setProjectList(projects);
                $scope.showmepmbutton = true;
                $scope.showmepobutton = true;
                $scope.showmeownerbutton = true;

                $scope.search = $rootScope.filtersProjectsGanttOverview;

            });

            //use same as onuserchange
            $scope.saveSearch = function () {
                $rootScope.filtersProjectsGanttOverview = $scope.search;
            }

            //Save filters to user
            $scope.saveFilters = function () {
                $scope.user.filtersProjectsGanttOverview = $rootScope.filtersProjectsGanttOverview;
                userService.updateUser($scope.user);
            }

            companyService.businessUnits.subscribe(function (units) {

                $scope.bus = units;
            });

            userService.users.subscribe(function (users) {

                $scope.users = users;
            });

            $scope.goToProject = function (projectId) {

                $location.path('/project/' + projectId);
            };

            $scope.showmepm = function () {

                $scope.search.pmname = [$scope.user.name];
                $scope.showmepmbutton = false;
            };
            $scope.clearmepm = function () {

                $scope.search.pmname = [];
                $scope.showmepmbutton = true;
            };
            $scope.showmebuowner = function () {

                $scope.search.projbuownername = [$scope.user.name];
                $scope.showmeownerbutton = false;
            };
            $scope.clearmebuowner = function () {

                $scope.search.projbuownername = [];
                $scope.showmeownerbutton = true;
            };
            $scope.showmepo = function () {

                $scope.search.poname = [$scope.user.name];
                $scope.showmepobutton = false;
            };
            $scope.clearmepo = function () {

                $scope.search.poname = [];
                $scope.showmepobutton = true;
            };
            //BarRender START
            $scope.barRender = function (mi) {

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
                    if ((thisyear.getFullYear() - 1) > s.getFullYear() && (thisyear.getFullYear() - 1) > e.getFullYear()) {
                        var dist = Math.round(today / 4);
                        if ((mi.state == "Progress" || mi.state == "Target" || mi.state == "Qualified")) color = "red";
                        ret = "linear-gradient(to right, " + colorlevel + " 0%, #f6f1d3 " + dist + "%, #f6f1d3 " + today + "%, " + color + " " + today + "%, " + color + " " + oneday + "%, #f6f1d3 " + oneday + "%)";
                    }
                    if ((thisyear.getFullYear() + 1) < s.getFullYear() && (thisyear.getFullYear() + 1) < e.getFullYear()) {
                        var dist = 100 - Math.round((100 - today) / 4);
                        ret = "linear-gradient(to right, #f6f1d3 " + today + "%, " + color + " " + today + "%, " + color + " " + oneday + "%, #f6f1d3 " + oneday + "%, #f6f1d3 " + dist + "%, " + colorlevel + " 100%)";
                    }
                }

                return { background: ret }
            }
            //BarRender END

            function setProjectList(projects) {

                return projects.map(function (project) {

                    project.buname = project.bu.name;
                    project.poname = project.po.name;
                    project.pmname = project.pm.name;
                    project.projbuownername = "";
                    if (project.bu != null && project.bu.owner != null) project.projbuownername = project.bu.owner.name;

                    project.portname = '';
                    if (project.support != null) project.portname = project.support.name;

                    // set last status
                    project.lastStatus = project.statuses[project.statuses.length - 1];
                    project.lastStatusFlag = project.lastStatus.status;
                    project.financeFlag = project.financeControl;

                    return project;
                });
            }
        }
    ]);
