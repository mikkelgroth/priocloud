angular
    .module('riskApp')
    .controller('MetricOverviewController', [
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

            companyService
                .getMetric(metricId)
                .subscribe(function (metric) {

                    $scope.year = (new Date()).getFullYear();
                    //console.log(metric.title);
                    $scope.metric = metric;
                    $scope.user.isOwner = ($scope.metric.bu.owner != null && $scope.metric.bu.owner.email != null && $scope.metric.bu.owner.email == $scope.user.email)

                    if (($scope.metric.pm != null && $scope.user.email == $scope.metric.pm.email) ||
                        ($scope.metric.po != null && $scope.user.email == $scope.metric.po.email) ||
                        ($scope.metric.altpo != null && $scope.user.email == $scope.metric.altpo.email) ||
                        ($scope.metric.altpm != null && $scope.user.email == $scope.metric.altpm.email) ||
                        $scope.user.isOwner || ($scope.user.financecontroller && $scope.metric.financecontroller != null && $scope.user.email == $scope.metric.financecontroller.email) || $scope.user.subadmin || $scope.user.admin) {

                        if ($scope.metric.editUser == null) {
                            $scope.metric.showRelease = false;
                            $scope.user.changeContent = true;
                        } else if ($scope.metric.editUser != null && ($scope.metric.editUser.email == $scope.user.email || $scope.user.subadmin || $scope.user.admin)) {
                            $scope.metric.showRelease = true;
                            $scope.user.changeContent = true;
                        } else {
                            $scope.metric.showRelease = false;
                            $scope.user.changeContent = false;
                        }
                    } else {
                        $scope.user.changeContent = false;
                    }
                });

            companyService
                .company
                .subscribe(function (company) {
                    $scope.company = company;
                });

            companyService
                .metrics
                .subscribe(function (metrics) {
                    $scope.metrics = metrics;
                });

            companyService
                .metrics
                .subscribe(function (systems) {
                    $scope.systems = systems;
                });

            $scope.saveMetric = function (metric) {

                companyService.saveMetricName(metric, $scope.user, true);
                $scope.hasChanged = false;
            };
            $scope.editMetric = function (metric) {
                metric.editUser = $scope.user;
                $scope.metric.showRelease = true;
                companyService.saveMetricOnLoad(metric);
                $scope.hasChanged = false;
            };
            $scope.releaseMetric = function (metric) {
                metric.editUser = null;
                $scope.metric.showRelease = false;
                companyService.saveMetricOnLoad(metric);
                $scope.hasChanged = true;
                //$location.path('/');
            };

            $scope.saveNow = function (metric) {
                $scope.hasChanged = true;
            };
        }
    ]);
