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
                    }
                    dep.priceint = Math.ceil(depdays * dep.rt.intdayprice * dep.quantumint / 100 * 60 / 100 / 1000); // 0,6 effective work day factor
                    dep.priceext = Math.ceil(depdays * dep.rt.extdayprice * dep.quantumext / 100 * 60 / 100 / 1000);
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
                    $scope.editdep.quantum = "0";
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
                return depbarRender(dep);
            }

            function showDep() {
                if (depId) {
                    let p = $scope.project.deps.find(x => x._id === depId);
                    if (p != undefined) editDep(p);
                }
            }

            //depBarRender START
            function depbarRender(dep) {

                var s = new Date(Date.parse(dep.depdate));
                var e = new Date(Date.parse(dep.depdeaddate));
                var start = 0;
                var end = 100;

                var thisyear = new Date();
                var base = new Date();
                var startbase = new Date();
                base.setFullYear(thisyear.getFullYear(), 0, 1);
                startbase.setFullYear(thisyear.getFullYear() - 1, 0, 1);

                var today = Math.round((((thisyear.getTime() - base.getTime()) / 86400000) * 33 / 365) + 33);
                var oneday = today + 1;

                //console.log("thisyear-1 = " + (thisyear.getFullYear()-1));

                if ((thisyear.getFullYear() - 1) == s.getFullYear() || thisyear.getFullYear() == s.getFullYear() || (thisyear.getFullYear() + 1) == s.getFullYear()) start = Math.round(((s.getTime() - startbase.getTime()) / 86400000) * 100 / (3 * 365));
                if ((thisyear.getFullYear() - 1) == e.getFullYear() || thisyear.getFullYear() == e.getFullYear() || (thisyear.getFullYear() + 1) == e.getFullYear()) end = Math.round(((e.getTime() - startbase.getTime()) / 86400000) * 100 / (3 * 365));
                if (start == end && end != 100) end = end + 1;
                if (start == 100) start--;
                //console.log("Start = " + start);
                //console.log("End = " + end);

                var colorbackground = "#f7f8f9";
                var color = "rgb(38,38,38)";
                var colorlevel = "rgb(0,176,240)";

                if (dep.state != undefined && dep.state != "") {
                    if (dep.state == "On hold") colorlevel = "rgba(243,54,49)";
                    if (dep.state == "Requested") colorlevel = "rgb(254,236,2)";
                    if (dep.state == "Allocated") colorlevel = "rgb(95,185,59)";
                }

                var ret = "#f6f1d3";
                if (start < end) {
                    if (today <= start) {
                        ret = "linear-gradient(to right, " + colorbackground + " " + today + "%, " + color + " " + today + "%, " + color + " " + oneday + "%, " + colorbackground + " " + oneday + "%, " + colorbackground + " " + start + "%, " + colorlevel + " " + start + "%, " + colorlevel + " " + end + "%, " + colorbackground + " " + end + "%)";
                    }
                    if (today > start && today <= end) {
                        ret = "linear-gradient(to right, " + colorbackground + " " + start + "%, " + colorlevel + " " + start + "%, " + colorlevel + " " + today + "%, " + color + " " + today + "%, " + color + " " + oneday + "%, " + colorlevel + " " + oneday + "%," + colorlevel + " " + end + "%, " + colorbackground + " " + end + "%)";
                    }
                    if (today > end) {
                        if (dep.state == "Open") color = "red";
                        ret = "linear-gradient(to right, " + colorbackground + " " + start + "%, " + colorlevel + " " + start + "%, " + colorlevel + " " + end + "%, " + colorbackground + " " + end + "%, " + colorbackground + " " + today + "%, " + color + " " + today + "%, " + color + " " + oneday + "%, " + colorbackground + " " + oneday + "%)";
                    }
                    if ((thisyear.getFullYear() - 1) > s.getFullYear() && (thisyear.getFullYear() - 1) > e.getFullYear()) {
                        var dist = Math.round(today / 4);
                        if (dep.state == "Open") color = "red";
                        ret = "linear-gradient(to right, " + colorlevel + " 0%, " + colorbackground + " " + dist + "%, " + colorbackground + " " + today + "%, " + color + " " + today + "%, " + color + " " + oneday + "%, " + colorbackground + " " + oneday + "%)";
                    }
                    if ((thisyear.getFullYear() + 1) < s.getFullYear() && (thisyear.getFullYear() + 1) < e.getFullYear()) {
                        var dist = 100 - Math.round((100 - today) / 4);
                        ret = "linear-gradient(to right, " + colorbackground + " " + today + "%, " + color + " " + today + "%, " + color + " " + oneday + "%, " + colorbackground + " " + oneday + "%, " + colorbackground + " " + dist + "%, " + colorlevel + " 100%)";
                    }
                }
                return { background: ret }
            }
            //depBarRender END
        }
    ]);
