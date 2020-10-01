angular
    .module('riskApp')
    .controller('ProjectKeyresultsController', [
        '$scope',
        '$routeParams',
        '$location',
        'userService',
        'companyService',
        'util',
        function (
            $scope,
            $routeParams,
            $location,
            userService,
            companyService,
            util
        ) {
            var projectId = $routeParams.id;
            var keyresultId = $routeParams.krid;
            companyService.reloadMetrics();

            companyService
                .getProject(projectId)
                .subscribe(function (project) {
                    $scope.project = project;
                    showKeyresult();
                });

            userService
                .user
                .subscribe(function (user) {
                    $scope.user = user;
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

            companyService.metrics.subscribe(function (metrics) {
                $scope.metrics = metrics;
            });

            $scope.views = 'objective';

            userService
                .users
                .subscribe(function (users) {
                    $scope.sessionsusers = JSON.parse(JSON.stringify(users));
                    for (let i = 0; $scope.sessionsusers != null && i < $scope.sessionsusers.length; i++) {
                        const element = $scope.sessionsusers[i];
                        element.bu = {};
                    };
                });


            function editKeyresult(keyresult) {
                if ($scope.company == undefined) {
                    $scope.company = companyService.company;
                }
                $scope.editkeyresult = keyresult;
                $('.popup').addClass('active');
                $scope.deleteThis = false;
            }

            $scope.beginEditKeyresult = function (keyresult) {
                editKeyresult(keyresult);
            };

            function getobjectiveByID(objectiveID) {
                let p = $scope.company.objectives.find(x => x._id === objectiveID);
                if (p != undefined) {
                    return p;
                } else {
                    console.log("Found no Objective with this ID: " + objectiveID);
                }
            }
            $scope.getobjective = function (objectiveID) {
                if (objectiveID != undefined) {
                    return getobjectiveByID(objectiveID);
                }
            }


            function getMetricByID(metricID) {
                let p = $scope.metrics.find(x => x._id.$oid === metricID);
                if (p != undefined) {
                    return p;
                } else {
                    console.log("Found no Metric with this ID: " + metricID);
                }
            }

            $scope.setDeadlinestatus = function (d) {
                if (d != undefined) {
                    var da = new Date(Date.parse(d));
                    var today = new Date();
                    return (today < da)?"Green":"Red";
                }
            }

            $scope.getMetric = function (metricID) {
                if (metricID != undefined) {
                    return getMetricByID(metricID);
                }
            }

            $scope.getLastValue = function (metricID) {
                if (metricID != undefined) {
                    let p = getMetricByID(metricID);
                    if (p != undefined) {
                        return p.metricvalues[p.metricvalues.length - 1];
                    }
                }
            }

            $scope.saveKeyresults = function () {
                if ($scope.user.changeContent) {
                    companyService.saveProjectName($scope.project, $scope.user, true);

                    $scope.hasChanged = false;
                    $scope.deleteThis = false;
                    $('.popup').removeClass('active');
                }
            };

            function showKeyresult() {
                if (keyresultId) {
                    var keyresult = $scope.project.keyresults.filter(function (keyresult) {
                        return keyresult._id === keyresultId;
                    });
                    if (keyresult[0]) {
                        editKeyresult(keyresult[0]);
                    }
                }
            }

            $scope.saveNowObjective = function () {
                if ($scope.user.changeContent) {
                    $scope.hasChanged = true;
                }
            };

            $scope.saveNow = function (keyresult) {
                if ($scope.user.changeContent) {

                    var dd = new Date(Date.parse($("#krdate")[0].value));
                    if (dd instanceof Date && !isNaN(dd.valueOf())) {
                        keyresult.krdate = dd.toISOString();
                    }

                    if (keyresult.value.isNan) {
                        alert("This is not a number, try 123 or 1.23");
                    } else {
                        calcKeyresult();
                    }

                    $scope.hasChanged = true;
                }
            };

            $scope.saveNowQuick = function () {
                if ($scope.user.changeContent) {
                    $scope.hasChanged = true;
                }
            };

            $scope.newKeyresult = function () {
                if ($scope.user.changeContent) {
                    var today = new Date();
                    if ($scope.project.keyresults == null) {
                        $scope.project.keyresults = [];
                    }
                    $scope.project.keyresults.push({});
                    $scope.editkeyresult = $scope.project.keyresults[$scope.project.keyresults.length - 1];
                    $scope.editkeyresult._id = util.uuid();
                    $scope.editkeyresult.krdate = today.toISOString();
                    $scope.editkeyresult.metricID = $scope.metrics[0]._id.$oid;
                    $scope.editkeyresult.rawkrdate = today;
                    $scope.editkeyresult.showInReport = true;
                    $scope.editkeyresult.value = 1;


                    $('.popup').addClass('active');
                    $scope.deleteThis = false;
                    $scope.saveNow($scope.editkeyresult);
                }
            };

            calcKeyresult = function () {
                var lastmetric = getMetricByID($scope.editkeyresult.metricID);
                var last = lastmetric.metricvalues[lastmetric.metricvalues.length - 1];
                if (lastmetric.operator == "high") {
                    $scope.editkeyresult.status = (Number($scope.editkeyresult.value) <= Number(last.value)) ? "Green" : "Red";
                } else {
                    $scope.editkeyresult.status = (Number($scope.editkeyresult.value) >= Number(last.value)) ? "Green" : "Red";
                }


                /*
                var total = 0;
                for (let i = 0; i < $scope.metric.keyresults.length; i++) {
                    const e = $scope.metric.keyresults[i];
                    total += Number(e.value);
                    e.average = Math.round(total / (i + 1));
                    e.trendstatus = "Green";
                    if (i > 0) {
                        if ($scope.metric.operator == "high") {
                            e.trend = Math.round(100 * (Number($scope.metric.keyresults[i].value) - Number($scope.metric.keyresults[i - 1].value)) / Number($scope.metric.keyresults[i - 1].value));
                        } else {
                            e.trend = Math.round(100 * (Number($scope.metric.keyresults[i - 1].value) - Number($scope.metric.keyresults[i].value)) / Number($scope.metric.keyresults[i - 1].value));
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
                $scope.metric.status = $scope.metric.keyresults[$scope.metric.keyresults.length - 1].status;
                $scope.metric.trend = $scope.metric.keyresults[$scope.metric.keyresults.length - 1].trend;
                $scope.metric.trendstatus = $scope.metric.keyresults[$scope.metric.keyresults.length - 1].trendstatus;
                $scope.metric.average = $scope.metric.keyresults[$scope.metric.keyresults.length - 1].average;
                $scope.metric.date = $scope.metric.keyresults[$scope.metric.keyresults.length - 1].date;
                $scope.metric.value = $scope.metric.keyresults[$scope.metric.keyresults.length - 1].value;
                */
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

            $scope.removeKeyresult = function (keyresult) {
                if ($scope.user.changeContent) {
                    $scope.project.keyresults.splice($scope.project.keyresults.indexOf(keyresult), 1);
                    companyService.saveProjectName($scope.project, $scope.user, true);
                    $('.popup').removeClass('active');
                }
            };

        }
    ]);
