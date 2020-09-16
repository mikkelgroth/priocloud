angular
    .module('riskApp')
    .controller('MetricsController', [
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
            companyService.loadCompany();
            companyService.reloadCompany();
            companyService.reloadMetrics();
            companyService.reloadSystems();
            companyService.reloadProcesss();
            

            companyService.company.subscribe(function (company) {
                $scope.company = company;
            });

            companyService.projects.subscribe(function (projects) {
                $scope.projects = projects;
            });

            companyService.metrics.subscribe(function (metrics) {
                $scope.metrics = setMetricList(metrics);
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
            $scope.views = 'overview';
            $scope.showmepmbutton = true;
            $scope.showmeresbutton = true;
            $scope.metricsearch = qcopy($rootScope.rootfiltersMetrics);
            if ($scope.metricsearch == null) {
                $scope.metricsearch = {};
            }

            //clear all filters
            $scope.clearall = function () {
                $scope.metricsearch = {};
            }
            //use same as onuserchange
            $scope.saveSearch = function () {
                $rootScope.rootfiltersMetrics = qcopy($scope.metricsearch);
            }

            //Save filters to user
            $scope.saveFilters = function () {
                $scope.user.userfiltersMetrics = qcopy($rootScope.rootfiltersMetrics);
                userService.updateUser($scope.user);
            }

            $scope.showdefault = function () {
                $scope.metricsearch = [];
                if ($scope.user.userfiltersMetrics != null) {
                    $scope.metricsearch = qcopy($scope.user.userfiltersMetrics);
                }
            };

            function setMetricList(metrics) {
                var returnlist = metrics;
                for (let i = 0; i < returnlist.length; i++) {
                    const e = returnlist[i];
                    e['buname'] = e.bu.name;
                    e['pmname'] = e.pm.name;
                    e['poname'] = e.po.name;
                }
                return returnlist;
            }

            $scope.goToMetric = function (metricId) {
                $location.path('/metric/' + metricId);
            };

            $scope.showmepm = function () {
                $scope.metricsearch.ppm = [$scope.user.name];
                $scope.showmepmbutton = false;
            };
            $scope.clearmepm = function () {
                $scope.metricsearch.ppm = [];
                $scope.showmepmbutton = true;
            };
            $scope.showmeres = function () {
                $scope.metricsearch.acc = [$scope.user.name];
                $scope.showmeresbutton = false;
            };
            $scope.clearmeres = function () {
                $scope.metricsearch.acc = [];
                $scope.showmeresbutton = true;
            };
        }
    ]);
