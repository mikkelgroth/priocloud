angular
    .module('riskApp')
    .controller('ProjectsDeliverablesController', [
        '$scope',
        '$rootScope',
        '$location',
        'userService',
        'companyService',
        'util',
        function (
            $scope,
            $rootScope,
            $location,
            userService,
            companyService,
            util
        ) {

            companyService.company.subscribe(function (company) {
                $scope.company = company;
            });

            companyService.projects.subscribe(function (projects) {
                $scope.projects = projects;
                $scope.milestoneList = setMilestoneList(projects);
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

            $scope.year = (new Date()).getFullYear();
            $scope.showmepmbutton = true;
            $scope.showmeresbutton = true;
            $scope.showmeapbutton = true;

            $scope.milesearch = qcopy($rootScope.rootfiltersDeliverables);
            if ($scope.milesearch == null) {
                $scope.milesearch = {};
            }

            //clear all filters
            $scope.clearall = function () {
                $scope.milesearch = {};
            }

            //use same as onuserchange
            $scope.saveSearch = function () {
                $rootScope.rootfiltersDeliverables = qcopy($scope.milesearch);
            }

            //Save filters to user
            $scope.saveFilters = function () {
                $scope.user.userfiltersDeliverables = qcopy($rootScope.rootfiltersDeliverables);
                userService.updateUser($scope.user);
            }

            $scope.showdefault = function () {
                $scope.milesearch = [];
                if ($scope.user.userfiltersDeliverables != null) {
                    $scope.milesearch = qcopy($scope.user.userfiltersDeliverables);
                }
            };

            $scope.goToMilestoneInProject = function (milestoneId, projectId) {
                $location.path('/project/' + projectId + '/milestone/' + milestoneId);
            };

            $scope.showmepm = function () {
                $scope.milesearch.ppm = [$scope.user.name];
                $scope.showmepmbutton = false;
            };
            $scope.clearmepm = function () {
                $scope.milesearch.ppm = [];
                $scope.showmepmbutton = true;
            };
            $scope.showmeres = function () {
                $scope.milesearch.responsible = [$scope.user.name];
                $scope.showmeresbutton = false;
            };
            $scope.clearmeres = function () {
                $scope.milesearch.responsible = [];
                $scope.showmeresbutton = true;
            };
            $scope.showmeap = function () {
                $scope.milesearch.acountable = [$scope.user.name];
                $scope.showmeapbutton = false;
            };
            $scope.clearmeap = function () {
                $scope.milesearch.acountable = [];
                $scope.showmeapbutton = true;
            };

            $scope.barRender = function (mile) {
                return util.barRender(mile);
            }

            function setMilestoneList(projects) {
                var milestones = [];
                milestones = milestones.concat.apply([], projects.map(function (project) {
                    if (!project.milestones) {
                        return [];
                    }
                    return project.milestones.map(function (milestone) {
                        project.portname = '';
                        if (project.support != null) milestone['pportname'] = project.support.name;


                        milestone['projectid'] = project._id.$oid;
                        milestone['projectoid'] = project._id.$oid;
                        milestone['projecttitle'] = project.title;
                        milestone['pbuname'] = project.bu.name;
                        milestone['pstate'] = project.state;
                        milestone['ppm'] = project.pm;
                        milestone['pconnect'] = project.connect;
                        milestone['ppriority'] = project.priority;

                        return milestone;
                    });
                }));
                return milestones;
            }
        }
    ]);
