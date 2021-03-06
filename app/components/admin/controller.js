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
            companyService.loadCompany();
            companyService.reloadCompany();
            companyService.reloadSystems();
            companyService.reloadProcesss();
            
            userService
                .user
                .subscribe(function (user) {
                    $scope.user = user;
                });

            userService
                .users
                .subscribe(function (users) {
                    $scope.sessionsusers = JSON.parse(JSON.stringify(users));
                    for (let i = 0; $scope.sessionsusers != null && i < $scope.sessionsusers.length; i++) {
                        const element = $scope.sessionsusers[i];
                        element.bu = {};
                    };
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

            $scope.close = function () {
                $('.popup').removeClass('active');
            };
            // LOCK
            $scope.companylock = {};
            $scope.companylock.lockbox = true;
            $scope.companyedit = false;
            $scope.companylock.showtakelock = false;
            $scope.companylock.showreleaselock = false;
            $scope.companylock.showforcedreleaselock = false;
            if ($scope.company.locked) {
                if ($scope.company.lockedby != undefined && $scope.company.lockedby != {} && $scope.company.lockedby.name == $scope.user.name) {
                    $scope.companyedit = true;
                    $scope.companylock.showreleaselock = true;
                    //console.log("You user lockedby: " + $scope.company.lockedby);
                } else {
                    $scope.companylock.showforcedreleaselock = true;
                }
            } else {
                $scope.companylock.showtakelock = true;
            }



            $scope.closelockbox = function () {
                $scope.companylock.lockbox = false;
            };

            $scope.takelock = function () {
                $scope.company.locked = true;
                $scope.company.lockedby = $scope.user;
                $scope.companyedit = true;
                $scope.company.lockeddate = new Date();
                companyService.saveCompany($scope.company);
                $scope.companylock.showtakelock = false;
                $scope.companylock.showreleaselock = true;
                $scope.companylock.showforcedreleaselock = false;
            };

            $scope.releaselock = function () {
                $scope.company.locked = false;
                $scope.company.lockedby = {};
                $scope.company.lockeddate = {};
                companyService.saveCompany($scope.company);
                $scope.companylock.showtakelock = true;
                $scope.companylock.showreleaselock = false;
                $scope.companylock.showforcedreleaselock = false;
            };

            $scope.forcereleaselock = function () {
                $scope.company.locked = false;
                $scope.company.forcedlockedby = $scope.user;
                $scope.company.forcedlockeddate = new Date();
                $scope.company.lockedby = {};
                $scope.company.lockeddate = {};
                companyService.saveCompany($scope.company);
                $scope.companylock.showtakelock = true;
                $scope.companylock.showreleaselock = false;
                $scope.companylock.showforcedreleaselock = false;
            };

            // LOCK

            $scope.saveBu = function (bu) {
                if (bu.ownerbu == null) {
                    bu.order = 0;
                    bu.indent = "";
                    alert("No parent BU!");
                }
                if (bu.ownerbu && bu._id == bu.ownerbu._id) {
                    alert("Du kan ikke have en BU der peger på sig selv!!!");
                    return;
                }
                if (bu._id) {	//update
                    restService.updateData('bu', angular.fromJson(bu)).success(function (dataResponse) {
                        console.log('updated bu');
                    }).error(function (dataResponse) { console.log('ERROR ...'); });
                } else {	//add
                    restService.saveData('bu', angular.fromJson(bu)).success(function (dataResponse) {
                        $scope.bus[$scope.bus.indexOf(bu)] = dataResponse;	//update the oid via angular
                        console.log('created new bu');
                    }).error(function (dataResponse) { console.log('ERROR ...'); });
                }
                $scope.editbu = {};
                $('.popup').removeClass('active');
            };

            $scope.addBu = function () {
                if ($scope.bus == null) $scope.bus = [];
                var nb = {};
                nb.name = "NEW BU";
                nb.owner = $scope.user;
                nb.ownerbu = $scope.bus[0];
                nb.order = "z";
                nb.indent = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
                $scope.bus.push(nb);
                $scope.editbu = nb;
                $('.popup').addClass('active');
            };

            $scope.editBu = function (bu) {
                $scope.editbu = bu;
                $('.popup').addClass('active');
            };

            $scope.removeBU = function (bu) {
                restService.deleteData('bu', angular.fromJson(bu)).success(function (dataResponse) {
                    $scope.bus.splice($scope.bus.indexOf(bu), 1);
                    $scope.editbu = {};
                    $('.popup').removeClass('active');
                }).error(function (dataResponse) {
                    console.log('ERROR ...');
                });
            };
        }
    ]);
