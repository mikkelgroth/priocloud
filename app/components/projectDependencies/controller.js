angular
    .module('riskApp')
    .controller('ProjectDependenciesController', [
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
            var depId = $routeParams.depid;

            userService
                .user
                .subscribe(function (user) {

                    $scope.user = user;
                });

            companyService
                .getProject(projectId)
                .subscribe(function (project) {
                    $scope.year = (new Date()).getFullYear();
                    $scope.project = project;
                    if (($scope.project.editUser != null && $scope.project.editUser.email == $scope.user.email)) {
                        $scope.user.changeContent = true;
                    } else {
                        $scope.user.changeContent = false;
                    }
                    showDep();
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

            userService
                .users
                .subscribe(function (users) {
                    $scope.sessionsusers = JSON.parse(JSON.stringify(users));
                    for (let i = 0; $scope.sessionsusers != null && i < $scope.sessionsusers.length; i++) {
                        const element = $scope.sessionsusers[i];
                        element.bu = {};
                    };
                });

            function editDep(dep) {
                if ($scope.company == undefined) {
                    $scope.company = companyService.company;
                }
                if (dep.rt != undefined && $scope.company.resourceTypes != undefined && $scope.company.resourceTypes.length > 0) {
                    let o = $scope.company.resourceTypes.find(x => x.rtuid === dep.rt.rtuid);
                    if (o != undefined) {
                        dep.rt = o;
                    }
                }
                $scope.editdep = dep;
                $('.popup').addClass('active');
                $scope.deleteThis = false;
            }

            $scope.beginEditDep = function (dep) {
                editDep(dep);
            };

            $scope.saveDeps = function () {
                if ($scope.user.changeContent) {
                    $scope.project.peoplequantumtotal = 0;
                    $scope.project.peopleestimatetotal = 0;
                    for (let i = 0; i < $scope.project.deps.length; i++) {
                        const e = $scope.project.deps[i];
                        $scope.project.peoplequantumtotal += Number(e.quantum);
                        $scope.project.peopleestimatetotal += Number(e.estimate);
                    }
                    $scope.project.peoplequantumtotal = $scope.project.peoplequantumtotal / 100;

                    companyService.saveProjectName($scope.project, $scope.user, true);
                    $scope.hasChanged = false;
                    $scope.deleteThis = false;
                    $('.popup').removeClass('active');
                }
            };

            $scope.saveNow = function (dep) {
                if ($scope.user.changeContent) {
                    dep.quantumint = dep.quantum * dep.rt.capacityintpercent / 100;
                    dep.quantumext = dep.quantum * dep.rt.capacityextpercent / 100;
                    var timeDiff = 0;
                    var depdays = 0;
                    var md = new Date($("#depdate")[0].value);
                    var dmd = new Date($("#depdeaddate")[0].value);
                    if (md instanceof Date && !isNaN(md.valueOf())) {
                        dep.depdate = md.toISOString();
                    }
                    if (dmd instanceof Date && !isNaN(dmd.valueOf())) {
                        dep.depdeaddate = dmd.toISOString();
                    }
                    if (md instanceof Date && !isNaN(md.valueOf()) && dmd instanceof Date && !isNaN(dmd.valueOf()) && md.valueOf() > dmd.valueOf()) {
                        dmd = md;
                        dep.depdeaddate = md.toISOString();
                        dep.rawdepdeaddate = $("#depdate")[0].value;
                        $("#depdeaddate")[0].value = $("#depdate")[0].value;

                        //console.log("depdeaddate: " + dep.depdeaddate + " rawdepdeaddate: " + $("#depdate")[0].value);
                    }
                    if (md instanceof Date && dmd instanceof Date) {
                        timeDiff = Math.abs(md.getTime() - dmd.getTime());
                        depdays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                        dep.estimate = Math.ceil(dep.quantum * depdays * Number($scope.company.daysaweek) * Number($scope.company.hoursaday) / 7 / 100);
                    }
                    dep.priceint = Math.ceil(depdays * dep.rt.intdayprice * dep.quantumint * $scope.company.daysaweek / 7 / 100 / 1000);
                    dep.priceext = Math.ceil(depdays * dep.rt.extdayprice * dep.quantumext * $scope.company.daysaweek / 7 / 100 / 1000);
                    dep.price = dep.priceint + dep.priceext;
                    $scope.editdep.requester = $scope.project.pm.name;
                    $scope.hasChanged = true;
                }
            };

            $scope.saveNowQuick = function () {
                if ($scope.user.changeContent) {
                    $scope.hasChanged = true;
                }
            };

            $scope.newDep = function () {
                if ($scope.user.changeContent) {
                    if ($scope.project.deps == null) {
                        $scope.project.deps = [];
                    }
                    $scope.project.deps.push({});
                    $scope.editdep = $scope.project.deps[$scope.project.deps.length - 1];
                    $scope.editdep._id = util.uuid();
                    $scope.editdep.status = 'Green';
                    $scope.editdep.title = 'NEW DEPENDENCY';
                    $scope.editdep.names = "";
                    $scope.editdep.showInReport = true;
                    $scope.editdep.depreciationtype = "Capex";
                    $scope.editdep.ledgercode = "";
                    $scope.editdep.quantum = 0;
                    $scope.editdep.delmap = 'None';
                    $scope.editdep.description = 'None';
                    $scope.editdep.depdate = (new Date()).toISOString();
                    $scope.editdep.rawdepdate = new Date();
                    $("#depdate")[0].value = new Date();
                    $scope.editdep.depdeaddate = (new Date()).toISOString();
                    $scope.editdep.rawdepdeaddate = new Date();
                    $("#depdeaddate")[0].value = new Date();
                    $scope.editdep.state = 'Requested';
                    $scope.editdep.requester = $scope.project.pm.name;
                    $scope.editdep.rt = $scope.company.resourceTypes[0];
                    $scope.editdep.estimate = 0;
                    $scope.editdep.priceint = 0;
                    $scope.editdep.priceext = 0;
                    $scope.editdep.price = 0;
                    $scope.editdep.description = "";
                    $scope.editdep.action = "";
                    $('.popup').addClass('active');
                    $scope.deleteThis = false;
                    $scope.saveNow($scope.editdep);
                }
            };

            $scope.newCloneDep = function (dep) {
                if ($scope.user.changeContent) {
                    $scope.editdep = angular.copy(dep);
                    $scope.project.deps.push($scope.editdep);
                    $scope.editdep._id = util.uuid();
                    $scope.editdep.title = 'NEW CLONE DEPENDENCY';
                    $('.popup').addClass('active');
                    $scope.deleteThis = false;
                    $scope.saveNow($scope.editdep);
                }
            };


            $scope.close = function () {
                $('.popup').removeClass('active');
                $scope.deleteThis = false;
            };
            $scope.delete = function () {
                if ($scope.user.changeContent) {
                    $scope.deleteThis = true;
                }
            };

            $scope.removeDep = function (dep) {
                if ($scope.user.changeContent) {
                    $scope.project.deps.splice($scope.project.deps.indexOf(dep), 1);
                    companyService.saveProjectName($scope.project, $scope.user.name);
                    $('.popup').removeClass('active');
                }
            };

            $scope.depbarRender = function (dep) {
                return util.depbarRender(dep);
            }

            function showDep() {
                if (depId) {
                    let p = $scope.project.deps.find(x => x._id === depId);
                    if (p != undefined) editDep(p);
                }
            }
        }
    ]);
