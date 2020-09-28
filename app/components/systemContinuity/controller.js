angular
    .module('riskApp')
    .controller('SystemContinuityController', [
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
            var continuityId = $routeParams.continuityid;

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
                    showContinuity();
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
                    for (let i = 0; i < $scope.tempusers.length; i++) {
                        $scope.tempusers[i].bu = {};
                    }
                });

            function editContinuity(continuity) {
                if ($scope.company == undefined) {
                    $scope.company = companyService.company;
                }
                if (continuity.rt != undefined && $scope.company.resourceTypes != undefined && $scope.company.resourceTypes.length > 0) {
                    let o = $scope.company.resourceTypes.find(x => x.rtuid === continuity.rt.rtuid);
                    if (o != undefined) {
                        continuity.rt = o;
                    }
                }
                $scope.editcontinuity = continuity;
                $('.popup').addClass('active');
                $scope.deleteThis = false;
            }

            $scope.beginEditContinuity = function (continuity) {
                editContinuity(continuity);
            };

            
            //  Start LINK ENGINE

            $scope.closelink = function () {
                $('.popuplink').removeClass('active');
            };

            $scope.savelink = function (link) {
                if ($scope.user.changeContent) {
                    companyService.saveSystemName($scope.system, $scope.user, true);
                    $scope.editlink = {};
                    $('.popuplink').removeClass('active');
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
                    if (lable == "IT continuity") {
                        $('.popuplink').addClass('active');
                    }
                }
            };

            $scope.editlinkitem = function (c) {
                if (c.linkuid == undefined) {
                    c.linkuid = util.uuid();
                }
                $scope.editlink = c;
                if (c.lable == "IT continuity") {
                    $('.popuplink').addClass('active');
                }
            };

            $scope.dellink = function (c) {
                if ($scope.user.changeContent) {
                    $scope.system.linklist.splice($scope.system.linklist.indexOf(c), 1);
                    companyService.saveSystemName($scope.system, $scope.user, true);
                    $scope.editlink = {};
                    if (c.lable == "IT continuity") {
                        $('.popuplink').removeClass('active');
                    }
                    $scope.hasChanged = false;
                }
            };
            // END LINK ENGINE


            
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


            $scope.saveContinuitys = function () {
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

            $scope.newContinuity = function () {
                if ($scope.user.changeContent) {
                    if ($scope.system.continuitys == null) {
                        $scope.system.continuitys = [];
                    }
                    $scope.system.continuitys.push({});
                    $scope.editcontinuity = $scope.system.continuitys[$scope.system.continuitys.length - 1];
                    $scope.editcontinuity._id = util.uuid();
                    $scope.editcontinuity.title = 'NEW CONTINUITY PLAN';
                    $scope.editcontinuity.showInReport = true;
                    $scope.editcontinuity.datacat = $scope.company.datacategories[0].name;
                    $scope.editcontinuity.status = 'Green';
                    $scope.editcontinuity.type = 'System recovery';
                    $('.popup').addClass('active');
                    $scope.deleteThis = false;
                    $scope.saveNow($scope.editcontinuity);
                }
            };

            $scope.newCloneContinuity = function (continuity) {
                if ($scope.user.changeContent) {
                    $scope.editcontinuity = angular.copy(continuity);
                    $scope.system.continuitys.push($scope.editcontinuity);
                    $scope.editcontinuity._id = util.uuid();
                    $scope.editcontinuity.title = 'NEW CLONE CONTINUITY PLAN';
                    $('.popup').addClass('active');
                    $scope.deleteThis = false;
                    $scope.saveNow($scope.editcontinuity);
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

            $scope.removeContinuity = function (continuity) {
                if ($scope.user.changeContent) {
                    $scope.system.continuitys.splice($scope.system.continuitys.indexOf(continuity), 1);
                    companyService.saveSystemName($scope.system, $scope.user.name);
                    $('.popup').removeClass('active');
                }
            };

            function showContinuity() {
                if (continuityId) {
                    let p = $scope.system.continuitys.find(x => x._id === continuityId);
                    if (p != undefined) editContinuity(p);
                }
            }
        }
    ]);
