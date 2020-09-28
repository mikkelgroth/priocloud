angular
    .module('riskApp')
    .controller('ProcessStepController', [
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

            var processId = $routeParams.id;
            var stepId = $routeParams.stepid;

            userService
                .user
                .subscribe(function (user) {

                    $scope.user = user;
                });

            companyService
                .getProcess(processId)
                .subscribe(function (process) {
                    $scope.process = process;
                    if (($scope.process.editUser != null && $scope.process.editUser.email == $scope.user.email)) {
                        $scope.user.changeContent = true;
                    } else {
                        $scope.user.changeContent = false;
                    }
                    showStep();
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

            companyService
                .company
                .subscribe(function (company) {
                    $scope.company = company;
                });

            companyService.processs.subscribe(function (processs) {
                $scope.processs = processs;
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
            
            //  Start LINK ENGINE

            $scope.closelink = function () {
                $('.popuplink').removeClass('active');
                $('.popup').addClass('active');
            };

            $scope.savelink = function (link) {
                if ($scope.user.changeContent) {
                    companyService.saveProcessName($scope.process, $scope.user, true);
                    $scope.editlink = {};
                    $('.popuplink').removeClass('active');
                    $('.popup').addClass('active');
                    $scope.hasChanged = false;
                }
            };

            $scope.addlink = function (lable) {
                if ($scope.user.changeContent) {
                    if ($scope.process.linklist == null) $scope.process.linklist = [];
                    var n = {};
                    n.linkuid = util.uuid();

                    n.lable = lable;
                    n.showinreport = true;

                    $scope.process.linklist.push(n);
                    companyService.saveProcessName($scope.process, $scope.user, true);

                    $scope.editlink = n;
                    if (lable == "dpalink") {
                        $('.popuplink').addClass('active');
                        $('.popup').removeClass('active');
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
                if (c.lable == "dpalink") {
                    $('.popuplink').addClass('active');
                    $('.popup').removeClass('active');
                }
                if (c.lable == "xxx") {

                }
            };

            $scope.dellink = function (c) {
                if ($scope.user.changeContent) {
                    $scope.process.linklist.splice($scope.process.linklist.indexOf(c), 1);
                    companyService.saveProcessName($scope.process, $scope.user, true);
                    $scope.editlink = {};
                    if (c.lable == "xxx") {

                    }
                    if (c.lable == "dpalink") {
                        $('.popuplink').removeClass('active');
                        $('.popup').addClass('active');
                    }
                    $scope.hasChanged = false;
                }
            };
            // END LINK ENGINE

            function editStep(step) {
                if ($scope.company == undefined) {
                    $scope.company = companyService.company;
                }
                if (step.rt != undefined && $scope.company.resourceTypes != undefined && $scope.company.resourceTypes.length > 0) {
                    let o = $scope.company.resourceTypes.find(x => x.rtuid === step.rt.rtuid);
                    if (o != undefined) {
                        step.rt = o;
                    }
                }
                $scope.editstep = step;
                $('.popup').addClass('active');
                $scope.deleteThis = false;
            }

            $scope.beginEditStep = function (step) {
                editStep(step);
            };

            $scope.saveSteps = function () {
                if ($scope.user.changeContent) {
                    companyService.saveProcessName($scope.process, $scope.user, true);
                    $scope.hasChanged = false;
                    $scope.deleteThis = false;
                    $('.popup').removeClass('active');
                }
            };

            $scope.saveNow = function (step) {
                if ($scope.user.changeContent) {
                    step.assetvalue = Math.round((Number(step.custexposure) + 
                    Number(step.finincome) + 
                    Number(step.costeficient) + 
                    Number(step.processdependency)-4)*100/44);
                    
                    step.risklevelvalue = Math.round((Number(step.recComp) + 
                    Number(step.prob) + 
                    Number(step.impact)-3)*100/33);

                    step.riskassetvalue = Math.round((step.assetvalue + step.risklevelvalue)/2);
                    calcStepsTotals();

                    $scope.hasChanged = true;
                }
            };

            $scope.saveNowQuick = function () {
                if ($scope.user.changeContent) {
                    $scope.hasChanged = true;
                }
            };

            $scope.newStep = function () {
                if ($scope.user.changeContent) {
                    if ($scope.process.steps == null) {
                        $scope.process.steps = [];
                    }
                    $scope.process.steps.push({});
                    $scope.editstep = $scope.process.steps[$scope.process.steps.length - 1];
                    $scope.editstep._id = Math.random().toString(36).substr(2, 9);
                    $scope.editstep.title = 'NEW STEP';
                    $scope.editstep.showInReport = true;
                    $scope.editstep.status = 'Green';

                    $scope.editstep.assetvalue = 0;
                    $scope.editstep.custexposure="1";
                    $scope.editstep.finincome="1";
                    $scope.editstep.costeficient="1";
                    $scope.editstep.processdependency="1";

                    $scope.editstep.risklevelvalue = 0;
                    $scope.editstep.recComp="1";
                    $scope.editstep.prob="1";
                    $scope.editstep.impact="1";

                    $scope.editstep.riskassetvalue = 0;
                    
                    $('.popup').addClass('active');
                    $scope.deleteThis = false;
                    $scope.saveNow($scope.editstep);
                }
            };

            calcStepsTotals = function () {
                var total = 0;
                for (let i = 0; i < $scope.process.steps.length; i++) {
                    const e = $scope.process.steps[i];
                    total += e.riskassetvalue;
                }
                $scope.process.stepstotal = Math.round(total/$scope.process.steps.length);
                $scope.process.priostepstotal = Math.round(($scope.process.stepstotal+$scope.process.risklevel)/2);
            }

            $scope.newCloneStep = function (step) {
                if ($scope.user.changeContent) {
                    $scope.editstep = angular.copy(step);
                    $scope.process.steps.push($scope.editstep);
                    $scope.editstep._id = Math.random().toString(36).substr(2, 9);
                    $scope.editstep.title = 'NEW CLONE STEP';
                    $('.popup').addClass('active');
                    $scope.deleteThis = false;
                    $scope.saveNow($scope.editstep);
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

            $scope.removeStep = function (step) {
                if ($scope.user.changeContent) {
                    $scope.process.steps.splice($scope.process.steps.indexOf(step), 1);
                    companyService.saveProcessName($scope.process, $scope.user.name);
                    $('.popup').removeClass('active');
                }
            };

            function showStep() {
                if (stepId) {
                    let p = $scope.process.steps.find(x => x._id === stepId);
                    if (p != undefined) editStep(p);
                }
            }
        }
    ]);
