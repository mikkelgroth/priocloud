angular
    .module('riskApp')
    .controller('AdminResourceTypesController', [
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
                });

            $scope.saveCompany = function (company) {

                companyService.saveCompany(company);
            };
        }
    ]);
