angular
    .module('riskApp')
    .controller('MetricValuesController', [
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

            var metricId = $routeParams.id;
            var metricvalueId = $routeParams.metricvalueid;

            userService
                .user
                .subscribe(function (user) {

                    $scope.user = user;
                });

            companyService
                .getMetric(metricId)
                .subscribe(function (metric) {
                    $scope.metric = metric;
                    if (($scope.metric.editUser != null && $scope.metric.editUser.email == $scope.user.email)) {
                        $scope.user.changeContent = true;
                    } else {
                        $scope.user.changeContent = false;
                    }
                    showMetricvalue();
                });

            companyService
                .businessUnits
                .subscribe(function (units) {
                    $scope.bus = units;
                });

            companyService
                .systems
                .subscribe(function (systems) {
                    $scope.systems = systems;
                });

            companyService
                .company
                .subscribe(function (company) {
                    $scope.company = company;
                });

            companyService.metrics.subscribe(function (metrics) {
                $scope.metrics = metrics;
            });

            userService
                .users
                .subscribe(function (users) {
                    $scope.sessionsusers = JSON.parse(JSON.stringify(users));
                    for (let i = 0; $scope.sessionsusers != null && i < $scope.sessionsusers.length; i++) {
                        const element = $scope.sessionsusers[i];
                        element.bu = {};
                    };
                });
            // GUID factory
            //guid = newguid();
            function newguid() {
                let u = Date.now().toString(16) + Math.random().toString(16) + '0'.repeat(16);
                return [u.substr(0, 8), u.substr(8, 4), '4000-8' + u.substr(13, 3), u.substr(16, 12)].join('-');
            }


            function editMetricvalue(metricvalue) {
                if ($scope.company == undefined) {
                    $scope.company = companyService.company;
                }

                $scope.editmetricvalue = metricvalue;
                $('.popup').addClass('active');
                $scope.deleteThis = false;
            }

            $scope.beginEditMetricvalue = function (metricvalue) {
                editMetricvalue(metricvalue);
            };

            $scope.saveMetric = function (metric) {
                if ($scope.user.changeContent) {
                    if (isNaN(metric.greenvalue) || isNaN(metric.yellowvalue) || isNaN(metric.orangevalue)) {
                        console.log("This is not a number, try 123 or 1.23 or -123");
                    } else {
                        calcMetricvaluesTotals();
                        companyService.saveMetricName($scope.metric, $scope.user, true);
                        $scope.hasChanged = false;
                        $scope.deleteThis = false;
                        $('.popup').removeClass('active');
                    }
                }
            };

            $scope.saveMetricvalues = function () {
                if ($scope.user.changeContent) {
                    companyService.saveMetricName($scope.metric, $scope.user, true);
                    $scope.hasChanged = false;
                    $scope.deleteThis = false;
                    $('.popup').removeClass('active');
                }
            };

            $scope.saveNow = function (metricvalue) {
                if ($scope.user.changeContent) {
                    if (metricvalue.isNan) {
                        alert("This is not a number, try 123 or 1.23");
                    } else {
                        calcMetricvaluesTotals();
                    }
                    $scope.hasChanged = true;
                }
            };

            $scope.saveNowQuick = function () {
                if ($scope.user.changeContent) {
                    $scope.hasChanged = true;
                }
            };

            $scope.newMetricvalue = function () {
                if ($scope.user.changeContent) {
                    if ($scope.metric.metricvalues == null) {
                        $scope.metric.metricvalues = [];
                    }
                    $scope.metric.metricvalues.push({});
                    $scope.editmetricvalue = $scope.metric.metricvalues[$scope.metric.metricvalues.length - 1];
                    $scope.editmetricvalue._id = Math.random().toString(36).substr(2, 9);
                    $scope.editmetricvalue.date = (new Date()).toISOString();
                    $scope.editmetricvalue.showInReport = true;
                    $scope.editmetricvalue.status = 'Green';
                    $scope.editmetricvalue.value = 1;


                    $('.popup').addClass('active');
                    $scope.deleteThis = false;
                    $scope.saveNow($scope.editmetricvalue);
                }
            };

            calcMetricvaluesTotals = function () {
                var total = 0;
                for (let i = 0; i < $scope.metric.metricvalues.length; i++) {
                    const e = $scope.metric.metricvalues[i];
                    total += Number(e.value);
                    e.average = Math.round(total / (i + 1));
                    e.trendstatus = "Green";
                    if (i > 0) {
                        if ($scope.metric.operator == "high") {
                            e.trend = Math.round(100 * (Number($scope.metric.metricvalues[i].value) - Number($scope.metric.metricvalues[i - 1].value)) / Number($scope.metric.metricvalues[i - 1].value));
                        } else {
                            e.trend = Math.round(100 * (Number($scope.metric.metricvalues[i - 1].value) - Number($scope.metric.metricvalues[i].value)) / Number($scope.metric.metricvalues[i - 1].value));
                        }
                        if (e.trend < 0) e.trendstatus = "Red";
                    } else {
                        e.trend = 0;
                    }
                    e.status = "Red";
                    if (Number(e.trend) >= Number($scope.metric.orangevalue)) e.status = "Orange";
                    if (Number(e.trend) >= Number($scope.metric.yellowvalue)) e.status = "Yellow";
                    if (Number(e.trend) >= Number($scope.metric.greenvalue)) e.status = "Green";
                }
                $scope.metric.status = $scope.metric.metricvalues[$scope.metric.metricvalues.length-1].status;
                $scope.metric.trend = $scope.metric.metricvalues[$scope.metric.metricvalues.length-1].trend;
                $scope.metric.trendstatus = $scope.metric.metricvalues[$scope.metric.metricvalues.length-1].trendstatus;
                $scope.metric.average = $scope.metric.metricvalues[$scope.metric.metricvalues.length-1].average;
                $scope.metric.date = $scope.metric.metricvalues[$scope.metric.metricvalues.length-1].date;
                $scope.metric.value = $scope.metric.metricvalues[$scope.metric.metricvalues.length-1].value;
            }


            $scope.close = function () {
                $('.popup').removeClass('active');
                $scope.deleteThis = false;
            };
            $scope.delete = function () {
                if ($scope.user.changeContent) {
                    $scope.deleteThis = true;
                }
            };

            $scope.removeMetricvalue = function (metricvalue) {
                if ($scope.user.changeContent) {
                    $scope.metric.metricvalues.splice($scope.metric.metricvalues.indexOf(metricvalue), 1);
                    calcMetricvaluesTotals();
                    companyService.saveMetricName($scope.metric, $scope.user.name);
                    $('.popup').removeClass('active');
                }
            };

            function showMetricvalue() {
                if (metricvalueId) {
                    let p = $scope.metric.metricvalues.find(x => x._id === metricvalueId);
                    if (p != undefined) editMetricvalue(p);
                }
            }
        }
    ]);
