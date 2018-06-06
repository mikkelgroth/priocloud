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
                    if(($scope.project.editUser != null && $scope.project.editUser.email == $scope.user.email) ){                       
                        $scope.user.changeContent=true;
                    } else {
                        $scope.user.changeContent=false;
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

                $scope.showMilestoneForm = true;
                $scope.deleteThis=false;
                
            };

            $scope.beginEditDep = function (dep) {
                
                $scope.editdep = dep;
                
                $scope.showMilestoneForm = false;
                $scope.showDepForm = true;
                $scope.deleteThis=false;
                                
            };
                


            $scope.saveMilestones = function (open) {
                companyService.saveProjectName(project, $scope.user, true);
                $scope.hasChanged=false;
                $scope.deleteThis=false;
                
                if (open) {
                    $scope.showMilestoneForm = true;
                }
                
            };
            
            $scope.saveNowQuick = function () {
                $scope.hasChanged=true;               
            };

           
            $scope.saveNow = function (mile) {
                var md = new Date($("#miledate")[0].value);
                if (md instanceof Date && !isNaN(md.valueOf())) { 
                    mile.date = md.toISOString(); 
                }

                var med = new Date($("#mileenddate")[0].value);
                if (med instanceof Date && !isNaN(med.valueOf())) { 
                    mile.enddate = med.toISOString(); 
                }
                if (md instanceof Date && !isNaN(md.valueOf()) && med instanceof Date && !isNaN(med.valueOf()) && md.valueOf()>med.valueOf()) { 
                    mile.enddate = md.toISOString();
                    mile.rawenddate = $("#miledate")[0].value;
                    
                }


                mile.wsjf = Math.floor((mile.bena * mile.sena) /
                    (mile.effort * mile.risklevel) * 100 / 16);
                $scope.hasChanged=true;               
            };

            $scope.newMilestone = function () {

                if($scope.project.milestones==null){
                    $scope.project.milestones=[];
                }
                $scope.project.milestones.push({});
                $scope.editmile=$scope.project.milestones[$scope.project.milestones.length-1];
                var newdate = (new Date()).toISOString();
                var end = new Date();
                end.setFullYear(end.getFullYear()+1);

                $scope.editmile._id = Math.random().toString(36).substr(2, 9);
                $scope.editmile.date = newdate;
                $scope.editmile.enddate = end.toISOString();
                $scope.editmile.status = 'Green';
                $scope.editmile.state = 'Target';
                $scope.editmile.type = 'Milestone';
                $scope.editmile.showInReport = true;
                $scope.editmile.audience = 'Project';
                $scope.editmile.acountable = $scope.user.name;
                $scope.editmile.responsible = $scope.user.name;
                $scope.editmile.bena = '1';
                $scope.editmile.effort= '1';
                $scope.editmile.sena= '1';
                $scope.editmile.risklevel= '1';
                $scope.editmile.title= 'NEW DELIVERABLE';

                
                $scope.showMilestoneForm = true;
                $scope.deleteThis=false;
                
            };

            

            $scope.hideMilestoneForm = function () {
                $scope.showMilestoneForm = false;
            };
            
                
            $scope.removeMilestone = function (dep) {
                $scope.project.milestones.splice($scope.project.milestones.indexOf(dep), 1);
                companyService.saveProjectName($scope.project, $scope.user.name);
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
