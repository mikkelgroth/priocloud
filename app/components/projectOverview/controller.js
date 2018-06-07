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

                    if(($scope.project.pm !=null && $scope.user.email == $scope.project.pm.email) ||
                    ($scope.project.po !=null && $scope.user.email == $scope.project.po.email) || 
                    ($scope.project.altpo !=null && $scope.user.email == $scope.project.altpo.email) || 
                    ($scope.project.altpm !=null && $scope.user.email == $scope.project.altpm.email) || 
                    $scope.user.isOwner || $scope.user.controller || $scope.user.subadmin || $scope.user.admin){ 
                        
                        if($scope.project.editUser == null){
                            $scope.project.showRelease = false;
                            $scope.user.changeContent=true;
                        }else if($scope.project.editUser != null && $scope.project.editUser.email == $scope.user.email){
                            $scope.project.showRelease = true;
                            $scope.user.changeContent=true;
                        }else{
                            $scope.project.showRelease = false;
                            $scope.user.changeContent=false;
                        }
                    } else {
                        $scope.user.changeContent=false;
                    }
                    

                    if ($scope.project.statuses.length > 0) {

                        $scope.editstatus = angular.copy($scope.project.statuses[$scope.project.statuses.length - 1]);
                        $scope.saveStatusEnabled = true;
                        $scope.showfilters = true;
                    }
                });

            companyService
                .company
                .subscribe(function (company) {

                    $scope.company = company;
                });

            $scope.saveProject = function (project) {
                
                companyService.saveProjectName(project, $scope.user, true);
                $scope.hasChanged=false;
            };
            $scope.editProject = function (project) {
                project.editUser = $scope.user;
                $scope.project.showRelease = true;
                companyService.saveProjectOnLoad(project);
                $scope.hasChanged=false;
            };
            $scope.releaseProject = function (project) {
                project.editUser = null;
                $scope.project.showRelease = false;
                companyService.saveProjectOnLoad(project);
                //$location.path('/');
            };

            $scope.saveNow = function (project) {
                
                $scope.hasChanged=true;               
            };
            //TEST Finance Chart Bar
            $scope.finlabels = ['Q1', 'Q2', 'Q3', 'Q4'];
            $scope.finseries = ['Budget', 'Posted', 'Deviation'];
            $scope.finoptions = {
                responsive: false,
                legend: { 
                    verticalAlign: "top",
                    horizontalAlign: "right",
                    display: true
                    
                }
            };
            
             
            if($scope.project!=null && $scope.project.finance!=null){
                $scope.findata =
                [
                [$scope.project.finance.budTotalq1, $scope.project.finance.budTotalq2, $scope.project.finance.budTotalq3, $scope.project.finance.budTotalq4],
                [$scope.project.finance.postTotalq1, $scope.project.finance.postTotalq2, $scope.project.finance.postTotalq3, $scope.project.finance.postTotalq4],
                [$scope.project.finance.devTotalq1, $scope.project.finance.devTotalq2, $scope.project.finance.devTotalq3, $scope.project.finance.devTotalq4]
                ];
            } else {
                $scope.findata =
                [
                    [0,0,0,0],
                    [0,0,0,0],
                    [0,0,0,0]
                ];
            }           
            //TEST END     
            
//TEST Risk bubble graph
$scope.risklabels = [];
$scope.riskoptions = {
    responsive: false,
    legend: { 
        verticalAlign: "top",
        horizontalAlign: "right",
        display: true
        
    }
};

 
if($scope.project!=null && $scope.project.risks!=null){
    
        $scope.riskseries = [];
        $scope.riskdata = [];
        $scope.riskoptions = {
            
            legend: {
                display: true,
                position: 'right'
            },    
            tooltips: true,
            scales: {
              xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Probability'
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
                    labelString: 'Impact'
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
        var risk;
        for (var i = 0; i < $scope.project.risks.length; i++) {
            risk = $scope.project.risks[i];
            var statusvalue = (risk.status=='Yellow')?2:(risk.status=='Orange')?4:(risk.status=='Red')?6:0; 
            
            if((risk.showInReport && risk.type=='Risk' && risk.state!='Closed') && 
                (risk.audience!='Confidential' || (risk.audience=='Confidential' && 
                (user.email==project.po.email || user.email==project.pm.email || user.isOwner ||  user.admin) && 
                project.showconfrisk=='true'))){
                    $scope.riskseries.push(risk.title);
                    $scope.riskdata.push([{
                        x: parseInt(risk.prob)*50+parseInt(risk.impact)*10+parseInt(risk.recCompValue)+statusvalue,
                        y: parseInt(risk.impact)*50+parseInt(risk.recCompValue)*10+parseInt(risk.prob)+statusvalue,
                        r: parseInt(risk.recCompValue)*8+statusvalue
                    }]);
            }
        }
        $scope.onRiskClick = function (points, evt) {
            console.log(points, evt);
          };
      
} else {
    $scope.riskdata = [{x: "1", y: "2", r: "30"}];
}           
//TEST END     



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
            
            $scope.goToDepInProject = function (dep) {
                
                $location.path('/project/' + projectId + '/dependencies/' + dep._id);
            };
                
            $scope.barRender = function (mile) {
                return barRender(mile);
            }

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
