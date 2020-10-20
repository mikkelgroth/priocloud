angular
    .module('riskApp')
    .controller('MetricsController', [
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
                $scope.keyresultList = setKeyresultsList(projects);
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

            // Metrics utils START

            $scope.setDeadlinestatus = function (d) {
                if (d != undefined) {
                    var da = new Date(Date.parse(d));
                    var today = new Date();
                    return (today < da) ? "Green" : "Red";
                }
            }

            function getMetric(ID) {
                if (ID != undefined) {
                    return util.getObjectByOID(ID, $scope.metrics);
                }
            }
            $scope.getMetric = function (metricID) {
                return getMetric(metricID);
            }
            function getLastValue(ID) {
                if (ID != undefined) {
                    let p = getMetric(ID);
                    if (p != undefined) {
                        return p.metricvalues[p.metricvalues.length - 1];
                    }
                }
            }
            $scope.getLastValue = function (metricID) {
                return getLastValue(metricID);
            }



            // Metric utils END


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

            function setKeyresultsList(projects) {
                var keyresults = [];
                keyresults = keyresults.concat.apply([], projects.map(function (project) {
                    if (!project.keyresults) {
                        return [];
                    }
                    return project.keyresults.map(function (keyresult) {
                        project.portname = '';
                        if (project.support != null) keyresult['pportname'] = project.support.name;
                        keyresult['projectid'] = project._id.$oid;
                        keyresult['projectoid'] = project._id.$oid;
                        keyresult['projecttitle'] = project.title;
                        keyresult['pbuname'] = project.bu.name;
                        keyresult['pstate'] = project.state;
                        keyresult['pstatus'] = project.lastStatusFlag;
                        keyresult['ppm'] = project.pm;
                        keyresult['pconnect'] = project.connect;
                        keyresult['ppriority'] = project.priority;
                        
                        var lastmetric = getMetric(keyresult.metricID);
                        var last = getLastValue(keyresult.metricID);
                        if (last != undefined && lastmetric != undefined) {

                            if (lastmetric.operator == "high") {
                                keyresult.tstatus = (Number(keyresult.value) <= Number(last.value)) ? "Green" : "Red";
                            } else {
                                keyresult.tstatus = (Number(keyresult.value) >= Number(last.value)) ? "Green" : "Red";
                            }
                        }
                        return keyresult;
                    });
                }));
                return keyresults;
            }

            $scope.goToKeyresultInProject = function (projectId, keyresultId) {
                $location.path('/project/' + projectId + '/keyresults/' + keyresultId);
            };

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
