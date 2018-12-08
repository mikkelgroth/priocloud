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

                $scope.search = $rootScope.filtersProjectsOverview;

            });

            //use same as onuserchange
            $scope.saveSearch = function () {
                $rootScope.filtersProjectsOverview = $scope.search;
            }

            //Save filters to user
            $scope.saveFilters = function () {
                $scope.user.filtersProjectsOverview = $rootScope.filtersProjectsOverview;
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



                    project.warn = "";
                    // set last status
                    project.lastStatus = project.statuses[project.statuses.length - 1];
                    project.lastStatusFlag = project.lastStatus.status;
                    project.financeFlag = project.financeControl;

                    var now = new Date();
                    var status = new Date(project.lastStatus.date);
                    if (Math.round((status.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) < -14) { project.warn = "!"; }
                    if (Math.round((status.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) < -30) { project.warn = "!!"; }
                    if (Math.round((status.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) < -45) { project.warn = "!!!"; }



                    return project;
                });
            }

            //TEST projects bubble graph
            $scope.projectslabels = [];
            $scope.projectsoptions = {
                responsive: false,
                legend: {
                    verticalAlign: "top",
                    horizontalAlign: "right",
                    display: true

                }
            };


            if ($scope.projectList != null) {

                $scope.projectsseries = [];
                $scope.projectsdata = [];
                $scope.projectsoptions = {

                    legend: {
                        display: true,
                        position: 'right'
                    },
                    tooltips: true,
                    scales: {
                        xAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: 'Strategy'
                            },
                            display: true,
                            ticks: {
                                max: 300,
                                min: 0,
                                stepSize: 100
                            }
                        }],
                        yAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: 'Top line benefit'
                            },
                            display: true,
                            ticks: {
                                max: 300,
                                min: 0,
                                stepSize: 100
                            }
                        }]
                    }
                };
                var projects;
                for (var i = 0; i < $scope.projectList.length; i++) {
                    projects = $scope.projectList[i];

                    if (projects.state != 'Closed') {
                        $scope.projectsseries.push(projects.title);
                        $scope.projectsdata.push([{
                            x: parseInt(projects.kpi1) * 50 + parseInt(projects.kpi2) * 10 + parseInt(projects.kpi3),
                            y: parseInt(projects.kpi6) * 50 + parseInt(projects.kpi5) * 10 + parseInt(projects.kpi4),
                            r: parseInt(projects.kpi2) * 8
                        }]);
                    }
                }
                $scope.onprojectsClick = function (points, evt) {
                    console.log(points, evt);
                };

            } else {
                $scope.projectsdata = [{ x: "1", y: "2", r: "30" }];
            }
            //TEST END    


        }
    ]);
