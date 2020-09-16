angular
    .module('riskApp')
    .controller('MetricDetailsController', [
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

            var metricId = $routeParams.id;

            userService
                .user
                .subscribe(function (user) {

                    $scope.user = user;
                });

            companyService
                .getMetric(metricId)
                .subscribe(function (metric) {
                    $scope.metric = metric;
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

            if (($scope.metric.editUser != null && $scope.metric.editUser.email == $scope.user.email)) {
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
                    companyService.saveMetricName($scope.metric, $scope.user, true);
                    $scope.editlink = {};
                    $('.popup').removeClass('active');
                    $scope.hasChanged = false;
                }
            };

            $scope.addlink = function (lable) {
                if ($scope.user.changeContent) {
                    if ($scope.metric.linklist == null) $scope.metric.linklist = [];
                    var n = {};
                    n.linkuid = newguid();

                    n.lable = lable;
                    n.showinreport = true;

                    $scope.metric.linklist.push(n);
                    companyService.saveMetricName($scope.metric, $scope.user, true);

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
                $scope.metric.linklist.splice($scope.metric.linklist.indexOf(c), 1);
                companyService.saveMetricName($scope.metric, $scope.user, true);
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

            $scope.saveMetric = function () {
                if ($scope.user.changeContent) {  
                    $scope.metric.statusdate = new Date(); 
                    companyService.saveMetricName($scope.metric, $scope.user, true);
                    $scope.hasChanged = false;
                    $scope.statehasChanged = false;
                }
            };

            $scope.statechange = function () {
                $scope.statehasChanged = true;
            }

            $scope.saveNow = function () {
                var enabler = 0;
                var exposure = 0;
                enabler += Number($scope.metric.valuestreammagnitude.charAt(0));
                exposure += Number($scope.metric.externalexposure.charAt(0));
                $scope.metric.risklevel = Math.round((enabler * exposure)*100/(4*4));
                
                $scope.hasChanged = true;

            };
        }
    ]);
