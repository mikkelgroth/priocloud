angular
    .module('riskApp')
    .controller('ProjectDetailsController', [
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


                    if ($scope.project.statuses.length > 0) {

                        $scope.editstatus = angular.copy($scope.project.statuses[$scope.project.statuses.length - 1]);
                        $scope.saveStatusEnabled = $scope.editstatus.statusstate != "Final";
                
                        
                    }
                    if(project.startdate==null || project.enddate==null){
                        var start = (new Date()).toISOString();
                        var end = new Date();
                        end.setFullYear(end.getFullYear()+1);

                        $scope.project.startdate = start;
                        $scope.project.enddate = end;
                        $scope.project.rawstartdate = $("#projdate")[0].value;
                        $scope.project.rawenddate = $("#projenddate")[0].value;
                    }
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

            $scope.saveProject = function (project) {

                var ed = new Date();
                if (ed instanceof Date && !isNaN(ed.valueOf())) {
                    $scope.editstatus.date = ed;
                }
                $scope.project.statuses[$scope.project.statuses.length - 1] = $scope.editstatus;
                companyService.saveProjectName(project, $scope.user, true);
                $scope.hasChanged=false;
            };

            $scope.saveNow = function (project) {
                
                $scope.hasChanged=true; 
                
                var md = new Date($("#projdate")[0].value);
                if (md instanceof Date && !isNaN(md.valueOf())) { 
                    $scope.project.milestones[0].date = md.toISOString(); 
                }

                var med = new Date($("#projenddate")[0].value);
                if (med instanceof Date && !isNaN(med.valueOf())) { 
                    $scope.project.milestones[0].enddate = med.toISOString(); 
                }
                if (md instanceof Date && !isNaN(md.valueOf()) && med instanceof Date && !isNaN(med.valueOf()) && md.valueOf()>med.valueOf()) { 
                    $scope.project.milestones[0].enddate = md.toISOString();
                    $scope.project.milestones[0].rawenddate = $("#projdate")[0].value;
                    
                }

                $scope.project.kpi1Graph = ($scope.company.projkpi1Neg == "High")?Number($scope.project.kpi1):100-Number($scope.project.kpi1);
                $scope.project.kpi2Graph = ($scope.company.projkpi2Neg == "High")?Number($scope.project.kpi2):100-Number($scope.project.kpi2);
                $scope.project.kpi3Graph = ($scope.company.projkpi3Neg == "High")?Number($scope.project.kpi3):100-Number($scope.project.kpi3);
                $scope.project.kpi4Graph = ($scope.company.projkpi4Neg == "High")?Number($scope.project.kpi4):100-Number($scope.project.kpi4);
                $scope.project.kpi5Graph = ($scope.company.projkpi5Neg == "High")?Number($scope.project.kpi5):100-Number($scope.project.kpi5);
                $scope.project.kpi6Graph = ($scope.company.projkpi6Neg == "High")?Number($scope.project.kpi6):100-Number($scope.project.kpi6);

                $scope.radarkpidata = [[$scope.project.kpi1Graph, $scope.project.kpi2Graph, $scope.project.kpi3Graph, $scope.project.kpi4Graph, $scope.project.kpi5Graph, $scope.project.kpi6Graph]];
                
                var t = 
                parseInt($scope.project.kpi1Graph) +
                parseInt($scope.project.kpi2Graph) +
                parseInt($scope.project.kpi3Graph) +
                parseInt($scope.project.kpi4Graph) +
                parseInt($scope.project.kpi5Graph) +
                parseInt($scope.project.kpi6Graph);

            if(t==0){
                $scope.project.total = 0
                
            }else{
                $scope.project.total = Math.round(t/6);
            }
               
            };

            //radar stuff
            $scope.radarkpilabels =[$scope.company.projkpi1lable, $scope.company.projkpi2lable, $scope.company.projkpi3lable, $scope.company.projkpi4lable, $scope.company.projkpi5lable, $scope.company.projkpi6lable];
            
            $scope.radarkpidata = [[$scope.project.kpi1Graph, $scope.project.kpi2Graph, $scope.project.kpi3Graph, $scope.project.kpi4Graph, $scope.project.kpi5Graph, $scope.project.kpi6Graph]];
            
            $scope.radarkpioptions = {
                responsive: false,
                maintainAspectRatio: false,
                scale: {
                    ticks: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            };
            
        }
    ]);
