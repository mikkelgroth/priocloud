angular
    .module('riskApp')
    .controller('SystemDetailsController', [
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

            // GUID factory
            //guid = newguid();
            function newguid() {
                let u = Date.now().toString(16) + Math.random().toString(16) + '0'.repeat(16);
                return [u.substr(0, 8), u.substr(8, 4), '4000-8' + u.substr(13, 3), u.substr(16, 12)].join('-');
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
                    n.linkuid = newguid();

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
                    c.linkuid = newguid();
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
                    var prio = 0;
                    var level = 0;
                    var enabler = 0;
                    var exposure = 0;
                    prio += Number($scope.system.priority.charAt(0));
                    level += Number($scope.system.datasecuritylevel.charAt(0));
                    enabler += Number($scope.system.valuestreammagnitude.charAt(0));
                    exposure += Number($scope.system.externalexposure.charAt(0));
                    $scope.system.risklevel = Math.round((prio * level * enabler * exposure) * 100 / (5 * 5 * 4 * 4));

                    $scope.hasChanged = true;
                }
                $scope.hasChanged = true;

            };
            // GENERICS START
           
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
