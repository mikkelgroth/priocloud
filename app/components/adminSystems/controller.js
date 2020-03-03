angular
    .module('riskApp')
    .controller('AdminSystemsController', [
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
            companyService.reloadSystems();
            
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

            companyService
                .systems
                .subscribe(function (systems) {
                    $scope.systems = systems;
                });

            

            $scope.newSystem = function () {

                var system = {};

                /** System Details  */
                system.creationdate = (new Date()).toISOString();
                system.datasecuritylevel = '5. Public';
                system.title = "NEW SYSTEM";


                /** System audits  */
                system.audits = [];
                system.audits.push({});
                system.audits[0].date = (new Date()).toISOString();
                system.audits[0].title = 'System created';

                system.audits[0].status = "Green";
                system.audits[0].overallcomments = "TBD";
                system.audits[0].dataintegrity = "Green";
                system.audits[0].accessintegrity = "Green";
                system.audits[0].perimetersecurity = "Green";
                system.audits[0].itcontingencyplan = "Green";

                system.audits[0].active = true;
                $scope.np = system;

                $('.popup').addClass('active');
            };

            $scope.editSystem = function (system) {
                $scope.np = system;
                $('.popup').addClass('active');
            };

            $scope.gotoSystem = function (system) {
                $location.path('/system/' + system._id.$oid + '/details')
            };

            $scope.saveSystem = function (system) {
                companyService.saveSystem(system, $scope.user);
                $('.popup').removeClass('active');
            };
            $scope.deleteSystem = function (system) {
                companyService.deleteSystem(system);
                $('.popup').removeClass('active');
            };
            $scope.close = function () {
                $('.popup').removeClass('active');
            };
        }
    ]);
