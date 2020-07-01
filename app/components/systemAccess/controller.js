angular
    .module('riskApp')
    .controller('SystemAccessController', [
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

            var systemId = $routeParams.id;
            var accessId = $routeParams.accessid;

            userService
                .user
                .subscribe(function (user) {

                    $scope.user = user;
                });

            companyService
                .getSystem(systemId)
                .subscribe(function (system) {
                    $scope.system = system;
                    if (($scope.system.editUser != null && $scope.system.editUser.email == $scope.user.email)) {
                        $scope.user.changeContent = true;
                    } else {
                        $scope.user.changeContent = false;
                    }
                    showAccess();
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

            companyService.systems.subscribe(function (systems) {
                $scope.systems = systems;
            });

            userService
                .users
                .subscribe(function (users) {
                    $scope.tempusers = JSON.parse(JSON.stringify(users));
                    for (let i = 0; $scope.tempusers != null && i < $scope.tempusers.length; i++) {
                        const element = $scope.tempusers[i];
                        element.bu = {};
                    };
                });

            function editAccess(access) {
                if ($scope.company == undefined) {
                    $scope.company = companyService.company;
                }
                if (access.rt != undefined && $scope.company.resourceTypes != undefined && $scope.company.resourceTypes.length > 0) {
                    let o = $scope.company.resourceTypes.find(x => x.rtuid === access.rt.rtuid);
                    if (o != undefined) {
                        access.rt = o;
                    }
                }
                $scope.editaccess = access;
                $('.popup').addClass('active');
                $scope.deleteThis = false;
            }

            $scope.beginEditAccess = function (access) {
                editAccess(access);
            };

// GENERICS START
            // CONTROL TEMPLATE START

            $scope.usecontroltemplate = function (temp, obj) {
                if (temp != undefined && temp != {}) {
                    obj.conacc = temp.conacc;
                    obj.controldescription = temp.controldescription;
                    obj.level = temp.level;
                    obj.freq = temp.freq;
                }
            };

            // CONTROL TEMPLATE END
            // COMMENTS START
            $scope.addcomment = function (obj) {
                if ($scope.user.changeContent) {
                    if (obj.commentslist == undefined) obj.commentslist = "";
                    obj.commentslist = (new Date().toDateString()) + " - " + $scope.user.name + " \n" + $scope.newcomment + "\n     -----*-oooooooo-*------\n" + obj.commentslist;
                    $scope.newcomment = "";
                }
            };
            $scope.clearcomment = function (obj) {
                if ($scope.user.changeContent) {
                    $scope.clearThis = true;
                }
            };

            $scope.confirmclearcomment = function (obj) {
                if ($scope.user.changeContent) {
                    obj.commentslist = "";
                    $scope.newcomment = "";
                    $scope.clearThis = false;
                    companyService.saveSystemName($scope.system, $scope.user.name);
                }
            };
            // COMMENTS END
            $scope.saveNow = function (obj) {
                if ($scope.user.changeContent) {
                    var l = new Date($("#lastdate")[0].value);
                    var n = new Date($("#nextdate")[0].value);
                    if (l instanceof Date && !isNaN(l.valueOf())) {
                        obj.lastdate = l.toISOString();
                    }
                    if (n instanceof Date && !isNaN(n.valueOf())) {
                        obj.nextdate = n.toISOString();
                    }
                    $scope.hasChanged = true;
                }
            };

            // GENERICS END



            $scope.saveAccesss = function () {
                if ($scope.user.changeContent) {
                    companyService.saveSystemName($scope.system, $scope.user, true);
                    $scope.hasChanged = false;
                    $scope.deleteThis = false;
                    $('.popup').removeClass('active');
                }
            };

           
            $scope.saveNowQuick = function () {
                if ($scope.user.changeContent) {
                    $scope.hasChanged = true;
                }
            };

            $scope.newAccess = function () {
                if ($scope.user.changeContent) {
                    if ($scope.system.accesss == null) {
                        $scope.system.accesss = [];
                    }
                    $scope.system.accesss.push({});
                    $scope.editaccess = $scope.system.accesss[$scope.system.accesss.length - 1];
                    $scope.editaccess._id = Math.random().toString(36).substr(2, 9);
                    $scope.editaccess.title = 'NEW ACCESS TYPE';
                    $scope.editaccess.showInReport = true;
                    $scope.editaccess.datacat = $scope.company.datacategories[0].name;
                    $scope.editaccess.primaryloginmethod = 'All access';
                    $scope.editaccess.twofactor = 'None';
                    $scope.editaccess.type = 'Guest (read)';
                    $scope.editaccess.status = 'Green';
                    
                    $('.popup').addClass('active');
                    $scope.deleteThis = false;
                    $scope.saveNow($scope.editaccess);
                }
            };

            $scope.newCloneAccess = function (access) {
                if ($scope.user.changeContent) {
                    $scope.editaccess = angular.copy(access);
                    $scope.system.accesss.push($scope.editaccess);
                    $scope.editaccess._id = Math.random().toString(36).substr(2, 9);
                    $scope.editaccess.title = 'NEW CLONE ACCESS';
                    $('.popup').addClass('active');
                    $scope.deleteThis = false;
                    $scope.saveNow($scope.editaccess);
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

            $scope.removeAccess = function (access) {
                if ($scope.user.changeContent) {
                    $scope.system.accesss.splice($scope.system.accesss.indexOf(access), 1);
                    companyService.saveSystemName($scope.system, $scope.user.name);
                    $('.popup').removeClass('active');
                }
            };

            function showAccess() {
                if (accessId) {
                    let p = $scope.system.accesss.find(x => x._id === accessId);
                    if (p != undefined) editAccess(p);
                }
            }
        }
    ]);
