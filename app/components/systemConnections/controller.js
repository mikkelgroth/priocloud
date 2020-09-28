angular
    .module('riskApp')
    .controller('SystemConnectionsController', [
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
            var connectionId = $routeParams.connectionid;

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
                    showConnection();
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

            function editConnection(connection) {
                if ($scope.company == undefined) {
                    $scope.company = companyService.company;
                }
                if (connection.rt != undefined && $scope.company.resourceTypes != undefined && $scope.company.resourceTypes.length > 0) {
                    let o = $scope.company.resourceTypes.find(x => x.rtuid === connection.rt.rtuid);
                    if (o != undefined) {
                        connection.rt = o;
                    }
                }
                $scope.editconnection = connection;
                $('.popup').addClass('active');
                $scope.deleteThis = false;
            }

            $scope.beginEditConnection = function (connection) {
                editConnection(connection);
            };

            $scope.saveConnections = function () {
                if ($scope.user.changeContent) {
                    companyService.saveSystemName($scope.system, $scope.user, true);
                    $scope.hasChanged = false;
                    $scope.deleteThis = false;
                    $('.popup').removeClass('active');
                }
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


            $scope.saveNowQuick = function () {
                if ($scope.user.changeContent) {
                    $scope.hasChanged = true;
                }
            };

            $scope.newConnection = function () {
                if ($scope.user.changeContent) {
                    if ($scope.system.connections == null) {
                        $scope.system.connections = [];
                    }
                    $scope.system.connections.push({});
                    $scope.editconnection = $scope.system.connections[$scope.system.connections.length - 1];
                    $scope.editconnection._id = util.uuid()
                    $scope.editconnection.title = 'NEW CONNECTION';
                    $scope.editconnection.showInReport = true;
                    $scope.editconnection.connectedsystem = $scope.systems[0].title;
                    $scope.editconnection.datacat = $scope.company.datacategories[0].name;
                    $scope.editconnection.direction = 'Outbound';
                    $scope.editconnection.transport = 'Public file';
                    $scope.editconnection.status = 'Green';
                    
                    $('.popup').addClass('active');
                    $scope.deleteThis = false;
                    $scope.saveNow($scope.editconnection);
                }
            };

            $scope.newCloneConnection = function (connection) {
                if ($scope.user.changeContent) {
                    $scope.editconnection = angular.copy(connection);
                    $scope.system.connections.push($scope.editconnection);
                    $scope.editconnection._id = util.uuid()
                    $scope.editconnection.title = 'NEW CLONE CONNECTION';
                    $('.popup').addClass('active');
                    $scope.deleteThis = false;
                    $scope.saveNow($scope.editconnection);
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

            $scope.removeConnection = function (connection) {
                if ($scope.user.changeContent) {
                    $scope.system.connections.splice($scope.system.connections.indexOf(connection), 1);
                    companyService.saveSystemName($scope.system, $scope.user.name);
                    $('.popup').removeClass('active');
                }
            };

            function showConnection() {
                if (connectionId) {
                    let p = $scope.system.connections.find(x => x._id === connectionId);
                    if (p != undefined) editConnection(p);
                }
            }
        }
    ]);
