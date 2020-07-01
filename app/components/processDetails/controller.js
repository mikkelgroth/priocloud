angular
    .module('riskApp')
    .controller('ProcessDetailsController', [
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

            var processId = $routeParams.id;

            userService
                .user
                .subscribe(function (user) {

                    $scope.user = user;
                });

            companyService
                .getProcess(processId)
                .subscribe(function (process) {
                    $scope.process = process;
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

            if (($scope.process.editUser != null && $scope.process.editUser.email == $scope.user.email)) {
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
                    companyService.saveProcessName($scope.process, $scope.user, true);
                    $scope.editlink = {};
                    $('.popup').removeClass('active');
                    $scope.hasChanged = false;
                }
            };

            $scope.addlink = function (lable) {
                if ($scope.user.changeContent) {
                    if ($scope.process.linklist == null) $scope.process.linklist = [];
                    var n = {};
                    n.linkuid = newguid();

                    n.lable = lable;
                    n.showinreport = true;

                    $scope.process.linklist.push(n);
                    companyService.saveProcessName($scope.process, $scope.user, true);

                    $scope.editlink = n;
                    if (lable=="Details") {
                        $('.popup').addClass('active');
                    }
                    if (lable=="xxx") {
                        
                    }
                }
            };

            $scope.editlinkitem = function (c) {
                if (c.linkuid == undefined) {
                    c.linkuid = newguid();
                }
                $scope.editlink = c;
                if (c.lable=="Details") {
                    $('.popup').addClass('active');
                }
                if (c.lable=="xxx") {
                    
                }
            };

            $scope.dellink = function (c) {
                if ($scope.user.changeContent) {
                $scope.process.linklist.splice($scope.process.linklist.indexOf(c), 1);
                companyService.saveProcessName($scope.process, $scope.user, true);
                $scope.editlink = {};
                if (c.lable=="xxx") {
                    
                }
                if (c.lable=="Details") {
                    $('.popup').removeClass('active');
                }
                $scope.hasChanged = false;
                }
            };
            // END LINK ENGINE

            $scope.saveProcess = function () {
                if ($scope.user.changeContent) {  
                    $scope.process.statusdate = new Date(); 
                    companyService.saveProcessName($scope.process, $scope.user, true);
                    $scope.hasChanged = false;
                    $scope.statehasChanged = false;
                }
            };

            $scope.statechange = function () {
                $scope.statehasChanged = true;
            }

            $scope.saveNow = function () {
                var prio = 0;
                var level = 0;
                var enabler = 0;
                var exposure = 0;
                prio += Number($scope.process.priority.charAt(0));
                level += Number($scope.process.datasecuritylevel.charAt(0));
                enabler += Number($scope.process.valuestreammagnitude.charAt(0));
                exposure += Number($scope.process.externalexposure.charAt(0));
                $scope.process.risklevel = Math.round((prio * level * enabler * exposure)*100/(5*5*4*4));
                
                $scope.hasChanged = true;

            };
        }
    ]);
