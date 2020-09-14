angular
    .module('riskApp')
    .controller('AdminStrategiesController', [
        '$scope',
        '$location',
        'userService',
        'companyService',
        'restService',
        function (
            $scope,
            $location,
            userService,
            companyService,
            restService
        ) {
            companyService.reloadMetrics();

            userService
                .user
                .subscribe(function (user) {

                    $scope.user = user;
                });

            userService
                .users
                .subscribe(function (users) {
                    $scope.tempusers = JSON.parse(JSON.stringify(users));
                    for (let i = 0; i < $scope.tempusers.length; i++) {
                        $scope.tempusers[i].bu = {};
                    }
                });

            companyService
                .company
                .subscribe(function (company) {
                    $scope.company = company;
                });

            companyService
                .businessUnits
                .subscribe(function (units) {
                    $scope.bus = units;
                });

            companyService
                .metrics
                .subscribe(function (metrics) {
                    $scope.metrics = metrics;
                });

            $scope.views = 'strategyview';

            $scope.saveNow = function (control) {
            };
            // LOCK
            $scope.companyedit = false;
            if ($scope.company.locked && $scope.company.lockedby != undefined && $scope.company.lockedby != {} && $scope.company.lockedby.name == $scope.user.name) {
                $scope.companyedit = true;
            }
            // GUID factory
            //guid = newguid();
            function newguid() {
                let u = Date.now().toString(16) + Math.random().toString(16) + '0'.repeat(16);
                return [u.substr(0, 8), u.substr(8, 4), '4000-8' + u.substr(13, 3), u.substr(16, 12)].join('-');
            }

            $scope.close = function () {
                $('.popup').removeClass('active');
                $('.popupcontent').removeClass('active');
            };

            //Strategys START

            function editstrategy(strategy) {
                $scope.editstrategy = strategy;
                $('.popup').addClass('active');
            }

            $scope.beginEditStrategy = function (strategy) {
                editstrategy(strategy);
            };

            $scope.saveStrategy = function () {
                if ($scope.companyedit) {
                    companyService.saveCompany($scope.company);
                    $('.popup').removeClass('active');
                }
            };

            $scope.newStrategy = function () {
                if ($scope.companyedit) {
                    if ($scope.company.strategys == null) {
                        $scope.company.strategys = [];
                    }
                    $scope.company.strategys.push({});
                    $scope.editstrategy = $scope.company.strategys[$scope.company.strategys.length - 1];
                    $scope.editstrategy._id = Math.random().toString(36).substr(2, 9);
                    $scope.editstrategy.title = 'NEW strategy';
                    $('.popup').addClass('active');
                }
            };

            $scope.deleteStrategy = function (strategy) {
                if ($scope.companyedit) {
                    $scope.company.strategys.splice($scope.company.strategys.indexOf(strategy), 1);
                    companyService.saveCompany($scope.company);
                    $('.popup').removeClass('active');
                }
            };


            //strategys END

            //Objectives START
            function editobjective(objective) {
                $scope.editobjective = objective;
                $('.popup').addClass('active');
            }

            $scope.beginEditObjective = function (objective) {
                editobjective(objective);
            };

            $scope.saveObjective = function () {
                if ($scope.companyedit) {
                    companyService.saveCompany($scope.company);
                    $('.popup').removeClass('active');
                }
            };

            $scope.newObjective = function () {
                if ($scope.companyedit) {
                    if ($scope.company.objectives == null) {
                        $scope.company.objectives = [];
                    }
                    $scope.company.objectives.push({});
                    $scope.editobjective = $scope.company.objectives[$scope.company.objectives.length - 1];
                    $scope.editobjective._id = Math.random().toString(36).substr(2, 9);
                    $scope.editobjective.title = 'NEW objective';
                    $('.popup').addClass('active');
                }
            };

            $scope.deleteObjective = function (objective) {
                if ($scope.companyedit) {
                    $scope.company.objectives.splice($scope.company.objectives.indexOf(objective), 1);
                    companyService.saveCompany($scope.company);
                    $('.popup').removeClass('active');
                }
            };


            //objectives END

            //MetricValue value START

            function editMetricValue(metricvalue) {
                $scope.editmetricvalue = metricvalue;
                $('.popup').addClass('active');
            }

            $scope.beginEditMetricValue = function (metricvalue) {
                editMetricValue(metricvalue);
            };

            $scope.saveMetricValue = function () {
                if ($scope.companyedit) {
                    companyService.saveMetric(metric, $scope.user);
                    $('.popup').removeClass('active');
                }
            };


            $scope.newMetricValue = function () {
                if ($scope.companyedit) {
                    if ($scope.company.metricvalues == null) {
                        $scope.company.metricvalues = [];
                    }
                    $scope.company.metricvalues.push({});
                    $scope.editmetricvalue = $scope.company.metricvalues[$scope.company.metricvalues.length - 1];
                    $scope.editmetricvalue._id = Math.random().toString(36).substr(2, 9);
                    $scope.editmetricvalue.title = 'NEW METRICVALUE';
                    $('.popup').addClass('active');
                }
            };

            $scope.deleteMetricValue = function (metricvalue) {
                if ($scope.companyedit) {
                    $scope.company.metricvalues.splice($scope.company.metricvalues.indexOf(metricvalue), 1);
                    companyService.saveCompany($scope.company);
                    $('.popup').removeClass('active');
                }
            };
            //MetricValue END


            // Metric start
            $scope.newMetric = function () {

                var metric = {};

                /** Metric Details  */
                metric.creationdate = (new Date()).toISOString();
                metric.title = "NEW METRIC";
                metric.bu = $scope.bus[0];
                metric.format = "Points"
                metric.metricvalues = [];

                $scope.np = metric;

                $('.popup').addClass('active');
            };

            $scope.editMetric = function (metric) {
                $scope.np = metric;
                $('.popup').addClass('active');
            };

            $scope.gotoMetric = function (metric) {
                $location.path('/metric/' + metric._id.$oid + '/details')
            };

            $scope.saveMetric = function (metric) {
                companyService.saveMetric(metric, $scope.user);
                $('.popup').removeClass('active');
            };
            $scope.deleteMetric = function (metric) {
                companyService.deleteMetric(metric);
                $('.popup').removeClass('active');
            };
            //Metric END





        }
    ]);
