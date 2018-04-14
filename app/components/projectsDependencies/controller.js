    angular
    .module('riskApp')
    .controller('ProjectsDependenciesController', [
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

            $scope.depsearch=[];
            $scope.depsearch.resname=[];
            companyService.loadCompany();
            
            
            companyService.projects.subscribe(function (projects) {

                $scope.projects = projects;
                $scope.depList = setDepList(projects);
                $scope.showmepmbutton=true;
                $scope.showmepobutton=true;
            });

            companyService.businessUnits.subscribe(function (units) {

                $scope.bus = units;
            });
            userService
            .user
            .subscribe(function (user) {

                $scope.user = user;
            });

            userService.users.subscribe(function (users) {

                $scope.users = users;
                //$scope.depsearch.resname=[$scope.user.name];
                

            });

            $scope.goToDepInProject = function (depId, projectId) {

                $location.path('/project/' + projectId + '/dependencies/' + depId);
            };

            $scope.showmepm = function () {
                $scope.depsearch.audience = [];
                $scope.depsearch.agreement = [];
                $scope.depsearch.status = [];
                
                $scope.depsearch.acname = [$scope.user.name];
                $scope.showmepmbutton=false;
            };
            $scope.clearmepm = function () {

                $scope.depsearch.acname = [];
                $scope.showmepmbutton=true;
            };
            $scope.showmepo = function () {
                $scope.depsearch.audience = [];
                $scope.depsearch.agreement = [];
                $scope.depsearch.status = [];
                $scope.depsearch.resname = [$scope.user.name];
                $scope.showmepobutton=false;
            };
            $scope.clearmepo = function () {

                $scope.depsearch.resname = [];
                $scope.showmepobutton=true;
            };



            $scope.depbarRender = function (dep) {  
                return depbarRender(dep);
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
            

            function setDepList(projects) {

                var deps = [];
                deps = deps.concat.apply([], projects.map(function (project) {

                    if (!project.deps) {
                        return [];
                    }

                    return project.deps.map(function (dep) {

                        dep['projectid'] = project._id.$oid;
                        dep['projectoid'] = project._id.$oid;
                        dep['projecttitle'] = project.title;
                        dep['buname'] = project.bu.name;
                        dep['depbuname'] = (dep != null && dep.bu != null && dep.bu.name != null)?dep.bu.name:"UNKNOWN";
                        dep['support'] = project.support;
                        dep['pstate'] = project.state;
                        dep['ptype'] = project.type;
                        dep['acname'] = (dep.requester != null) ? dep.requester.name : 'TBD';
                        dep['resname'] = (dep.resowner != null) ? dep.resowner.name : 'TBD';
                       
                        
                        
                        return dep;
                    });
                }));

                return deps;
            }


        }
    ]);
