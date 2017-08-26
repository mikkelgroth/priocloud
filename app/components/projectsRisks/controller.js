angular
    .module('riskApp')
    .controller('ProjectsRisksController', [
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
            $scope.risksearch=[];
            $scope.risksearch.acname=[];
            
            companyService
                .company
                .subscribe(function (company) {

                    $scope.company = company;
                });

            companyService.projects.subscribe(function (projects) {

                $scope.projects = projects;
                $scope.riskList = setRiskList(projects);
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
                $scope.risksearch.acname=[$scope.user.name];
            });

            $scope.goToRiskInProject = function (riskId, projectId) {

                $location.path('/project/' + projectId + '/risks/' + riskId);
            };

            function setRiskList(projects) {

                var risks = [];
                risks = risks.concat.apply([], projects.map(function (project) {

                    if (!project.risks)
                        return [];

                    return project.risks.map(function (risk) {

                        risk['projectid'] = project._id.$oid;
                        risk['projecttitle'] = project.title;
                        risk['acname'] = (risk.acc != null) ? risk.acc.name : 'TBD';
                        risk['wtotal'] = Math.round(project.total * risk.prob * 25 * risk.impact * 25 / 1000);
                        risk['pitotal'] = Math.round(risk.prob * 25 * risk.impact * 25 / 100);
                        risk['wtotalprob'] = Math.round(project.total * risk.prob * 25 / 100);
                        risk['wtotalimpact'] = Math.round(project.total * risk.impact * 25 / 100);
                        risk['projectstate'] = project.state;
                        risk['projectoid'] = project._id.$oid;
                        risk['buname'] = project.bu.name;
                        risk['support'] = project.support;
                        risk['pkpi1'] = project.kpi1;
                        risk['pkpi2'] = project.kpi2;
                        risk['pkpi3'] = project.kpi3;
                        risk['pkpi4'] = project.kpi4;
                        risk['pkpi5'] = project.kpi5;
                        risk['pkpi6'] = project.kpi6;
                        risk['ptotal'] = project.total;
                        

                        return risk;
                    });
                }));
                
                return risks;
            }
        }
    ]);
