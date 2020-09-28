angular
    .module('riskApp')
    .controller('SystemPerimeterController', [
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
            var perimeterId = $routeParams.perimeterid;

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
                    showPerimeter();
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

            // GENERICS START
            // CONTROL TEMPLATE START

            $scope.usecontroltemplate = function (perimeter) {
                var temp = perimeter.controltemplate;
                if (temp != {}) {
                    perimeter.conacc = temp.conacc;
                    perimeter.controldescription = temp.controldescription;
                    perimeter.level = temp.level;
                    perimeter.freq = temp.freq;
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



            function editPerimeter(perimeter) {
                if ($scope.company == undefined) {
                    $scope.company = companyService.company;
                }
                $scope.editperimeter = perimeter;
                $('.popup').addClass('active');
                $scope.deleteThis = false;
            }

            $scope.usetemplate = function (perimeter) {
                var temp = perimeter.template;
                if (temp != {}) {
                    perimeter.target = temp.target;
                    perimeter.description = temp.description;
                    perimeter.product = temp.product;
                    perimeter.managementtype = temp.managementtype;
                    perimeter.management = temp.management;
                    perimeter.contact = temp.contact;
                }
            };



            $scope.beginEditPerimeter = function (perimeter) {
                editPerimeter(perimeter);
            };

            $scope.savePerimeters = function () {
                if ($scope.user.changeContent) {
                    companyService.saveSystemName($scope.system, $scope.user, true);
                    $scope.hasChanged = false;
                    $scope.deleteThis = false;
                    $('.popup').removeClass('active');
                }
            };

            $scope.saveNow = function (perimeter) {
                if ($scope.user.changeContent) {
                    var l = new Date($("#lastdate")[0].value);
                    var n = new Date($("#nextdate")[0].value);
                    if (l instanceof Date && !isNaN(l.valueOf())) {
                        perimeter.lastdate = l.toISOString();
                    }
                    if (n instanceof Date && !isNaN(n.valueOf())) {
                        perimeter.nextdate = n.toISOString();
                    }
                    $scope.hasChanged = true;
                }
            };

            $scope.saveNowQuick = function () {
                if ($scope.user.changeContent) {
                    $scope.hasChanged = true;
                }
            };

            $scope.newPerimeter = function () {
                if ($scope.user.changeContent) {
                    if ($scope.system.perimeters == null) {
                        $scope.system.perimeters = [];
                    }
                    $scope.system.perimeters.push({});
                    $scope.editperimeter = $scope.system.perimeters[$scope.system.perimeters.length - 1];
                    $scope.editperimeter._id = util.uuid()
                    $scope.editperimeter.title = 'NEW PERIMETER';
                    $scope.editperimeter.showInReport = true;
                    $scope.editperimeter.status = 'Green';

                    $('.popup').addClass('active');
                    $scope.deleteThis = false;
                    $scope.saveNow($scope.editperimeter);
                }
            };

            $scope.newClonePerimeter = function (perimeter) {
                if ($scope.user.changeContent) {
                    $scope.editperimeter = angular.copy(perimeter);
                    $scope.system.perimeters.push($scope.editperimeter);
                    $scope.editperimeter._id = util.uuid()
                    $scope.editperimeter.title = 'NEW CLONE PERIMETER';
                    $('.popup').addClass('active');
                    $scope.deleteThis = false;
                    $scope.saveNow($scope.editperimeter);
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

            $scope.removePerimeter = function (perimeter) {
                if ($scope.user.changeContent) {
                    $scope.system.perimeters.splice($scope.system.perimeters.indexOf(perimeter), 1);
                    companyService.saveSystemName($scope.system, $scope.user.name);
                    $('.popup').removeClass('active');
                }
            };

            function showPerimeter() {
                if (perimeterId) {
                    let p = $scope.system.perimeters.find(x => x._id === perimeterId);
                    if (p != undefined) editPerimeter(p);
                }
            }
        }
    ]);
