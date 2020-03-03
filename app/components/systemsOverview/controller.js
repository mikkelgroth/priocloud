angular
    .module('riskApp')
    .controller('SystemsController', [
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
            companyService.reloadSystems();

            companyService.company.subscribe(function (company) {
                $scope.company = company;
            });

            companyService.projects.subscribe(function (projects) {
                $scope.projects = projects;
            });

            companyService.systems.subscribe(function (systems) {
                $scope.systems = setSystemList(systems);
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

            $scope.showmepmbutton = true;
            $scope.showmeresbutton = true;
            $scope.systemsearch = qcopy($rootScope.rootfiltersSystems);
            if ($scope.systemsearch == null) {
                $scope.systemsearch = {};
            }

            //clear all filters
            $scope.clearall = function () {
                $scope.systemsearch = {};
            }
            //use same as onuserchange
            $scope.saveSearch = function () {
                $rootScope.rootfiltersSystems = qcopy($scope.systemsearch);
            }

            //Save filters to user
            $scope.saveFilters = function () {
                $scope.user.userfiltersSystems = qcopy($rootScope.rootfiltersSystems);
                userService.updateUser($scope.user);
            }

            $scope.showdefault = function () {
                $scope.systemsearch = [];
                if ($scope.user.userfiltersSystems != null) {
                    $scope.systemsearch = qcopy($scope.user.userfiltersSystems);
                }
            };

            function setSystemList(systems) {
                var returnlist = systems;
                for (let i = 0; i < returnlist.length; i++) {
                    const e = returnlist[i];
                    e['buname'] = e.bu.name;
                    e['pmname'] = e.pm.name;
                    e['poname'] = e.po.name;
                }
                return returnlist;
            }

            $scope.goToSystem = function (systemId) {
                console.log(systemId);
                $location.path('/system/' + systemId);
            };

            $scope.showmepm = function () {
                $scope.systemsearch.ppm = [$scope.user.name];
                $scope.showmepmbutton = false;
            };
            $scope.clearmepm = function () {
                $scope.systemsearch.ppm = [];
                $scope.showmepmbutton = true;
            };
            $scope.showmeres = function () {
                $scope.systemsearch.acc = [$scope.user.name];
                $scope.showmeresbutton = false;
            };
            $scope.clearmeres = function () {
                $scope.systemsearch.acc = [];
                $scope.showmeresbutton = true;
            };
        }
    ]);
