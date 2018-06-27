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
                    $scope.newtype={};
                });

            companyService
                .businessUnits
                .subscribe(function (units) {

                    $scope.bus = units;
                });


            $scope.saveCompany = function (company) {

                companyService.saveCompany(company);
            };

            $scope.saveTypes = function () {
                
                companyService.saveCompany($scope.company);
                $scope.newtype={};
                $scope.edittype={};
                
            };


            $scope.addType = function (newtype) {
                if($scope.company.resourceTypes==null) $scope.company.resourceTypes = [];
                
                $scope.company.resourceTypes.push(newtype);
                companyService.saveCompany($scope.company);

                $scope.newtype={}; 
                $scope.edittype={};  
            };
            
            $scope.editType = function (type) {
                $scope.edittype=type;
                $scope.newtype={};
                
            };

            $scope.delType = function (type) {
                $scope.company.resourceTypes.splice($scope.company.resourceTypes.indexOf(status), 1);
                companyService.saveCompany($scope.company);
                $scope.newtype={}; 
                $scope.edittype={};
                
            };
        }
    ]);
