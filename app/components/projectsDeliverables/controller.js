angular
    .module('riskApp')
    .controller('ProjectsDeliverablesController', [
        '$scope',
        '$rootScope',
        '$location',
        'userService',
        'companyService',
        function (
            $scope,
            $rootScope,
            $location,
            userService,
            companyService
        ) {

            companyService.company.subscribe(function (company) {
                $scope.company = company;
            });

            companyService.projects.subscribe(function (projects) {
                $scope.projects = projects;
                $scope.milestoneList = setMilestoneList(projects);
            });

            companyService.businessUnits.subscribe(function (units) {
                $scope.bus = units;
            });

            userService.user.subscribe(function (user) {
                $scope.user = user;
            });

            userService.users.subscribe(function (users) {
                $scope.users = users;
            });
            // copy objects
            //const target = qcopy(source);
            function qcopy(src) {
                return Object.assign({}, src);
            }

            $scope.year = (new Date()).getFullYear();
            $scope.showmepmbutton = true;
            $scope.showmeresbutton = true;
            $scope.showmeapbutton = true;

            $scope.milesearch = qcopy($rootScope.rootfiltersDeliverables);
            if ($scope.milesearch == null) {
                $scope.milesearch = {};
            }

            //clear all filters
            $scope.clearall = function () {
                $scope.milesearch = {};
            }

            //use same as onuserchange
            $scope.saveSearch = function () {
                $rootScope.rootfiltersDeliverables = qcopy($scope.milesearch);
            }

            //Save filters to user
            $scope.saveFilters = function () {
                $scope.user.userfiltersDeliverables = qcopy($rootScope.rootfiltersDeliverables);
                userService.updateUser($scope.user);
            }

            $scope.showdefault = function () {
                $scope.milesearch = [];
                if ($scope.user.userfiltersDeliverables != null) {
                    $scope.milesearch = qcopy($scope.user.userfiltersDeliverables);
                }
            };

            $scope.goToMilestoneInProject = function (milestoneId, projectId) {
                $location.path('/project/' + projectId + '/milestone/' + milestoneId);
            };

            $scope.showmepm = function () {
                $scope.milesearch.ppm = [$scope.user.name];
                $scope.showmepmbutton = false;
            };
            $scope.clearmepm = function () {
                $scope.milesearch.ppm = [];
                $scope.showmepmbutton = true;
            };
            $scope.showmeres = function () {
                $scope.milesearch.responsible = [$scope.user.name];
                $scope.showmeresbutton = false;
            };
            $scope.clearmeres = function () {
                $scope.milesearch.responsible = [];
                $scope.showmeresbutton = true;
            };
            $scope.showmeap = function () {
                $scope.milesearch.acountable = [$scope.user.name];
                $scope.showmeapbutton = false;
            };
            $scope.clearmeap = function () {
                $scope.milesearch.acountable = [];
                $scope.showmeapbutton = true;
            };

            $scope.barRender = function (mile) {
                return barRender(mile);
            }

            function setMilestoneList(projects) {
                var milestones = [];
                milestones = milestones.concat.apply([], projects.map(function (project) {
                    if (!project.milestones) {
                        return [];
                    }
                    return project.milestones.map(function (milestone) {
                        project.portname = '';
                        if (project.support != null) milestone['pportname'] = project.support.name;


                        milestone['projectid'] = project._id.$oid;
                        milestone['projectoid'] = project._id.$oid;
                        milestone['projecttitle'] = project.title;
                        milestone['pbuname'] = project.bu.name;
                        milestone['pstate'] = project.state;
                        milestone['ppm'] = project.pm;
                        milestone['pconnect'] = project.connect;
                        milestone['ppriority'] = project.priority;

                        return milestone;
                    });
                }));
                return milestones;
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
