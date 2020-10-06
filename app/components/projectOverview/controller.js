angular
    .module('riskApp')
    .controller('ProjectOverviewController', [
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
            companyService.reloadMetrics();

            companyService
                .getProject(projectId)
                .subscribe(function (project) {

                    $scope.year = (new Date()).getFullYear();

                    $scope.project = project;
                    $scope.user.isOwner = ($scope.project.bu.owner != null && $scope.project.bu.owner.email != null && $scope.project.bu.owner.email == $scope.user.email)

                    if (($scope.project.pm != null && $scope.user.email == $scope.project.pm.email) ||
                        ($scope.project.po != null && $scope.user.email == $scope.project.po.email) ||
                        ($scope.project.altpo != null && $scope.user.email == $scope.project.altpo.email) ||
                        ($scope.project.altpm != null && $scope.user.email == $scope.project.altpm.email) ||
                        $scope.user.isOwner || ($scope.user.financecontroller && $scope.project.financecontroller != null && $scope.user.email == $scope.project.financecontroller.email) || $scope.user.subadmin || $scope.user.admin) {

                        if ($scope.project.editUser == null) {
                            $scope.project.showRelease = false;
                            $scope.user.changeContent = true;
                        } else if ($scope.project.editUser != null && ($scope.project.editUser.email == $scope.user.email || $scope.user.subadmin || $scope.user.admin)) {
                            $scope.project.showRelease = true;
                            $scope.user.changeContent = true;
                        } else {
                            $scope.project.showRelease = false;
                            $scope.user.changeContent = false;
                        }
                    } else {
                        $scope.user.changeContent = false;
                    }


                    if ($scope.project.statuses.length > 0) {

                        $scope.editstatus = angular.copy($scope.project.statuses[$scope.project.statuses.length - 1]);
                        $scope.saveStatusEnabled = true;
                        $scope.showfilters = false;
                    }
                });

            companyService
                .company
                .subscribe(function (company) {

                    $scope.company = company;
                });

            // Metrics utils START
            companyService.metrics.subscribe(function (metrics) {
                $scope.metrics = metrics;
            });

            $scope.setDeadlinestatus = function (d) {
                if (d != undefined) {
                    var da = new Date(Date.parse(d));
                    var today = new Date();
                    return (today < da) ? "Green" : "Red";
                }
            }

            $scope.getMetric = function (metricID) {
                if (metricID != undefined) {
                    return util.getObjectByOID(metricID, $scope.metrics);
                }
            }

            $scope.getLastValue = function (metricID) {
                if (metricID != undefined) {
                    let p = util.getObjectByOID(metricID, $scope.metrics);
                    if (p != undefined) {
                        return p.metricvalues[p.metricvalues.length - 1];
                    }
                }
            }

            // Metric utils END

            $scope.saveProject = function (project) {

                companyService.saveProjectName(project, $scope.user, true);
                $scope.hasChanged = false;
            };
            $scope.editProject = function (project) {
                project.editUser = $scope.user;
                $scope.project.showRelease = true;
                companyService.saveProjectOnLoad(project);
                $scope.hasChanged = false;
            };
            $scope.releaseProject = function (project) {
                project.editUser = null;
                $scope.project.showRelease = false;
                companyService.saveProjectOnLoad(project);
                $scope.hasChanged = true;
                //$location.path('/');
            };

            $scope.saveNow = function (project) {

                $scope.hasChanged = true;
            };
            //TEST Finance Chart Bar
            $scope.finlabels = ['Q1', 'Q2', 'Q3', 'Q4'];
            $scope.finseries = ['Budget', 'Posted', 'Deviation'];
            $scope.finoptions = {
                responsive: false,
                legend: {
                    verticalAlign: "top",
                    horizontalAlign: "right",
                    display: true

                }
            };


            if ($scope.project != null && $scope.project.finance != null) {
                $scope.findata =
                    [
                        [$scope.project.finance.budTotalq1, $scope.project.finance.budTotalq2, $scope.project.finance.budTotalq3, $scope.project.finance.budTotalq4],
                        [$scope.project.finance.postTotalq1, $scope.project.finance.postTotalq2, $scope.project.finance.postTotalq3, $scope.project.finance.postTotalq4],
                        [$scope.project.finance.devTotalq1, $scope.project.finance.devTotalq2, $scope.project.finance.devTotalq3, $scope.project.finance.devTotalq4]
                    ];
            } else {
                $scope.findata =
                    [
                        [0, 0, 0, 0],
                        [0, 0, 0, 0],
                        [0, 0, 0, 0]
                    ];
            }
            //TEST END     

            //TEST Risk bubble graph
            $scope.risklabels = [];
            $scope.riskoptions = {
                responsive: false,
                legend: {
                    verticalAlign: "top",
                    horizontalAlign: "right",
                    display: true

                }
            };


            if ($scope.project != null && $scope.project.risks != null) {

                $scope.riskseries = [];
                $scope.riskdata = [];
                $scope.riskoptions = {

                    legend: {
                        display: true,
                        position: 'right'
                    },
                    tooltips: true,
                    scales: {
                        xAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: 'Probability'
                            },
                            display: true,
                            ticks: {
                                max: 300,
                                min: 0,
                                stepSize: 100
                            }
                        }],
                        yAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: 'Impact'
                            },
                            display: true,
                            ticks: {
                                max: 300,
                                min: 0,
                                stepSize: 100
                            }
                        }]
                    }
                };
                var risk;
                for (var i = 0; i < $scope.project.risks.length; i++) {
                    risk = $scope.project.risks[i];
                    var statusvalue = (risk.status == 'Yellow') ? 2 : (risk.status == 'Orange') ? 4 : (risk.status == 'Red') ? 6 : 0;

                    if ((risk.showInReport && risk.type == 'Risk' && risk.state != 'Closed') &&
                        (risk.audience != 'Confidential' || (risk.audience == 'Confidential' &&
                            ($scope.user.email == $scope.project.po.email || $scope.user.email == $scope.project.pm.email || $scope.user.isOwner || $scope.user.admin) &&
                            $scope.project.showconfrisk == 'true'))) {
                        $scope.riskseries.push(risk.title);
                        $scope.riskdata.push([{
                            x: parseInt(risk.prob) * 50 + parseInt(risk.impact) * 10 + parseInt(risk.recCompValue) + statusvalue,
                            y: parseInt(risk.impact) * 50 + parseInt(risk.recCompValue) * 10 + parseInt(risk.prob) + statusvalue,
                            r: parseInt(risk.recCompValue) * 8 + statusvalue
                        }]);
                    }
                }
                $scope.onRiskClick = function (points, evt) {
                    console.log(points, evt);
                };

            } else {
                $scope.riskdata = [{ x: "1", y: "2", r: "30" }];
            }
            //TEST END     



            // This code is also in Status controller

            $scope.goToKeyresultInProject = function (keyresult) {
                $location.path('/project/' + projectId + '/keyresults/' + keyresult._id);
            };

            $scope.goToRiskInProject = function (risk) {
                $location.path('/project/' + projectId + '/risks/' + risk._id);
            };

            $scope.goToActionInProject = function (action) {
                $location.path('/project/' + projectId + '/status/' + action._id);
            };


            $scope.goToMilestoneInProject = function (milestone) {
                $location.path('/project/' + projectId + '/milestone/' + milestone._id);
            };

            $scope.goToDepInProject = function (dep) {
                $location.path('/project/' + projectId + '/dependencies/' + dep._id);
            };

            $scope.barRender = function (mile) {
                return util.barRender(mile);
            }

            $scope.depbarRender = function (dep) {
                return util.depbarRender(dep);
            }
        }
    ]);
