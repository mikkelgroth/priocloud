angular
    .module('riskApp')
    .controller('ProjectStatusController', [
        '$scope',
        '$routeParams',
        '$location',
        'userService',
        'companyService',
        'routeService',
        function (
            $scope,
            $routeParams,
            $location,
            userService,
            companyService,
            routeService
        ) {

            var projectId = $routeParams.id;
            //var actionId = $routeParams.actionid;

            userService
                .user
                .subscribe(function (user) {

                    $scope.user = user;
                });

            companyService
                .getProject(projectId)
                .subscribe(function (project) {

                    $scope.project = project;
                    if (($scope.project.editUser != null && $scope.project.editUser.email == $scope.user.email)) {
                        $scope.user.changeContent = true;
                    } else {
                        $scope.user.changeContent = false;
                    }
                    //showaction();

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

                    $scope.users = users;
                });

            routeService
                .route
                .subscribe(function (route) {
                    $scope.route = route.substring(route.lastIndexOf('/') + 1);
                });


            $scope.newStatus = function () {
                if ($scope.user.changeContent) {
                    var newdate = (new Date()).toISOString();

                    $scope.editstatus = {};
                    $scope.editstatus.date = newdate;
                    $scope.editstatus.demodate = newdate;
                    $scope.editstatus.title = "No title";

                    $scope.editstatus.status = "Green";
                    $scope.editstatus.overallcomments = "TBD";
                    $scope.editstatus.statusbc = "Green";
                    $scope.editstatus.statussc = "Green";
                    $scope.editstatus.statustl = "Green";
                    $scope.editstatus.statusres = "Green";
                    $scope.editstatus.statusbud = "Green";
                    $scope.editstatus.statusrisk = "Green";

                    $scope.editstatus.apo = "Draft";
                    $scope.editstatus.active = true;
                    $scope.saveStatusEnabled = true;

                    $scope.editstatus.cs = "4";
                    $scope.editstatus.productcs = "4";

                    $scope.project.statuses.push($scope.editstatus);
                    $scope.deleteLast = false;
                    $scope.deleteThis = false;
                    if ($scope.project.statuses.length > 1) {
                        $scope.deleteThis = true;
                    }
                    companyService.saveProjectName($scope.project, $scope.user.name);

                    $('.popup').addClass('active');
                }
            };

            $scope.newCloneStatus = function (status) {
                if ($scope.user.changeContent) {
                    status.active = false;
                    $scope.editstatus = angular.copy(status);
                    $scope.editstatus._id = Math.random().toString(36).substr(2, 9);
                    $scope.editstatus.apo = "Draft";
                    $scope.editstatus.title = "No title";
                    $scope.editstatus.active = true;
                    $scope.saveStatusEnabled = true;
                    $scope.project.statuses.push($scope.editstatus);
                    $scope.deleteLast = false;
                    $scope.deleteThis = false;
                    if ($scope.project.statuses.length > 1) {
                        $scope.deleteThis = true;
                    }
                    companyService.saveProjectName($scope.project, $scope.user.name);
                    $('.popup').addClass('active');
                }
            };

            $scope.viewStatus = function (status) {
                var last = $scope.project.statuses.indexOf(status) == $scope.project.statuses.length - 1;
                $scope.editstatus = status;
                $scope.editstatus.active = last;
                $scope.saveStatusEnabled = last && $scope.editstatus.apo != "Approved";
                $scope.deleteThis = false;
                $scope.deleteLast = false;
                if ($scope.project.statuses.length > 1) {
                    $scope.deleteLast = true;
                }
                $('.popup').addClass('active');
            };


            $scope.close = function () {
                $('.popup').removeClass('active');
                $('.popupaction').removeClass('active');
                $('.popupsteerco').removeClass('active');
            };

            $scope.removeStatus = function (status) {
                if ($scope.user.changeContent) {
                    if ($scope.project.statuses.length > 1) {
                        $scope.project.statuses.splice($scope.project.statuses.indexOf(status), 1);
                        companyService.saveProjectName($scope.project, $scope.user.name);
                    }
                    $scope.deleteThis = false;
                    $('.popup').removeClass('active');
                }
            };

            $scope.delete = function () {
                $scope.deleteThis = true;
            };


            $scope.saveNow = function (status) {
                var dd = new Date(Date.parse($("#demodate")[0].value));
                if (dd instanceof Date && !isNaN(dd.valueOf())) {
                    status.demodate = dd.toISOString();
                }
                $scope.hasChanged = true;
            };

            $scope.saveStatus = function (status) {
                if ($scope.user.changeContent) {
                    var ed = new Date();
                    if (ed instanceof Date && !isNaN(ed.valueOf())) {
                        status.date = ed;
                    }

                    // RISK: this can be manipulated with and set even if you are not admin
                    if ((($scope.project.altpo != null && $scope.project.altpo.email == $scope.user.email) || ($scope.project.po != null && $scope.project.po.email == $scope.user.email) || $scope.user.admin) &&
                        (status.apo == "Approved")) {
                        status.savedfinalby = $scope.user.name;
                        status.active = false;
                    }

                    if ($scope.project.statuses.length == 0) {
                        $scope.project.statuses.push(status);
                    } else {
                        $scope.project.statuses[$scope.project.statuses.length - 1] = status;
                    }

                    //$scope.logProject(true, "Status saved");

                    companyService.saveProjectName($scope.project, $scope.user, true);
                    $scope.hasChanged = false;
                }

            }


            // Action & Decision points
            $scope.actiondelete = function () {
                $scope.actiondeleteThis = true;
            };

            function editaction(action) {
                $scope.editaction = action;
                $scope.actiondeleteThis = false;
                $scope.actiondeleteThis = false;
                $('.popupaction').addClass('active');
            }

            $scope.beginEditaction = function (action) {
                editaction(action);
            };

            $scope.saveactions = function () {
                if ($scope.user.changeContent) {
                    companyService.saveProjectName($scope.project, $scope.user, true);
                    $scope.hasChanged = false;
                    $scope.actiondeleteThis = false;
                }
            };

            $scope.actionsaveNow = function (action) {
                if ($scope.user.changeContent) {
                    var cd = new Date(Date.parse($("#createdate")[0].value));
                    if (cd instanceof Date && !isNaN(cd.valueOf())) {
                        action.createdate = cd.toISOString();
                    }

                    action.rawupdatedate = new Date();
                    action.updatedate = action.rawupdatedate.toISOString();

                    var ad = new Date(Date.parse($("#actiondate")[0].value));
                    if (ad instanceof Date && !isNaN(ad.valueOf())) {
                        action.actiondate = ad.toISOString();
                    }
                    $scope.actionhasChanged = true;
                }
            };

            $scope.newaction = function (thistype) {
                if ($scope.user.changeContent) {
                    if ($scope.project.actions == null) {
                        $scope.project.actions = [];
                    }
                    $scope.project.actions.push({});
                    $scope.editaction = $scope.project.actions[$scope.project.actions.length - 1];

                    $scope.editaction._id = Math.random().toString(36).substr(2, 9);
                    $scope.editaction.status = 'Green';
                    $scope.editaction.title = 'NEW ACTION OR DECISION';
                    $scope.editaction.showInReport = true;
                    $scope.editaction.audience = 'Portfolio';
                    $scope.editaction.requester = $scope.project.pm.name;
                    $scope.editaction.responsible = $scope.project.pm.name;
                    $scope.editaction.type = thistype;
                    $scope.editaction.priority = '4. Ad hoc';
                    $scope.editaction.goal = 'None';
                    $scope.editaction.action = 'None';
                    $scope.editaction.decision = 'None';

                    $scope.editaction.rawcreatedate = new Date();
                    $scope.editaction.createdate = $scope.editaction.rawcreatedate.toISOString();
                    $("#createdate")[0].value = $scope.editaction.rawcreatedate;

                    $scope.editaction.rawupdatedate = new Date();
                    $scope.editaction.updatedate = $scope.editaction.rawupdatedate.toISOString();

                    $scope.editaction.rawactiondate = new Date();
                    $scope.editaction.actiondate = $scope.editaction.rawactiondate.toISOString();
                    $("#actiondate")[0].value = $scope.editaction.rawactiondate;

                    $scope.editaction.state = 'Open';

                    $scope.actiondeleteThis = false;
                    $scope.saveNow($scope.editaction);


                    $('.popupaction').addClass('active');
                }
            };


            $scope.hideactionForm = function () {

                $scope.actiondeleteThis = false;
                $('.popupaction').removeClass('active');
            };

            $scope.removeaction = function (action) {
                if ($scope.user.changeContent) {
                    $scope.project.actions.splice($scope.project.actions.indexOf(action), 1);
                    companyService.saveProjectName($scope.project, $scope.user.name);

                    $scope.actiondeleteThis = false;
                    $('.popupaction').removeClass('active');
                }
            };

            

            function showaction() {

                // TODO(2): this doesn't work until correct id's for actions has been implemented

                if (actionId) {
                    let p = $scope.project.actions.find(x => x._id === actionId);
                    if (p != undefined) editaction(p);
                }
            }

            // Steerco
            $scope.steercodelete = function () {
                $scope.steercodeleteThis = true;
            };

            function editsteerco(steerco) {

                $scope.editsteerco = steerco;
                $scope.steercodeleteThis = false;
                $scope.steercodeleteThis = false;
                $('.popupsteerco').addClass('active');
            }


            $scope.beginEditsteerco = function (steerco) {
                editsteerco(steerco);
            };



            $scope.savesteercos = function () {
                if ($scope.user.changeContent) {
                    companyService.saveProjectName($scope.project, $scope.user, true);
                    $scope.hasChanged = false;
                    $scope.steercodeleteThis = false;
                }
            };

            $scope.steercosaveNow = function (steerco) {
                if ($scope.user.changeContent) {
                    var ad = new Date(Date.parse($("#steercodate")[0].value));
                    if (ad instanceof Date && !isNaN(ad.valueOf())) {
                        steerco.steercodate = ad.toISOString();
                    }
                    $scope.steercohasChanged = true;
                }
            };

            $scope.newsteerco = function (thistype) {
                if ($scope.user.changeContent) {
                    if ($scope.project.steercos == null) {
                        $scope.project.steercos = [];
                    }
                    $scope.project.steercos.push({});
                    $scope.editsteerco = $scope.project.steercos[$scope.project.steercos.length - 1];

                    $scope.editsteerco._id = Math.random().toString(36).substr(2, 9);

                    $scope.editsteerco.rawsteercodate = new Date();
                    $scope.editsteerco.steercodate = $scope.editsteerco.rawsteercodate.toISOString();
                    $("#steercodate")[0].value = $scope.editsteerco.rawsteercodate;

                    $scope.editsteerco.steercoagenda = '';
                    $scope.editsteerco.steercoattendees = '';
                    $scope.editsteerco.steercominutes = '';

                    $scope.steercodeleteThis = false;
                    $scope.saveNow($scope.editsteerco);

                    $('.popupsteerco').addClass('active');
                }
            };


            $scope.hidesteercoForm = function () {

                $scope.steercodeleteThis = false;
                $('.popupsteerco').removeClass('active');
            };

            $scope.removesteerco = function (steerco) {
                if ($scope.user.changeContent) {
                    $scope.project.steercos.splice($scope.project.steercos.indexOf(steerco), 1);
                    companyService.saveProjectName($scope.project, $scope.user.name);

                    $scope.steercodeleteThis = false;
                    $('.popupsteerco').removeClass('active');
                }
            };

            $scope.savesteercos = function () {
                if ($scope.user.changeContent) {
                    companyService.saveProjectName($scope.project, $scope.user, true);
                    $scope.steercohasChanged = false;
                    $scope.steercodeleteThis = false;
                    $('.popupsteerco').removeClass('active');
                }
            };

            function showsteerco() {

                // TODO(2): this doesn't work until correct id's for steercos has been implemented

                if (steercoId) {
                    let p = $scope.project.steercos.find(x => x._id === steercoId);
                    if (p != undefined) editsteerco(p);
                }
            }








        }
    ]);
