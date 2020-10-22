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
            $scope.hasChanged = false;

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

            $scope.getobjective = function (objectiveID) {
                if (objectiveID != undefined) {
                    return util.getObjectByID(objectiveID,$scope.company.objectives);
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
                    return util.getObjectByOID(metricID,$scope.metrics);
                }
            }

            $scope.getLastValue = function (metricID) {
                if (metricID != undefined) {
                    let p = util.getObjectByOID(metricID,$scope.metrics);
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
                var lastmetric = util.getObjectByOID($scope.editkeyresult.metricID,$scope.metrics);
                var last = lastmetric.metricvalues[lastmetric.metricvalues.length - 1];
                if (lastmetric.operator == "high") {
                    $scope.editkeyresult.status = (Number($scope.editkeyresult.value) <= Number(last.value)) ? "Green" : "Red";
                } else {
                    $scope.editkeyresult.status = (Number($scope.editkeyresult.value) >= Number(last.value)) ? "Green" : "Red";
                }
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
