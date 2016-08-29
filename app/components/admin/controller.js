angular
    .module('riskApp')
    .controller('AdminController', [
        '$scope',
        'userService',
        'companyService',
        'restService',
        function (
            $scope,
            userService,
            companyService,
            restService
        ) {
            userService
                .user
                .subscribe(function (user) {

                    $scope.user = user;
                });

            userService
                .users
                .subscribe(function (users) {

                    $scope.users = users;
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

            $scope.saveCompany = function () {

                if ($scope.company._id) {	//update

                    restService.updateData('company', angular.fromJson($scope.company)).success(function (dataResponse) {

                    }).error(function (dataResponse) { 

                        console.log('ERROR ...'); 
                    });
                
                } else {	//add

                    restService.saveData('company', angular.fromJson($scope.company)).success(function (dataResponse) {

                        $scope.company = dataResponse;	//update the oid via angular
                        //add a BU with company name 
                        var bu = { name: $scope.company.name };
                        restService.saveData('bu', angular.fromJson(bu)).success(function (dataResponse) {
                            $scope.bus[0] = dataResponse;
                        });

                    }).error(function (dataResponse) { 

                        console.log('ERROR ...'); 
                    });
                }
            };

            $scope.newBU = function() {

                $scope.bus.push({});
            };

            $scope.removeBU = function (bu) {

                restService.deleteData('bu', angular.fromJson(bu)).success(function (dataResponse) {

                    $scope.bus.splice($scope.bus.indexOf(bu), 1);

                }).error(function (dataResponse) { 
                    
                    console.log('ERROR ...'); 
                });
            };

            $scope.saveBus = function () {

                angular.forEach($scope.bus, function (bu) {

                    if (bu.ownerbu && bu._id == bu.ownerbu._id) {
                        alert("Du kan ikke have en BU der peger på sig selv!!!");
                        return;
                    }

                    if (bu._id) {	//update

                        restService.updateData('bu', angular.fromJson(bu)).success(function (dataResponse) {
                            console.log('updated');
                        }).error(function (dataResponse) { console.log('ERROR ...'); });
                    
                    } else {	//add
                        
                        restService.saveData('bu', angular.fromJson(bu)).success(function (dataResponse) {
                            $scope.bus[$scope.bus.indexOf(bu)] = dataResponse;	//update the oid via angular
                            console.log('saved');
                        }).error(function (dataResponse) { console.log('ERROR ...'); });
                    }
                });
            };
        }
    ]);
