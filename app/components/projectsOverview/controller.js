angular
    .module('riskApp')
    .controller('ProjectsOverviewController', [
        '$scope',
        '$rootScope',
        '$routeParams',
        '$location',
        'userService',
        'companyService',
        'util',
        function (
            $scope,
            $rootScope,
            $routeParams,
            $location,
            userService,
            companyService,
            util
        ) {
            companyService.loadCompany();
            companyService.reloadCompany();
            companyService.reloadSystems();
            companyService.reloadProcesss();

            companyService.company.subscribe(function (company) {
                $scope.company = company;
            });

            companyService.projects.subscribe(function (projects) {
                $scope.projectList = setProjectList(projects);
            });

            companyService.businessUnits.subscribe(function (units) {
                $scope.bus = units;
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
            $scope.showmepobutton = true;
            $scope.showmeownerbutton = true;

            $scope.quickbuname = ($rootScope.rootfiltersProjectsOverviewQuickbu) ? $rootScope.rootfiltersProjectsOverviewQuickbu : "";

            $scope.porderparam = ($rootScope.rootfiltersOrderporderparam) ? $rootScope.rootfiltersOrderporderparam : "priority";
            $scope.porderparam2 = ($rootScope.rootfiltersOrderporderparam2) ? $rootScope.rootfiltersOrderporderparam2 : "-enablervalue";
            $scope.porderparam3 = ($rootScope.rootfiltersOrderporderparam3) ? $rootScope.rootfiltersOrderporderparam3 : "limitervalue";

            if ($scope.searchParams == undefined) {
                $scope.searchParams = [];
            }



            $scope.views = 'overview';
            $scope.showcon = false;
            $scope.showconfi = false;
            if (!$rootScope.firstlogin) {
                //console.log("$rootScope.firstlogin: " + $rootScope.firstlogin);
                $rootScope.firstlogin = true;
                setTimeout(function () {
                    if ($scope.company.portfolios) {
                        $scope.showportbutton = false;
                        //console.log("Onload start!");
                        resetPort();
                    }
                }, 2000);
                setTimeout(function () {
                    if ($scope.company.portfolios) {
                        resetPort();
                    }
                }, 4000);
                resetPort();
            } else {
                $scope.showportbutton = $rootScope.rootfiltersProjectsOverviewshowportbutton;
                if (!$scope.showportbutton) {
                    resetPort();
                } else {
                    $scope.searchParams = qcopy($rootScope.rootfiltersProjectsOverview);
                }
            }

            quickbucall();
            calcfin();

            //clear all filters
            $scope.clearall = function () {
                $scope.searchParams = [];
                $scope.quickbuname = "";
                calcfin();
            }

            //Quick BU select
            function quickbucall() {

                if ($scope.quickbuname == "") {
                    $scope.searchParams.buname = [];
                } else {
                    $scope.searchParams.buname = [$scope.quickbuname];
                }

                $rootScope.rootfiltersProjectsOverview = qcopy($scope.searchParams);
                $rootScope.rootfiltersProjectsOverviewQuickbu = $scope.quickbuname;
                //console.log("quickbuname: " + $scope.quickbuname + " rootfiltersProjectsOverviewQuickbu: " + $rootScope.rootfiltersProjectsOverviewQuickbu);
                calcfin();
            }

            $scope.quickbu = function () {
                quickbucall();
            }

            $scope.orderchange = function () {
                $rootScope.rootfiltersOrderporderparam = $scope.porderparam;
                $rootScope.rootfiltersOrderporderparam2 = $scope.porderparam2;
                $rootScope.rootfiltersOrderporderparam3 = $scope.porderparam3;

                $rootScope.rootfiltersProjectsOverviewshowportbutton = true;
                $scope.showportbutton = $rootScope.rootfiltersProjectsOverviewshowportbutton;
                //console.log("$rootScope.rootfiltersOrderporderparam3: " + $rootScope.rootfiltersOrderporderparam3);
            }

            //use same as onuserchange
            $scope.saveSearch = function () {
                $scope.quickbuname = "";
                $rootScope.rootfiltersProjectsOverview = qcopy($scope.searchParams);
                $scope.showportbutton = true;
                //console.log("saveSearch -> $scope.user.userfiltersProjectsOverview == $rootScope.rootfiltersProjectsOverview -> " + ($scope.user.userfiltersProjectsOverview == $rootScope.rootfiltersProjectsOverview));
                calcfin();
            }

            //Save filters to user
            $scope.saveFilters = function () {
                $scope.user.userfiltersProjectsOverview = qcopy($rootScope.rootfiltersProjectsOverview);
                //console.log("saveFilters -> -> $scope.user.userfiltersProjectsOverview == $rootScope.rootfiltersProjectsOverview -> " + ($scope.user.userfiltersProjectsOverview == $rootScope.rootfiltersProjectsOverview));
                userService.updateUser($scope.user);
            }

            //on search change recalcfin types
            $scope.recalcfin = function () {
                calcfin();
            }

            $scope.goToProject = function (projectId) {
                $location.path('/project/' + projectId);
            };
            $scope.showdefault = function () {
                $scope.searchParams = [];
                if ($scope.user.userfiltersProjectsOverview != null) {
                    $scope.quickbuname = "";
                    $scope.searchParams = qcopy($scope.user.userfiltersProjectsOverview);
                    //console.log("showdefault -> user.filtersProjectsOverview == $rootScope.rootfiltersProjectsOverview -> " + ($scope.user.userfiltersProjectsOverview == $rootScope.rootfiltersProjectsOverview));
                }
                calcfin();
                $scope.showportbutton = true;
            };

            $scope.showport = function () {
                $rootScope.rootfiltersProjectsOverviewshowportbutton = false;
                $scope.quickbuname = "";
                resetPort();
            };

            function resetPort() {
                $scope.searchParams = [];
                if ($scope.company != undefined && $scope.company.portfolios != undefined) {
                    var tempports;
                    tempports = JSON.parse(JSON.stringify($scope.company.portfolios));
                    tempports.shift();
                    var tempportnames = [];
                    for (let i = 0; i < tempports.length; i++) {
                        tempportnames.push(tempports[i].name);
                    }
                    $scope.searchParams.portname = tempportnames;
                }
                $scope.searchParams.buname = [];
                $scope.searchParams.poname = [];
                $scope.searchParams.pmname = [];
                $scope.searchParams.lastStatusFlag = [];
                $scope.searchParams.state = ['Portfolio Approved', 'Company Approved', 'Progress'];
                $scope.searchParams.type = [];
                $scope.searchParams.connect = [];
                $scope.searchParams.priority = [];
                $scope.searchParams.financeFlag = [];
                $scope.searchParams.strategies = [];
                $scope.searchParams.enablerlable = [];
                $scope.searchParams.limiterlable = [];

                $scope.porderparam = $rootScope.rootfiltersOrderporderparam = "priority";
                $scope.porderparam2 = $rootScope.rootfiltersOrderporderparam2 = "-enablervalue";
                $scope.porderparam3 = $rootScope.rootfiltersOrderporderparam3 = "limitervalue";

                $scope.showportbutton = false;
                calcfin();

            }

            $scope.clearport = function () {
                $rootScope.rootfiltersProjectsOverviewshowportbutton = true;
                $scope.quickbuname = "";
                $scope.searchParams.buname = [];
                if ($scope.user.userfiltersProjectsOverview != null) {
                    $scope.searchParams = qcopy($scope.user.userfiltersProjectsOverview);
                } else if ($rootScope.rootfiltersProjectsOverview != null) {
                    $scope.searchParams = qcopy($rootScope.rootfiltersProjectsOverview);
                }
                else {
                    $scope.searchParams = [];
                }
                $scope.showportbutton = true;
                calcfin();
            };

            $scope.showmepm = function () {
                $scope.quickbuname = "";
                $scope.searchParams.buname = [];
                if ($scope.searchParams == null) $scope.searchParams = [];
                $scope.searchParams.pmname = [$scope.user.name];
                $scope.showmepmbutton = false;
                calcfin();
            };
            $scope.clearmepm = function () {
                $scope.quickbuname = "";
                $scope.searchParams.buname = [];
                $scope.searchParams.pmname = [];
                $scope.showmepmbutton = true;
                calcfin();
            };
            $scope.showmebuowner = function () {
                $scope.quickbuname = "";
                $scope.searchParams.buname = [];
                if ($scope.searchParams == null) $scope.searchParams = [];
                $scope.searchParams.projbuownername = [$scope.user.name];
                $scope.showmeownerbutton = false;
                calcfin();
            };
            $scope.clearmebuowner = function () {
                $scope.quickbuname = "";
                $scope.searchParams.buname = [];
                $scope.searchParams.projbuownername = [];
                $scope.showmeownerbutton = true;
                calcfin();
            };
            $scope.showmepo = function () {
                $scope.quickbuname = "";
                $scope.searchParams.buname = [];
                if ($scope.searchParams == null) $scope.searchParams = [];
                $scope.searchParams.poname = [$scope.user.name];
                $scope.showmepobutton = false;
                calcfin();
            };
            $scope.clearmepo = function () {
                $scope.quickbuname = "";
                $scope.searchParams.buname = [];
                $scope.searchParams.poname = [];
                $scope.showmepobutton = true;
                calcfin();
            };
            $scope.setControlled = function () {
                $scope.showcon = !$scope.showcon;
                calcfin();
            };
            $scope.setConfidential = function () {
                $scope.showconfi = !$scope.showconfi;
                calcfin();
            };
            $scope.setViewConfidential = function (element) {
                return setConfView(element);
            };
            function setConfView(element) {
                var viewconfidential = false;
                viewconfidential =
                    (element.bu.owner != null && element.bu.owner.email != null && element.bu.owner.email == $scope.user.email) ||
                    (element.pm != null && $scope.user.email == element.pm.email) ||
                    (element.po != null && $scope.user.email == element.po.email) ||
                    (element.altpo != null && $scope.user.email == element.altpo.email) ||
                    (element.altpm != null && $scope.user.email == element.altpm.email) ||
                    ($scope.user.financecontroller && element.financecontroller != null && $scope.user.email == element.financecontroller.email) ||
                    $scope.user.subadmin ||
                    $scope.user.admin;
                return viewconfidential;
            }

            $scope.depbarRender = function (dep) {
                return util.depbarRender(dep);
            }
            
            $scope.barRender = function (mi) {
                return util.barRender(mi);
            }
            

            function filterlist(items, filterData) {
                if (filterData == undefined) {
                    return items;
                }
                var keys = Object.keys(filterData);
                var filtered = [];
                var populate = true;
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    populate = true;
                    for (var j = 0; j < keys.length; j++) {
                        if (filterData[keys[j]] != undefined) {
                            if (keys[j] === "connect") {
                                if (filterData[keys[j]].length == 0 || doesListContain(filterData[keys[j]], item["connect"])) {
                                    populate = true;
                                } else {
                                    populate = false;
                                    break;
                                }
                            } else {
                                if (filterData[keys[j]].length == 0 || doesListContain(filterData[keys[j]], item[keys[j]])) {
                                    populate = true;
                                } else {
                                    populate = false;
                                    break;
                                }
                            }

                        }
                    }
                    if (populate) {
                        filtered.push(item);
                    }
                }

                function doesListContain(list, obj) {
                    var i = list.length;
                    while (i--) {
                        if (Array.isArray(obj)) {
                            var j = obj.length;
                            while (j--) {
                                if (list[i] === obj[j]) {
                                    return true;
                                }
                            }
                        } else {
                            if (list[i] === obj) {
                                return true;
                            }
                        }
                    }
                    return false;
                }
                return filtered;
            };

            function calcfin() {
                var projfiltered = filterlist($scope.projectList, $scope.searchParams);
                $scope.finsums = {};

                $scope.finsums.devTotalprev = 0;
                $scope.finsums.devTotalq1 = 0;
                $scope.finsums.devTotalq2 = 0;
                $scope.finsums.devTotalq3 = 0;
                $scope.finsums.devTotalq4 = 0;
                $scope.finsums.devTotalSum = 0;
                $scope.finsums.devTotalgrandSum = 0;

                $scope.finsums.budTotalprev = 0;
                $scope.finsums.budTotalq1 = 0;
                $scope.finsums.budTotalq2 = 0;
                $scope.finsums.budTotalq3 = 0;
                $scope.finsums.budTotalq4 = 0;
                $scope.finsums.budTotalSum = 0;
                $scope.finsums.budTotalgrandSum = 0;

                $scope.finsums.postTotalprev = 0;
                $scope.finsums.postTotalq1 = 0;
                $scope.finsums.postTotalq2 = 0;
                $scope.finsums.postTotalq3 = 0;
                $scope.finsums.postTotalq4 = 0;
                $scope.finsums.postTotalSum = 0;
                $scope.finsums.postTotalgrandSum = 0;

                var viewconfidential = false;

                for (let i = 0; i < projfiltered.length; i++) {
                    const element = projfiltered[i];

                    viewconfidential = setConfView(element);

                    if ((!$scope.showcon || (element.isControlled && $scope.showcon)) && (!element.isFinConf || (element.isFinConf && $scope.showconfi && viewconfidential))) {
                        if (element.finance != null && element.finance.devTotalprev != null) { $scope.finsums.devTotalprev += element.finance.devTotalprev; }
                        if (element.finance != null && element.finance.devTotalq1 != null) { $scope.finsums.devTotalq1 += element.finance.devTotalq1; }
                        if (element.finance != null && element.finance.devTotalq2 != null) { $scope.finsums.devTotalq2 += element.finance.devTotalq2; }
                        if (element.finance != null && element.finance.devTotalq3 != null) { $scope.finsums.devTotalq3 += element.finance.devTotalq3; }
                        if (element.finance != null && element.finance.devTotalq4 != null) { $scope.finsums.devTotalq4 += element.finance.devTotalq4; }
                        if (element.finance != null && element.finance.devTotalSum != null) { $scope.finsums.devTotalSum += element.finance.devTotalSum; }
                        if (element.finance != null && element.finance.devTotalfutureSum != null) { $scope.finsums.devTotalfutureSum += element.finance.devTotalfutureSum; }
                        if (element.finance != null && element.finance.devTotalgrandSum != null) { $scope.finsums.devTotalgrandSum += element.finance.devTotalgrandSum; }

                        if (element.finance != null && element.finance.budTotalprev != null) { $scope.finsums.budTotalprev += element.finance.budTotalprev; }
                        if (element.finance != null && element.finance.budTotalq1 != null) { $scope.finsums.budTotalq1 += element.finance.budTotalq1; }
                        if (element.finance != null && element.finance.budTotalq2 != null) { $scope.finsums.budTotalq2 += element.finance.budTotalq2; }
                        if (element.finance != null && element.finance.budTotalq3 != null) { $scope.finsums.budTotalq3 += element.finance.budTotalq3; }
                        if (element.finance != null && element.finance.budTotalq4 != null) { $scope.finsums.budTotalq4 += element.finance.budTotalq4; }
                        if (element.finance != null && element.finance.budTotalSum != null) { $scope.finsums.budTotalSum += element.finance.budTotalSum; }
                        if (element.finance != null && element.finance.budTotalfutureSum != null) { $scope.finsums.budTotalfutureSum += element.finance.budTotalfutureSum; }
                        if (element.finance != null && element.finance.budTotalgrandSum != null) { $scope.finsums.budTotalgrandSum += element.finance.budTotalgrandSum; }

                        if (element.finance != null && element.finance.postTotalprev != null) { $scope.finsums.postTotalprev += element.finance.postTotalprev; }
                        if (element.finance != null && element.finance.postTotalq1 != null) { $scope.finsums.postTotalq1 += element.finance.postTotalq1; }
                        if (element.finance != null && element.finance.postTotalq2 != null) { $scope.finsums.postTotalq2 += element.finance.postTotalq2; }
                        if (element.finance != null && element.finance.postTotalq3 != null) { $scope.finsums.postTotalq3 += element.finance.postTotalq3; }
                        if (element.finance != null && element.finance.postTotalq4 != null) { $scope.finsums.postTotalq4 += element.finance.postTotalq4; }
                        if (element.finance != null && element.finance.postTotalSum != null) { $scope.finsums.postTotalSum += element.finance.postTotalSum; }
                        if (element.finance != null && element.finance.postTotalfutureSum != null) { $scope.finsums.postTotalfutureSum += element.finance.postTotalfutureSum; }
                        if (element.finance != null && element.finance.postTotalgrandSum != null) { $scope.finsums.postTotalgrandSum += element.finance.postTotalgrandSum; }
                    }
                }

            };

            function setProjectList(projects) {
                return projects.map(function (project) {

                    project.buname = project.bu.name;
                    project.pmname = project.pm.name;
                    project.poname = project.po.name;
                    project.enablerlable = (project.milestones[0] != undefined) ? project.milestones[0].enablerlable : "XS";
                    project.enablervalue = (project.milestones[0] != undefined) ? project.milestones[0].enablervalue : 0;
                    project.limiterlable = (project.milestones[0] != undefined) ? project.milestones[0].limiterlable : "XL";
                    project.limitervalue = (project.milestones[0] != undefined) ? project.milestones[0].limitervalue : 16;
                    project.wsjf = (project.milestones[0] != undefined) ? project.milestones[0].wsjf : 0;
                    project.numestimate = (project.milestones[0] != undefined) ? project.milestones[0].numestimate : 0;

                    project.projbuownername = "";
                    if (project.bu != undefined && project.bu.owner != undefined) project.projbuownername = project.bu.owner.name;

                    project.portname = '';
                    if (project.support != undefined) project.portname = project.support.name;
                    project.startdate = project.milestones[0].date;
                    if (project.creationdate == undefined) {
                        project.creationdate = project.milestones[0].date;
                    }



                    $scope.year = (new Date()).getFullYear();



                    project.warn = "";
                    // set last status
                    project.lastStatus = project.statuses[project.statuses.length - 1];
                    project.lastStatusFlag = project.lastStatus.status;
                    project.financeFlag = project.financeControl;

                    // set baseline values and flags
                    project.baselinestate = project.state;
                    project.baselinepriority = project.priority;
                    project.baselineenddate = project.milestones[0].enddate;
                    project.baselinepeopleexternal = project.finance.costdeptotalexternalttotal;
                    project.baselinegrandtotal = project.finance.budTotalgrandSum;

                    if (project.finance.baselines != undefined && project.finance.baselines[project.finance.baselines.length - 1] != undefined) {
                        project.baselinestate = project.finance.baselines[project.finance.baselines.length - 1].state;
                        project.baselinepriority = project.finance.baselines[project.finance.baselines.length - 1].priority;
                        project.baselineenddate = project.finance.baselines[project.finance.baselines.length - 1].enddate;
                        project.baselinepeopleexternal = project.finance.baselines[project.finance.baselines.length - 1].peopleexternal;
                        project.baselinegrandtotal = project.finance.baselines[project.finance.baselines.length - 1].grandtotal;
                    }

                    (project.baselinepriority == project.priority) ? project.baselinepriorityFLAG = "Green" : project.baselinepriorityFLAG = "Yellow";
                    (project.baselineenddate == project.milestones[0].enddate) ? project.baselineenddateFLAG = "Green" : project.baselineenddateFLAG = "Yellow";

                    project.baselinepeopleexternalDIV = 0;
                    if (project.baselinepeopleexternal != 0 && project.finance.costdeptotalexternalttotal != undefined) {
                        project.baselinepeopleexternalDIV = (project.baselinepeopleexternal - project.finance.costdeptotalexternalttotal) * 100 / project.baselinepeopleexternal;
                    }

                    project.baselinegrandtotalDIV = 0;
                    if (project.baselinegrandtotal != 0 && project.finance.budTotalgrandSum != undefined) {
                        project.baselinegrandtotalDIV = (project.baselinegrandtotal - project.finance.budTotalgrandSum) * 100 / project.baselinegrandtotal;
                    }

                    project.baselinepeopleexternalFLAG = "Green";
                    if (project.baselinepeopleexternalDIV < -10) project.baselinepeopleexternalFLAG = "Yellow";
                    if (project.baselinepeopleexternalDIV < -20) project.baselinepeopleexternalFLAG = "Orange";
                    if (project.baselinepeopleexternalDIV < -50) project.baselinepeopleexternalFLAG = "Red";

                    project.baselinegrandtotalFLAG = "Green";
                    if (project.baselinegrandtotalDIV < -10) project.baselinegrandtotalFLAG = "Yellow";
                    if (project.baselinegrandtotalDIV < -20) project.baselinegrandtotalFLAG = "Orange";
                    if (project.baselinegrandtotalDIV < -50) project.baselinegrandtotalFLAG = "Red";


                    var now = new Date();
                    var status = new Date(project.lastStatus.date);
                    if (Math.round((status.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) < -14) { project.warn = "!"; }
                    if (Math.round((status.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) < -30) { project.warn = "!!"; }
                    if (Math.round((status.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) < -45) { project.warn = "!!!"; }


                    project.allocatedflag = "Red";
                    project.allocatedstring = "";
                    var allocateddeps = 0;
                    var currentdeps = 0;
                    var currentdate = new Date();
                    for (let i = 0; project.deps != undefined && i < project.deps.length; i++) {
                        const e = project.deps[i];
                        //console.log("e.depdate " + e.depdate + " cuurentdate " + currentdate);
                        if (new Date(e.rawdepdate) <= currentdate && currentdate <= new Date(e.rawdepdeaddate)) {
                            currentdeps += 1;
                            if (e.state == "Allocated") {
                                allocateddeps += 1;
                            }
                        }
                    }
                    if (currentdeps == allocateddeps) {
                        project.allocatedflag = "Green";
                    }
                    project.allocatedstring = "" + allocateddeps + " / " + currentdeps;

                    return project;
                });
            }

        }
    ]);
