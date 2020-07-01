angular
    .module('riskApp')
    .controller('ProcesssController', [
        '$scope',
        '$rootScope',
        '$location',
        'userService',
        'companyService',
        function (
            $scope,
            $rootScope,
            $location,
            userService,
            companyService
        ) {
            companyService.loadCompany();
            companyService.reloadCompany();
            companyService.reloadProcesss();
            companyService.reloadSystems();
            

            companyService.company.subscribe(function (company) {
                $scope.company = company;
            });

            companyService.projects.subscribe(function (projects) {
                $scope.projects = projects;
            });

            companyService.processs.subscribe(function (processs) {
                $scope.processs = setProcessList(processs);
            });

            companyService.businessUnits.subscribe(function (units) {
                $scope.bus = units;
            });

            userService.user.subscribe(function (user) {
                $scope.user = user;
            });

            userService.users.subscribe(function (users) {
                $scope.users = users;
            });

            // copy objects
            //const target = qcopy(source);
            function qcopy(src) {
                return Object.assign({}, src);
            }
            $scope.views = 'overview';
            $scope.showmepmbutton = true;
            $scope.showmeresbutton = true;
            $scope.processsearch = qcopy($rootScope.rootfiltersProcesss);
            if ($scope.processsearch == null) {
                $scope.processsearch = {};
            }

            //clear all filters
            $scope.clearall = function () {
                $scope.processsearch = {};
            }
            //use same as onuserchange
            $scope.saveSearch = function () {
                $rootScope.rootfiltersProcesss = qcopy($scope.processsearch);
            }

            //Save filters to user
            $scope.saveFilters = function () {
                $scope.user.userfiltersProcesss = qcopy($rootScope.rootfiltersProcesss);
                userService.updateUser($scope.user);
            }

            $scope.showdefault = function () {
                $scope.processsearch = [];
                if ($scope.user.userfiltersProcesss != null) {
                    $scope.processsearch = qcopy($scope.user.userfiltersProcesss);
                }
            };

            function setProcessList(processs) {
                var returnlist = processs;
                for (let i = 0; i < returnlist.length; i++) {
                    const e = returnlist[i];
                    e['buname'] = e.bu.name;
                    e['pmname'] = e.pm.name;
                    e['poname'] = e.po.name;
                }
                return returnlist;
            }

            $scope.goToProcess = function (processId) {
                $location.path('/process/' + processId);
            };

            $scope.showmepm = function () {
                $scope.processsearch.ppm = [$scope.user.name];
                $scope.showmepmbutton = false;
            };
            $scope.clearmepm = function () {
                $scope.processsearch.ppm = [];
                $scope.showmepmbutton = true;
            };
            $scope.showmeres = function () {
                $scope.processsearch.acc = [$scope.user.name];
                $scope.showmeresbutton = false;
            };
            $scope.clearmeres = function () {
                $scope.processsearch.acc = [];
                $scope.showmeresbutton = true;
            };
        }
    ]);
