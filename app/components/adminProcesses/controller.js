angular
    .module('riskApp')
    .controller('AdminProcessesController', [
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
            companyService.reloadProcesses();
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

            companyService
                .processes
                .subscribe(function (processes) {
                    $scope.processes = processes;
                });

            $scope.newProcess = function () {

                var process = {};

                /** Process Details  */
                process.creationdate = (new Date()).toISOString();
                process.datasecuritylevel = '5. Public';
                process.title = "NEW PROCESS";


                /** Process audits  */
                process.audits = [];
                process.audits.push({});
                process.audits[0].date = (new Date()).toISOString();
                process.audits[0].title = 'Process created';

                process.audits[0].status = "Green";
                process.audits[0].overallcomments = "TBD";
                process.audits[0].dataintegrity = "Green";
                process.audits[0].accessintegrity = "Green";
                process.audits[0].perimetersecurity = "Green";
                process.audits[0].itcontingencyplan = "Green";

                process.audits[0].active = true;
                $scope.np = process;

                $('.popup').addClass('active');
            };

            $scope.editProcess = function (process) {
                $scope.np = process;
                $('.popup').addClass('active');
            };

            $scope.gotoProcess = function (process) {
                $location.path('/process/' + process._id.$oid + '/details')
            };

            $scope.saveProcess = function (process) {
                companyService.saveProcess(process, $scope.user);
                $('.popup').removeClass('active');
            };
            $scope.deleteProcess = function (process) {
                companyService.deleteProcess(process);
                $('.popup').removeClass('active');
            };
            $scope.close = function () {
                $('.popup').removeClass('active');
            };
        }
    ]);
