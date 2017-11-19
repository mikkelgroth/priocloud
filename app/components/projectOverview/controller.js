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

            $scope.saveProject = function (project) {
                
                companyService.saveProjectName(project, $scope.user.name);
                $scope.hasChanged=false;
            };

            $scope.saveNow = function (project) {
                
                $scope.hasChanged=true;               
            };
            //Finance Chart Bar
            $scope.overviewFinancedata = {
                labels: ["match1", "match2", "match3", "match4", "match5"],
                datasets: [
                    {
                        label: "TeamA Score",
                        data: [10, 50, 25, 70, 40],
                        backgroundColor: [
                            "rgba(10,20,30,0.3)",
                            "rgba(10,20,30,0.3)",
                            "rgba(10,20,30,0.3)",
                            "rgba(10,20,30,0.3)",
                            "rgba(10,20,30,0.3)"
                        ],
                        borderColor: [
                            "rgba(10,20,30,1)",
                            "rgba(10,20,30,1)",
                            "rgba(10,20,30,1)",
                            "rgba(10,20,30,1)",
                            "rgba(10,20,30,1)"
                        ],
                        borderWidth: 1
                    },
                    {
                        label: "TeamB Score",
                        data: [20, 35, 40, 60, 50],
                        backgroundColor: [
                            "rgba(50,150,200,0.3)",
                            "rgba(50,150,200,0.3)",
                            "rgba(50,150,200,0.3)",
                            "rgba(50,150,200,0.3)",
                            "rgba(50,150,200,0.3)"
                        ],
                        borderColor: [
                            "rgba(50,150,200,1)",
                            "rgba(50,150,200,1)",
                            "rgba(50,150,200,1)",
                            "rgba(50,150,200,1)",
                            "rgba(50,150,200,1)"
                        ],
                        borderWidth: 1
                    }
                ]
            };
        
            //options
            $scope.overviewFinanceoptions = {
                responsive: true,
                title: {
                    display: true,
                    position: "top",
                    text: "Bar Graph",
                    fontSize: 18,
                    fontColor: "#111"
                },
                legend: {
                    display: true,
                    position: "bottom",
                    labels: {
                        fontColor: "#333",
                        fontSize: 16
                    }
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            min: 0
                        }
                    }]
                }
            };
        
            



            // This code is also in Status controller

            $scope.saveStatus = function (status) {

                var ed = new Date();
                if (ed instanceof Date && !isNaN(ed.valueOf())) {
                    status.date = ed;
                }

                if ($scope.project.pm.email == $scope.user.email) {
                    status.apo = "Not evaluated";
                }

                // RISK: this can be manipulated with and set even if you are not admin
                if ((($scope.project.altpo != null && $scope.project.altpo.email == $scope.user.email) || ($scope.project.po != null && $scope.project.po.email == $scope.user.email) || $scope.user.admin) &&
                    (status.statusstate == "Final" || status.apo == "Approved")) {

                    status.apo = "Approved";
                    status.statusstate = "Final";
                    status.savedfinalby=$scope.user.name;
                    status.active = false;
                }

                if ($scope.project.statuses.length == 0) {

                    $scope.project.statuses.push(status);

                } else {

                    $scope.project.statuses[$scope.project.statuses.length - 1] = status;
                }

                //$scope.logProject(true, "Status saved");

                companyService.saveProjectName($scope.project, $scope.user.name);
                $scope.hasChanged=false;

            }


            
            
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
