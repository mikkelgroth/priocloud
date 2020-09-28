angular
    .module('riskApp')
    .controller('SystemDPIAController', [
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

            var systemId = $routeParams.id;

            userService
                .user
                .subscribe(function (user) {

                    $scope.user = user;
                });

            companyService
                .getSystem(systemId)
                .subscribe(function (system) {
                    $scope.system = system;
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
                    $scope.tempusers = JSON.parse(JSON.stringify(users));
                    for (let i = 0; i < $scope.tempusers.length; i++) {
                        $scope.tempusers[i].bu = {};
                    }
                });

            if (($scope.system.editUser != null && $scope.system.editUser.email == $scope.user.email)) {
                $scope.user.changeContent = true;
            } else {
                $scope.user.changeContent = false;
            }
            if ($scope.system.dpiaobj == undefined) $scope.system.dpiaobj = {};

            evaldpia();

            function evaldpia() {
                $scope.system.dpiafulldpia = false;
                $scope.system.dpiamakedpia = false;
                if ($scope.system.dpiaq1 == undefined ||
                    $scope.system.dpiaq2 == undefined ||
                    $scope.system.dpiaq3 == undefined ||
                    $scope.system.dpiaq4 == undefined) {
                    $scope.system.dpiamakedpia = true;
                } else {
                    if ($scope.system.dpiaq1 == 'yes' || $scope.system.dpiaq2 == 'yes' || $scope.system.dpiaq3 == 'yes' || $scope.system.dpiaq4 == 'yes') {
                        $scope.system.dpiafulldpia = true;
                    }
                }
            }

            //  Start LINK ENGINE

            $scope.closelink = function () {
                $('.popup').removeClass('active');
            };

            $scope.savelink = function (link) {
                if ($scope.user.changeContent) {
                    companyService.saveSystemName($scope.system, $scope.user, true);
                    $scope.editlink = {};
                    $('.popup').removeClass('active');
                    $scope.hasChanged = false;
                }
            };

            $scope.addlink = function (lable) {
                if ($scope.user.changeContent) {
                    if ($scope.system.linklist == null) $scope.system.linklist = [];
                    var n = {};
                    n.linkuid = util.uuid();

                    n.lable = lable;
                    n.showinreport = true;

                    $scope.system.linklist.push(n);
                    companyService.saveSystemName($scope.system, $scope.user, true);

                    $scope.editlink = n;
                    $('.popup').addClass('active');
                }
            };

            $scope.editlinkitem = function (c) {
                if (c.linkuid == undefined) {
                    c.linkuid = util.uuid();
                }
                $scope.editlink = c;
                $('.popup').addClass('active');
            };

            $scope.dellink = function (c) {
                if ($scope.user.changeContent) {
                    $scope.system.linklist.splice($scope.system.linklist.indexOf(c), 1);
                    companyService.saveSystemName($scope.system, $scope.user, true);
                    $scope.editlink = {};
                    $('.popup').removeClass('active');
                    $scope.hasChanged = false;
                }
            };
            // END LINK ENGINE

            $scope.saveSystem = function () {
                if ($scope.user.changeContent) {
                    $scope.system.statusdate = new Date();
                    companyService.saveSystemName($scope.system, $scope.user, true);
                    $scope.hasChanged = false;
                    $scope.statehasChanged = false;
                }
            };

            $scope.statechange = function () {
                $scope.statehasChanged = true;
            }

            $scope.saveNow = function () {
                if ($scope.user.changeContent) {
                    evaldpia();

                    var l = new Date($("#systemlastdate")[0].value);
                    var n = new Date($("#systemnextdate")[0].value);
                    if (l instanceof Date && !isNaN(l.valueOf())) {
                        $scope.system.dpialastdate = l.toISOString();
                    }
                    if (n instanceof Date && !isNaN(n.valueOf())) {
                        $scope.system.dpianextdate = n.toISOString();
                    }
                    $scope.hasChanged = true;
                }
            };
            // GENERICS START
            // CONTROL TEMPLATE START

            $scope.usecontroltemplate = function (temp, obj) {
                if (temp != undefined && temp != {}) {
                    obj.dpiaconacc = temp.conacc;
                    obj.dpiacontroldescription = temp.controldescription;
                    obj.dpialevel = temp.level;
                    obj.dpiafreq = temp.freq;
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
            // GENERICS END
        }
    ]);
