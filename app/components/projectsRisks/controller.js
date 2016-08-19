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

            companyService.projects.subscribe(function (projects) {

                $scope.projects = projects;
                $scope.riskList = setRiskList(projects);
            });

            companyService.businessUnits.subscribe(function (units) {

                $scope.bus = units;
            });

            userService.users.subscribe(function (users) {

                $scope.users = users;
            });

            $scope.goToRiskInProject = function (projectId) {

                console.log("goto: /project/" + projectId + "/risks");

                $location.path('/project/' + projectId + '/risks');
            };

            function setRiskList(projects) {

                var risks = [];
                risks = risks.concat.apply([], projects.map(function (project) {

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
                        risk['pkpi1'] = project.kpi1;
                        risk['pkpi2'] = project.kpi2;
                        risk['pkpi3'] = project.kpi3;
                        risk['pkpi4'] = project.kpi4;
                        risk['pkpi5'] = project.kpi5;
                        risk['pkpi6'] = project.kpi6;
                        risk['ptotal'] = project.total;
                        risk['ab'] = project.statuses[project.statuses.length - 1].ab;
                        risk['EtC'] = project.statuses[project.statuses.length - 1].EtC;
                        risk['fte'] = project.statuses[project.statuses.length - 1].fte;

                        return risk;
                    });
                }));
                
                return risks;
            }
        }
    ]);
