angular
    .module('riskApp')
    .controller('ProjectsRisksController', [
        '$scope',
        '$rootScope',
        '$location',
        'userService',
        'companyService',
        function (
            $scope,
            $rootScope,
            $location,
            userService,
            companyService
        ) {

            companyService.company.subscribe(function (company) {
                $scope.company = company;
            });

            companyService.projects.subscribe(function (projects) {
                $scope.projects = projects;
                $scope.riskList = setRiskList(projects);
            });

            companyService.businessUnits.subscribe(function (units) {
                $scope.bus = units;
            });

            userService.user.subscribe(function (user) {
                $scope.user = user;
            });

            userService.users.subscribe(function (users) {
                $scope.users = users;
            });

            // copy objects
            //const target = qcopy(source);
            function qcopy(src) {
                return Object.assign({}, src);
            }

            $scope.showmepmbutton = true;
            $scope.showmeresbutton = true;
            $scope.risksearch = qcopy($rootScope.rootfiltersRisks);
            if ($scope.risksearch == null) {
                $scope.risksearch = {};
            }

            //clear all filters
            $scope.clearall = function () {
                $scope.risksearch = {};
            }
            //use same as onuserchange
            $scope.saveSearch = function () {
                $rootScope.rootfiltersRisks = qcopy($scope.risksearch);
            }

            //Save filters to user
            $scope.saveFilters = function () {
                $scope.user.userfiltersRisks = qcopy($rootScope.rootfiltersRisks);
                userService.updateUser($scope.user);
            }

            $scope.showdefault = function () {
                $scope.risksearch = [];
                if ($scope.user.userfiltersRisks != null) {
                    $scope.risksearch = qcopy($scope.user.userfiltersRisks);
                }
            };


            $scope.goToRiskInProject = function (riskId, projectId) {
                $location.path('/project/' + projectId + '/risks/' + riskId);
            };

            $scope.showmepm = function () {
                $scope.risksearch.ppm = [$scope.user.name];
                $scope.showmepmbutton = false;
            };
            $scope.clearmepm = function () {
                $scope.risksearch.ppm = [];
                $scope.showmepmbutton = true;
            };
            $scope.showmeres = function () {
                $scope.risksearch.acc = [$scope.user.name];
                $scope.showmeresbutton = false;
            };
            $scope.clearmeres = function () {
                $scope.risksearch.acc = [];
                $scope.showmeresbutton = true;
            };

            function setRiskList(projects) {
                var risks = [];
                risks = risks.concat.apply([], projects.map(function (project) {

                    if (!project.risks)
                        return [];

                    return project.risks.map(function (risk) {

                        project.portname = '';
                        if (project.support != null) risk['pportname'] = project.support.name;

                        risk['projectid'] = project._id.$oid;
                        risk['projecttitle'] = project.title;
                        risk['wtotal'] = Math.round(project.milestones[0].wsjf * risk.prob * 25 * risk.impact * 25 * risk.recCompValue * 25  / 1000000);
                        risk['pitotal'] = Math.round(risk.prob * 25 * risk.impact * 25 / 100);
                        risk['wtotalprob'] = Math.round(project.milestones[0].wsjf * risk.prob * 25 / 100);
                        risk['wtotalimpact'] = Math.round(project.milestones[0].wsjf * risk.impact * 25 / 100);
                        risk['projectstate'] = project.state;
                        risk['projecttype'] = project.type;
                        risk['projectoid'] = project._id.$oid;
                        risk['pbuname'] = project.bu.name;
                        risk['support'] = project.support;
                        risk['pstate'] = project.state;
                        risk['ppm'] = project.pm;
                        risk['pconnect'] = project.connect;
                        risk['ppriority'] = project.priority;

                        return risk;
                    });
                }));

                return risks;
            }
        }
    ]);
