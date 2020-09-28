angular
    .module('riskApp')
    .controller('SystemDataController', [
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
            var dataId = $routeParams.dataid;
            $scope.newcomment = "";

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
                    showData();
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

            evalassessment();

            function evalassessment() {
                if ($scope.editdata != undefined) {
                    $scope.editdata.okassesment = true;
                    $scope.editdata.makeassessment = false;
                    if ($scope.editdata.assessQ1 == undefined ||
                        $scope.editdata.assessQ2 == undefined ||
                        $scope.editdata.assessQ3 == undefined ||
                        $scope.editdata.assessQ4 == undefined ||
                        $scope.editdata.assessQ5 == undefined ||
                        $scope.editdata.assessQ6 == undefined ||
                        $scope.editdata.assessQ7 == undefined) {
                        $scope.editdata.makeassessment = true;
                    } else {
                        if ($scope.editdata.assessQ1 == 'no' ||
                            $scope.editdata.assessQ1 == 'no' ||
                            $scope.editdata.assessQ2 == 'no' ||
                            $scope.editdata.assessQ3 == 'no' ||
                            $scope.editdata.assessQ4 == 'no' ||
                            $scope.editdata.assessQ5 == 'no' ||
                            $scope.editdata.assessQ6 == 'no' ||
                            $scope.editdata.assessQ7 == 'no') {
                            $scope.editdata.okassesment = false;
                        }
                    }
                }
            }

            $scope.systemsaveNow = function () {
                evalassessment();
                if ($scope.user.changeContent) {
                    var l = new Date($("#systemlastdate")[0].value);
                    var n = new Date($("#systemnextdate")[0].value);
                    if (l instanceof Date && !isNaN(l.valueOf())) {
                        $scope.system.lastdate = l.toISOString();
                    }
                    if (n instanceof Date && !isNaN(n.valueOf())) {
                        $scope.system.nextdate = n.toISOString();
                    }
                    $scope.hasChanged = true;
                }
                $scope.hasChanged = true;

            };


            function editData(data) {
                if ($scope.company == undefined) {
                    $scope.company = companyService.company;
                }
                if (data.rt != undefined && $scope.company.resourceTypes != undefined && $scope.company.resourceTypes.length > 0) {
                    let o = $scope.company.resourceTypes.find(x => x.rtuid === data.rt.rtuid);
                    if (o != undefined) {
                        data.rt = o;
                    }
                }
                $scope.editdata = data;
                if ($scope.editdata != undefined && $scope.editdata.deletionprocedure == "Not defined") {
                    $("#deletionwarning").addClass("Red");
                }
                $('.popup').addClass('active');
                $scope.deleteThis = false;
            }

            $scope.beginEditData = function (data) {
                editData(data);
            };

            $scope.saveDatas = function () {
                if ($scope.user.changeContent) {
                    companyService.saveSystemName($scope.system, $scope.user, true);
                    $scope.hasChanged = false;
                    $scope.deleteThis = false;
                    $('.popup').removeClass('active');
                }
            };

            $scope.saveNow = function (obj) {
                if ($scope.editdata != undefined && $scope.editdata.deletionprocedure == "Not defined") {
                    $("#deletionwarning").addClass("Red");
                } else {
                    $("#deletionwarning").removeClass("Red");
                }
                evalassessment();
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


            $scope.saveNowQuick = function () {
                if ($scope.user.changeContent) {
                    $scope.hasChanged = true;
                }
            };

            $scope.newData = function () {
                if ($scope.user.changeContent) {
                    if ($scope.system.datas == null) {
                        $scope.system.datas = [];
                    }
                    $scope.system.datas.push({});
                    $scope.editdata = $scope.system.datas[$scope.system.datas.length - 1];
                    $scope.editdata._id = util.uuid()
                    $scope.editdata.title = 'NEW DATA';
                    $scope.editdata.showInReport = true;
                    $scope.editdata.datacat = $scope.company.datacategories[0].name;
                    $scope.editdata.status = 'Green';

                    $('.popup').addClass('active');
                    $scope.deleteThis = false;
                    $scope.saveNow($scope.editdata);
                }
            };

            $scope.newCloneData = function (data) {
                if ($scope.user.changeContent) {
                    $scope.editdata = angular.copy(data);
                    $scope.system.datas.push($scope.editdata);
                    $scope.editdata._id = util.uuid()
                    $scope.editdata.title = 'NEW CLONE DATA';
                    $('.popup').addClass('active');
                    $scope.deleteThis = false;
                    $scope.saveNow($scope.editdata);
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

            $scope.removeData = function (data) {
                if ($scope.user.changeContent) {
                    $scope.system.datas.splice($scope.system.datas.indexOf(data), 1);
                    companyService.saveSystemName($scope.system, $scope.user.name);
                    $('.popup').removeClass('active');
                }
            };

            function showData() {
                if (dataId) {
                    let p = $scope.system.datas.find(x => x._id === dataId);
                    if (p != undefined) editData(p);
                }
            }

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
                    if (lable == "Data") {
                        $('.popuplink').addClass('active');
                    }
                    if (lable == "xxx") {

                    }
                }
            };

            $scope.editlinkitem = function (c) {
                if (c.linkuid == undefined) {
                    c.linkuid = util.uuid();
                }
                $scope.editlink = c;
                if (c.lable == "Data") {
                    $('.popuplink').addClass('active');
                }
                if (c.lable == "xxx") {

                }
            };

            $scope.dellink = function (c) {
                if ($scope.user.changeContent) {
                    $scope.system.linklist.splice($scope.system.linklist.indexOf(c), 1);
                    companyService.saveSystemName($scope.system, $scope.user, true);
                    $scope.editlink = {};
                    if (c.lable == "xxx") {

                    }
                    if (c.lable == "Data") {
                        $('.popuplink').removeClass('active');
                    }
                    $scope.hasChanged = false;
                }
            };
            // END LINK ENGINE

            // GENERICS END


        }
    ]);
