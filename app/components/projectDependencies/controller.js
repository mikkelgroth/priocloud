angular
    .module('riskApp')
    .controller('ProjectDependenciesController', [
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
            var depId = $routeParams.depid;

            $scope.showDepForm = false;

            userService
                .user
                .subscribe(function (user) {

                    $scope.user = user;
                });

            companyService
                .getProject(projectId)
                .subscribe(function (project) {

                    $scope.project = project;

                    showDep();
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

            
            $scope.beginEditDep = function (dep) {
                
                $scope.editdep = dep;
                
                $scope.showMilestoneForm = false;
                $scope.showDepForm = true;
                $scope.deleteThis=false;
                                
            };
                


            $scope.saveDeps = function (open) {
                companyService.saveProjectName($scope.project, $scope.user.name);
                $scope.hasChanged=false;
                $scope.deleteThis=false;
                
                if (open) {
                    $scope.showDepForm = true;
                }
                
            };
            
            $scope.saveNow = function (dep) {
                var md = new Date($("#depdate")[0].value);
                if (md instanceof Date && !isNaN(md.valueOf())) { 
                    dep.depdate = md.toISOString(); 
                }


                $scope.hasChanged=true;               
            };
            $scope.saveNowQuick = function () {
                $scope.hasChanged=true;               
            };


            $scope.newDep = function () {
                
                if($scope.project.deps==null){
                    $scope.project.deps=[];
                }
                $scope.project.deps.push({});
                $scope.editdep=$scope.project.deps[$scope.project.deps.length-1];
                
                $scope.editdep._id = Math.random().toString(36).substr(2, 9);
                $scope.editdep.status = 'Green';
                $scope.editdep.title = 'NEW DEPENDENCY';
                $scope.editdep.agreement = 'None';
                $scope.editdep.names = 'TBD';
                $scope.editdep.showInReport = true;
                $scope.editdep.audience = 'Project';
                $scope.editdep.requester = $scope.user.name;
                $scope.editdep.resowner = $scope.user.name;
                $scope.editdep.quantum = 'Minor tasks';
                $scope.editdep.delmap = 'None';
                $scope.editdep.description = 'None';
                $scope.editdep.depdate = (new Date()).toISOString();
                $scope.editdep.depdeaddate = (new Date()).toISOString();
                $scope.editdep.state = 'Open';

                $scope.showDepForm = true;
                $scope.showMilestoneForm = false;
                $scope.deleteThis=false;
                                
            };
                    
         
            $scope.hideDepForm = function () {    
                $scope.showDepForm = false;                
            };
                
            $scope.removeDep = function (dep) {
                $scope.project.deps.splice($scope.project.deps.indexOf(dep), 1);
                companyService.saveProjectName($scope.project, $scope.user.name);
                $scope.showDepForm = false;
            };

            $scope.depbarRender = function (dep) {  
                return depbarRender(dep);
            }
                

            
            function showDep() {
                
                // TODO(2): this doesn't work until correct id's for deps has been implemented

                if (depId) {

                    var dep = $scope.project.deps.filter(function (dep) {
                        return dep._id === depId;
                    });

                    if (dep[0]) {

                        $scope.editdep = dep[0];
                        $scope.showDepForm = true;
                    }
                }
            }

            //depBarRender START
            function depbarRender(dep) {
                
                                var s = new Date(Date.parse(dep.depdate));
                                var e = new Date(Date.parse(dep.depdeaddate));
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
                                var colorlevel = "Blue";

                                if (dep.agreement != null && dep.agreement != "") {
                        
                                    if (dep.agreement == "Conflict") colorlevel = "Red";
                                    if (dep.agreement == "Tentative") colorlevel = "Yellow";
                                    if (dep.agreement == "Agreed") colorlevel = "Green";
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
                                        if (dep.state == "Open") color = "red";
                                        ret = "linear-gradient(to right, #f6f1d3 " + start + "%, " + colorlevel + " " + start + "%, " + colorlevel + " " + end + "%, #f6f1d3 " + end + "%, #f6f1d3 " + today + "%, " + color + " " + today + "%, " + color + " " + oneday + "%, #f6f1d3 " + oneday + "%)";
                                    }
                                    if ((thisyear.getFullYear()-1) > s.getFullYear() && (thisyear.getFullYear()-1) > e.getFullYear()) {
                                        var dist = Math.round(today / 4);
                                        if (dep.state == "Open") color = "red";
                                        ret = "linear-gradient(to right, " + colorlevel + " 0%, #f6f1d3 " + dist + "%, #f6f1d3 " + today + "%, " + color + " " + today + "%, " + color + " " + oneday + "%, #f6f1d3 " + oneday + "%)";
                                    }
                                    if ((thisyear.getFullYear()+1) < s.getFullYear() && (thisyear.getFullYear()+1) < e.getFullYear()) {
                                        var dist = 100 - Math.round((100 - today) / 4);
                                        ret = "linear-gradient(to right, #f6f1d3 " + today + "%, " + color + " " + today + "%, " + color + " " + oneday + "%, #f6f1d3 " + oneday + "%, #f6f1d3 " + dist + "%, " + colorlevel + " 100%)";
                                    }
                                }
                
                                return { background: ret }
                            }
                //depBarRender END

        }
    ]);
