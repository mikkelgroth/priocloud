angular
    .module('riskApp')
    .controller('AdminPortfoliosController', [
        '$scope',
        'userService',
        'companyService',
        'util',
        function (
            $scope,
            userService,
            companyService,
            util
        ) {
            $scope.newport = {};
            userService
                .user
                .subscribe(function (user) {

                    $scope.user = user;
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



            $scope.saveCompany = function (company) {
                company.lastsaved = new Date();
                company.lastsavedby = $scope.user.name;
                companyService.saveCompany(company);
            };

            $scope.saveCompanyFilters = function () {
                companyService.saveCompany($scope.company);
            };

            // LOCK
            $scope.companyedit = false;
            if ($scope.company.locked && $scope.company.lockedby != undefined && $scope.company.lockedby != {} && $scope.company.lockedby.name == $scope.user.name) {
                $scope.companyedit = true;
            }

            $scope.closestrat = function () {
                $('.popup').removeClass('active');
            };
            $scope.closeport = function () {
                $('.popupport').removeClass('active');
            };

            // Portfolios

            $scope.saveport = function () {
                companyService.saveCompany($scope.company);
                $scope.editport = {};
                $('.popupport').removeClass('active');
            };

            $scope.addport = function () {
                if ($scope.company.portfolios == null) $scope.company.portfolios = [];
                var n = {};
                n.portuid = util.uuid();
                n.name = "NEW Portfolio";

                $scope.company.portfolios.push(n);
                companyService.saveCompany($scope.company);

                $scope.editport = n;
                $('.popupport').addClass('active');
            };

            $scope.editportfolio = function (c) {
                if (c.portuid == undefined) {
                    c.portuid = util.uuid();
                }
                $scope.editport = c;
                $('.popupport').addClass('active');

            };

            $scope.delport = function (c) {
                $scope.company.portfolios.splice($scope.company.portfolios.indexOf(c), 1);
                companyService.saveCompany($scope.company);
                $scope.editport = {};
                $('.popupport').removeClass('active');

            };


        }
    ]);
