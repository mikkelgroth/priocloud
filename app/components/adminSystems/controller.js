angular
    .module('riskApp')
    .controller('AdminSystemsController', [
        '$scope',
        '$location',
        'userService',
        'companyService',
        'restService',
        'util',
        function (
            $scope,
            $location,
            userService,
            companyService,
            restService,
            util
        ) {
            companyService.reloadSystems();

            userService
                .user
                .subscribe(function (user) {

                    $scope.user = user;
                });

            userService
                .users
                .subscribe(function (users) {
                    $scope.tempusers = JSON.parse(JSON.stringify(users));
                    for (let i = 0; i < $scope.tempusers.length; i++) {
                        $scope.tempusers[i].bu = {};
                    }
                });

            companyService
                .company
                .subscribe(function (company) {
                    $scope.company = company;
                });

            companyService
                .businessUnits
                .subscribe(function (units) {
                    $scope.bus = units;
                });

            companyService
                .systems
                .subscribe(function (systems) {
                    $scope.systems = systems;
                });

            $scope.views = 'systemsview';
            
            $scope.saveNow = function (control) {
            };
            // LOCK
            $scope.companyedit = false;
            if ($scope.company.locked && $scope.company.lockedby != undefined && $scope.company.lockedby != {} && $scope.company.lockedby.name == $scope.user.name) {
                $scope.companyedit = true;
            }

            $scope.close = function () {
                $('.popup').removeClass('active');
                $('.popupcontent').removeClass('active');
                $('.popupcat').removeClass('active');
                $('.popupperimeter').removeClass('active');
                $('.popupcontrol').removeClass('active');
                $('.popupcatsub').removeClass('active');
            };


            //Perimeters START

            function editPerimeter(perimeter) {
                $scope.editperimeter = perimeter;
                $('.popup').addClass('active');
            }

            $scope.beginEditPerimeter = function (perimeter) {
                editPerimeter(perimeter);
            };

            $scope.savePerimeters = function () {
                if ($scope.companyedit) {
                    companyService.saveCompany($scope.company);
                    $('.popup').removeClass('active');
                }
            };


            $scope.newPerimeter = function () {
                if ($scope.companyedit) {
                    if ($scope.company.standardperimeters == null) {
                        $scope.company.standardperimeters = [];
                    }
                    $scope.company.standardperimeters.push({});
                    $scope.editperimeter = $scope.company.standardperimeters[$scope.company.standardperimeters.length - 1];
                    $scope.editperimeter._id = util.uuid();
                    $scope.editperimeter.title = 'NEW PERIMETER';
                    $('.popup').addClass('active');
                }
            };

            $scope.deletePerimeter = function (perimeter) {
                if ($scope.companyedit) {
                    $scope.company.standardperimeters.splice($scope.company.standardperimeters.indexOf(perimeter), 1);
                    companyService.saveCompany($scope.company);
                    $('.popup').removeClass('active');
                }
            };


            //Perimeter END


            //Controls START

            function editcontrol(control) {
                $scope.editcontrol = control;
                $('.popup').addClass('active');
            }

            $scope.beginEditControl = function (control) {
                editcontrol(control);
            };

            $scope.saveControls = function () {
                if ($scope.companyedit) {
                    companyService.saveCompany($scope.company);
                    $('.popup').removeClass('active');
                }
            };

            $scope.newstandardcontrol = function () {
                if ($scope.companyedit) {
                    if ($scope.company.standardcontrols == null) {
                        $scope.company.standardcontrols = [];
                    }
                    $scope.company.standardcontrols.push({});
                    $scope.editcontrol = $scope.company.standardcontrols[$scope.company.standardcontrols.length - 1];
                    $scope.editcontrol._id = util.uuid();
                    $scope.editcontrol.title = 'NEW control';
                    $('.popup').addClass('active');
                }
            };

            $scope.deleteControl = function (control) {
                if ($scope.companyedit) {
                    $scope.company.standardcontrols.splice($scope.company.standardcontrols.indexOf(control), 1);
                    companyService.saveCompany($scope.company);
                    $('.popup').removeClass('active');
                }
            };


            //controls END






            $scope.newSystem = function () {

                var system = {};

                /** System Details  */
                system.creationdate = (new Date()).toISOString();
                system.datasecuritylevel = '1. Public';
                system.priority = '1. Valued';
                system.valuestreammagnitude = '1. Minimal value';
                system.externalexposure = '1. No exposure';
                system.title = "NEW SYSTEM";
                system.bu = $scope.bus[0];
                system.continuity = {};
                system.access = {};
                system.perimeter = {};
                system.data = {};
                system.connectionsobj = {};
                system.controlsobj = {};
                system.continuity.securityownerfeedback = "Orange";
                system.access.securityownerfeedback = "Orange";
                system.perimeter.securityownerfeedback = "Orange";
                system.data.securityownerfeedback = "Orange";
                system.connectionsobj.securityownerfeedback = "Orange";
                system.controlsobj.securityownerfeedback = "Orange";

                $scope.np = system;

                $('.popup').addClass('active');
            };

            $scope.editSystem = function (system) {
                $scope.np = system;
                $('.popup').addClass('active');
            };

            $scope.gotoSystem = function (system) {
                $location.path('/system/' + system._id.$oid + '/details')
            };

            $scope.saveSystem = function (system) {
                companyService.saveSystem(system, $scope.user);
                $('.popup').removeClass('active');
            };
            $scope.deleteSystem = function (system) {
                companyService.deleteSystem(system);
                $('.popup').removeClass('active');
            };




            // Datacategories

            $scope.saveCat = function () {
                companyService.saveCompany($scope.company);
                $scope.editcat = {};
                $('.popupcat').removeClass('active');
            };

            $scope.saveNowDatacat = function (cat) {
                if(cat.sensitivedata == "no") cat.type = [];
            };

            $scope.addCat = function () {
                if ($scope.company.datacategories == null) $scope.company.datacategories = [];
                var n = {};
                n.catuid = util.uuid();
                n.name = "NEW Category";

                $scope.company.datacategories.push(n);
                companyService.saveCompany($scope.company);

                $scope.editcat = n;
                $('.popupcat').addClass('active');
            };

            $scope.editCat = function (c) {
                if (c.catuid == undefined) {
                    c.catuid = util.uuid();
                }
                $scope.editcat = c;
                $('.popupcat').addClass('active');

            };

            $scope.delCat = function (c) {
                $scope.company.datacategories.splice($scope.company.datacategories.indexOf(c), 1);
                companyService.saveCompany($scope.company);
                $scope.editcat = {};
                $('.popupcat').removeClass('active');

            };

            // Datacategory Subjects

            $scope.saveCatsub = function () {
                companyService.saveCompany($scope.company);
                $scope.editcatsub = {};
                $('.popupcatsub').removeClass('active');
            };



            $scope.addCatsub = function () {
                if ($scope.company.datacatsubs == null) $scope.company.datacatsubs = [];
                var n = {};
                n.catsubuid = util.uuid();
                n.name = "NEW Category subject";

                $scope.company.datacatsubs.push(n);
                companyService.saveCompany($scope.company);

                $scope.editcatsub = n;
                $('.popupcatsub').addClass('active');
            };

            $scope.editthisCatsub = function (c) {
                if (c.catsubuid == undefined) {
                    c.catsubuid = util.uuid();
                }
                $scope.editcatsub = c;
                $('.popupcatsub').addClass('active');

            };

            $scope.delCatsub = function (c) {
                $scope.company.datacatsubs.splice($scope.company.datacatsubs.indexOf(c), 1);
                companyService.saveCompany($scope.company);
                $scope.editcatsub = {};
                $('.popupcatsub').removeClass('active');

            };
        }
    ]);
