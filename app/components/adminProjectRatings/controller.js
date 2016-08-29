angular
    .module('riskApp')
    .controller('AdminProjectRatingsController', [
        '$scope',
        '$location',
        'userService',
        'companyService',
        'restService',
        function (
            $scope,
            $location,
            userService,
            companyService,
            restService
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
