angular
    .module('riskApp')
    .controller('SystemsController', [
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
            companyService.reloadSystems();
            companyService.reloadProcesss();


            companyService.company.subscribe(function (company) {
                $scope.company = company;
            });

            companyService.projects.subscribe(function (projects) {
                $scope.projects = projects;
            });

            companyService.systems.subscribe(function (systems) {
                $scope.systems = setSystemList(systems);
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
            $scope.systemsearch = qcopy($rootScope.rootfiltersSystems);
            if ($scope.systemsearch == null) {
                $scope.systemsearch = {};
            }
            $scope.controllist = setControlList($scope.systems);

            //clear all filters
            $scope.clearall = function () {
                $scope.systemsearch = {};
            }
            //use same as onuserchange
            $scope.saveSearch = function () {
                $rootScope.rootfiltersSystems = qcopy($scope.systemsearch);
            }

            //Save filters to user
            $scope.saveFilters = function () {
                $scope.user.userfiltersSystems = qcopy($rootScope.rootfiltersSystems);
                userService.updateUser($scope.user);
            }

            $scope.showdefault = function () {
                $scope.systemsearch = [];
                if ($scope.user.userfiltersSystems != null) {
                    $scope.systemsearch = qcopy($scope.user.userfiltersSystems);
                }
            };

            function setSystemList(systems) {
                var returnlist = systems;
                for (let i = 0; i < returnlist.length; i++) {
                    const e = returnlist[i];
                    e['buname'] = e.bu.name;
                    e['pmname'] = e.pm.name;
                    e['poname'] = e.po.name;
                }
                return returnlist;
            }

            function setControlList(systems) {
                var clist = [];
                for (let i = 0; systems != undefined && i < systems.length; i++) {
                    const e = systems[i];
                    for (let a = 0; e.datas != undefined && a < e.datas.length; a++) {
                        const d = e.datas[a];
                        var control = {};
                        control.system = e.title;
                        control.status = e.statusFlag;
                        control.id = e._id.$oid;
                        control.area = "Data";
                        control.controltitle = d.title;
                        control.conresp = d.conresp;
                        control.conacc = d.conacc;
                        control.cstatus = d.status;
                        control.datacat = d.datacat.name;
                        control.freq = d.freq;
                        control.nextdate = d.nextdate;
                        control.lastdate = d.lastdate;
                        control.result = d.result;
                        control.purposerequired = d.datacat.purposerequired;
                        clist.push(control);
                    }
                    for (let a = 0; e.accesss != undefined && a < e.accesss.length; a++) {
                        const d = e.accesss[a];
                        var control = {};
                        control.system = e.title;
                        control.status = e.statusFlag;
                        control.id = e._id.$oid;
                        control.area = "Access";
                        control.controltitle = d.title;
                        control.conresp = d.conresp;
                        control.conacc = d.conacc;
                        control.cstatus = d.status;
                        control.datacat = d.datacat.name;
                        control.freq = d.freq;
                        control.nextdate = d.nextdate;
                        control.lastdate = d.lastdate;
                        control.result = d.result;
                        control.purposerequired = d.datacat.purposerequired;
                        clist.push(control);
                    }
                    for (let a = 0; e.connections != undefined && a < e.connections.length; a++) {
                        const d = e.connections[a];
                        var control = {};
                        control.system = e.title;
                        control.status = e.statusFlag;
                        control.id = e._id.$oid;
                        control.area = "Connection";
                        control.controltitle = d.title;
                        control.conresp = d.conresp;
                        control.conacc = d.conacc;
                        control.cstatus = d.status;
                        control.datacat = d.datacat.name;
                        control.freq = d.freq;
                        control.nextdate = d.nextdate;
                        control.lastdate = d.lastdate;
                        control.result = d.result;
                        control.purposerequired = d.datacat.purposerequired;
                        clist.push(control);
                    }
                    for (let a = 0; e.continuitys != undefined && a < e.continuitys.length; a++) {
                        const d = e.continuitys[a];
                        var control = {};
                        control.system = e.title;
                        control.status = e.statusFlag;
                        control.id = e._id.$oid;
                        control.area = "Continuity";
                        control.controltitle = d.title;
                        control.conresp = d.conresp;
                        control.conacc = d.conacc;
                        control.cstatus = d.status;
                        control.datacat = d.datacat.name;
                        control.freq = d.freq;
                        control.nextdate = d.nextdate;
                        control.lastdate = d.lastdate;
                        control.result = d.result;
                        control.purposerequired = d.datacat.purposerequired;
                        clist.push(control);
                    }
                    for (let a = 0; e.perimeters != undefined && a < e.perimeters.length; a++) {
                        const d = e.perimeters[a];
                        var control = {};
                        control.system = e.title;
                        control.status = e.statusFlag;
                        control.id = e._id.$oid;
                        control.area = "Perimeter";
                        control.controltitle = d.title;
                        control.conresp = d.conresp;
                        control.conacc = d.conacc;
                        control.cstatus = d.status;
                        control.datacat = "None";
                        control.freq = d.freq;
                        control.nextdate = d.nextdate;
                        control.lastdate = d.lastdate;
                        control.result = d.result;
                        control.purposerequired = "None";
                        clist.push(control);
                    }
                }
                return clist;
            }

            $scope.goToSystem = function (systemId) {
                $location.path('/system/' + systemId);
            };

            $scope.showmepm = function () {
                $scope.systemsearch.ppm = [$scope.user.name];
                $scope.showmepmbutton = false;
            };
            $scope.clearmepm = function () {
                $scope.systemsearch.ppm = [];
                $scope.showmepmbutton = true;
            };
            $scope.showmeres = function () {
                $scope.systemsearch.acc = [$scope.user.name];
                $scope.showmeresbutton = false;
            };
            $scope.clearmeres = function () {
                $scope.systemsearch.acc = [];
                $scope.showmeresbutton = true;
            };
        }
    ]);
