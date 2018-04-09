angular
    .module('riskApp')
    .controller('ProjectsOverviewController', [
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

            companyService
                .company
                .subscribe(function (company) {

                    $scope.company = company;
                });
            
            companyService.projects.subscribe(function (projects) {

                $scope.projectList = setProjectList(projects);
                $scope.showmepmbutton=true;
                $scope.showmepobutton=true;
            });

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
                $scope.showmepmbutton=false;
            };
            $scope.clearmepm = function () {

                $scope.search.pmname = [];
                $scope.showmepmbutton=true;
            };
            $scope.showmepo = function () {

                $scope.search.poname = [$scope.user.name];
                $scope.showmepobutton=false;
            };
            $scope.clearmepo = function () {

                $scope.search.poname = [];
                $scope.showmepobutton=true;
            };

            function setProjectList(projects) {

                return projects.map(function (project) {

                    project.buname = project.bu.name;
                    project.poname = project.po.name;
                    project.pmname = project.pm.name;
                    project.warn = "";
                    // set last status
                    project.lastStatus = project.statuses[project.statuses.length - 1];
                    project.lastStatusFlag = project.lastStatus.status;

                    var now = new Date();
                    var status = new Date(project.lastStatus.date);
                    if(Math.round((status.getTime()-now.getTime()) / (1000*60*60*24)) < -14){project.warn = "!";}
                    if(Math.round((status.getTime()-now.getTime()) / (1000*60*60*24)) < -30){project.warn = "!!";}
                    if(Math.round((status.getTime()-now.getTime()) / (1000*60*60*24)) < -45){project.warn = "!!!";}

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

 
if($scope.projectList != null){
    
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
            
            if(projects.state!='Closed') {
                    $scope.projectsseries.push(projects.title);
                    $scope.projectsdata.push([{
                        x: parseInt(projects.kpi1)*50+parseInt(projects.kpi2)*10+parseInt(projects.kpi3),
                        y: parseInt(projects.kpi6)*50+parseInt(projects.kpi5)*10+parseInt(projects.kpi4),
                        r: parseInt(projects.kpi2)*8
                    }]);
            }
        }
        $scope.onprojectsClick = function (points, evt) {
            console.log(points, evt);
          };
      
} else {
    $scope.projectsdata = [{x: "1", y: "2", r: "30"}];
}           
//TEST END     

        }
    ]);
