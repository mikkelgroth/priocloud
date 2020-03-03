angular
    .module('riskApp')
    .controller('AdminPortfoliosController', [
        '$scope',
        'userService',
        'companyService',
        function (
            $scope,
            userService,
            companyService
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

                companyService.saveCompany(company);
            };

            $scope.saveCompanyFilters = function () {
                companyService.saveCompany($scope.company);
            };

            // GUID factory
            //guid = newguid();
            function newguid() {
                let u = Date.now().toString(16) + Math.random().toString(16) + '0'.repeat(16);
                return [u.substr(0, 8), u.substr(8, 4), '4000-8' + u.substr(13, 3), u.substr(16, 12)].join('-');
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
                n.portuid = newguid();
                n.name = "NEW Portfolio";

                $scope.company.portfolios.push(n);
                companyService.saveCompany($scope.company);

                $scope.editport = n;
                $('.popupport').addClass('active');
            };

            $scope.editportfolio = function (c) {
                if (c.portuid == undefined) {
                    c.portuid = newguid();
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


            // Strategies

            $scope.saveStrat = function () {
                companyService.saveCompany($scope.company);
                $scope.editstrat = {};
                $('.popup').removeClass('active');
            };

            $scope.addStrat = function () {
                if ($scope.company.strategytypes == null) $scope.company.strategytypes = [];
                var n = {};
                n.stratuid = newguid();
                n.name = "NEW Strategy";

                $scope.company.strategytypes.push(n);
                companyService.saveCompany($scope.company);

                $scope.editstrat = n;
                $('.popup').addClass('active');
            };

            $scope.editStrat = function (c) {
                if (c.stratuid == undefined) {
                    c.stratuid = newguid();
                }
                $scope.editstrat = c;
                $scope.showeditstrat = true;
                $('.popup').addClass('active');

            };

            $scope.delStrat = function (c) {
                $scope.company.strategytypes.splice($scope.company.strategytypes.indexOf(c), 1);
                companyService.saveCompany($scope.company);
                $scope.editstrat = {};
                $('.popup').removeClass('active');

            };


        }
    ]);
