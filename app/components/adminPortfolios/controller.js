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

            userService
                .user
                .subscribe(function (user) {

                    $scope.user = user;
                });

            companyService
                .company
                .subscribe(function (company) {

                    $scope.company = company;
                    $scope.newport={};
                });

            companyService
                .businessUnits
                .subscribe(function (units) {

                    $scope.bus = units;
                });

            

            $scope.saveCompany = function (company) {

                companyService.saveCompany(company);
            };

            $scope.saveports = function () {
                
                companyService.saveCompany($scope.company);
                $scope.newport={};
                
            };


            $scope.addport = function (newport) {
                if($scope.company.portfolios==null) $scope.company.portfolios = [];
                
                $scope.company.portfolios.push(newport);
                companyService.saveCompany($scope.company);

                $scope.newport={}; 
            };
            
 
            $scope.delport = function (port) {
                $scope.company.portfolios.splice($scope.company.portfolios.indexOf(port), 1);
                companyService.saveCompany($scope.company);
                $scope.newport={}; 
                
            };
        }
    ]);
