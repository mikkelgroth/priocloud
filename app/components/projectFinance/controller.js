angular
    .module('riskApp')
    .controller('ProjectFinanceController', [
        '$scope',
        '$routeParams',
        '$location',
        'userService',
        'companyService',
        'routeService',
        function (
            $scope,
            $routeParams,
            $location,
            userService,
            companyService,
            routeService
        ) {

            var projectId = $routeParams.id;

            userService
                .user
                .subscribe(function (user) {

                    $scope.user = user;
                });

            companyService
                .getProject(projectId)
                .subscribe(function (project) {

                    $scope.project = project;

                    listenForViewChanges();
                });

            companyService
                .businessUnits
                .subscribe(function (units) {

                    $scope.bus = units;
                });

            userService
                .users
                .subscribe(function (users) {

                    $scope.users = users;
                });

            routeService
                .route
                .subscribe(function (route) {

                    $scope.route = route.substring(route.lastIndexOf('/')+1);
                });

            $scope.saveProject = function (project) {

                companyService.saveProject(project);
            };

            function listenForViewChanges() {

                $scope.$watch(function () {

                    calculateForBudgetThisYear();
                    calculateForPosted();
                });
            }

            function calculateForBudgetThisYear() {

                // Capex
                $scope.project.finance.budcapexq1Sum = Number($scope.project.finance.budcapextq1) + Number($scope.project.finance.budcapextoneq1) + Number($scope.project.finance.budcapintq1);
                $scope.project.finance.budcapexq2Sum = Number($scope.project.finance.budcapextq2) + Number($scope.project.finance.budcapextoneq2) + Number($scope.project.finance.budcapintq2);
                $scope.project.finance.budcapexq3Sum = Number($scope.project.finance.budcapextq3) + Number($scope.project.finance.budcapextoneq3) + Number($scope.project.finance.budcapintq3);
                $scope.project.finance.budcapexq4Sum = Number($scope.project.finance.budcapextq4) + Number($scope.project.finance.budcapextoneq4) + Number($scope.project.finance.budcapintq4);
                
                $scope.project.finance.budcapexExternal = Number($scope.project.finance.budcapextq1) + Number($scope.project.finance.budcapextq2) + Number($scope.project.finance.budcapextq3) + Number($scope.project.finance.budcapextq4);
                $scope.project.finance.budcapexExtOff = Number($scope.project.finance.budcapextoneq1) + Number($scope.project.finance.budcapextoneq2) + Number($scope.project.finance.budcapextoneq3) + Number($scope.project.finance.budcapextoneq4);
                $scope.project.finance.budcapexInternal = Number($scope.project.finance.budcapintq1) + Number($scope.project.finance.budcapintq2) + Number($scope.project.finance.budcapintq3) + Number($scope.project.finance.budcapintq4);
                
                $scope.project.finance.budcapexTotal = ($scope.project.finance.budcapexExternal + $scope.project.finance.budcapexExtOff + $scope.project.finance.budcapexInternal);
            
                // Opex
                $scope.project.finance.budopexq1Sum = Number($scope.project.finance.budopextq1) + Number($scope.project.finance.budopintq1);
                $scope.project.finance.budopexq2Sum = Number($scope.project.finance.budopextq2) + Number($scope.project.finance.budopintq2);
                $scope.project.finance.budopexq3Sum = Number($scope.project.finance.budopextq3) + Number($scope.project.finance.budopintq3);
                $scope.project.finance.budopexq4Sum = Number($scope.project.finance.budopextq4) + Number($scope.project.finance.budopintq4);
                
                $scope.project.finance.budopexExternal = Number($scope.project.finance.budopextq1) + Number($scope.project.finance.budopextq2) + Number($scope.project.finance.budopextq3) + Number($scope.project.finance.budopextq4);
                $scope.project.finance.budopexInternal = Number($scope.project.finance.budopintq1) + Number($scope.project.finance.budopintq2) + Number($scope.project.finance.budopintq3) + Number($scope.project.finance.budopintq4);
                
                $scope.project.finance.budopexTotal = ($scope.project.finance.budopexExternal + $scope.project.finance.budopexInternal);
            
                $scope.project.finance.budExternalq1Total = Number($scope.project.finance.budcapextq1) + Number($scope.project.finance.budcapextoneq1) + Number($scope.project.finance.budopextq1);
                $scope.project.finance.budExternalq2Total = Number($scope.project.finance.budcapextq2) + Number($scope.project.finance.budcapextoneq2) + Number($scope.project.finance.budopextq2);
                $scope.project.finance.budExternalq3Total = Number($scope.project.finance.budcapextq3) + Number($scope.project.finance.budcapextoneq3) + Number($scope.project.finance.budopextq3);
                $scope.project.finance.budExternalq4Total = Number($scope.project.finance.budcapextq4) + Number($scope.project.finance.budcapextoneq4) + Number($scope.project.finance.budopextq4);

                $scope.project.finance.budExternalTotalSum = $scope.project.finance.budExternalq1Total + $scope.project.finance.budExternalq2Total + $scope.project.finance.budExternalq3Total + $scope.project.finance.budExternalq4Total;

                $scope.project.finance.budInternalq1Total = Number($scope.project.finance.budcapintq1) + Number($scope.project.finance.budopintq1);
                $scope.project.finance.budInternalq2Total = Number($scope.project.finance.budcapintq2) + Number($scope.project.finance.budopintq2);
                $scope.project.finance.budInternalq3Total = Number($scope.project.finance.budcapintq3) + Number($scope.project.finance.budopintq3);
                $scope.project.finance.budInternalq4Total = Number($scope.project.finance.budcapintq4) + Number($scope.project.finance.budopintq4);

                $scope.project.finance.budInternalTotalSum = $scope.project.finance.budInternalq1Total + $scope.project.finance.budInternalq2Total + $scope.project.finance.budInternalq3Total + $scope.project.finance.budInternalq4Total;

                $scope.project.finance.budTotalq1 = $scope.project.finance.budExternalq1Total + $scope.project.finance.budInternalq1Total;
                $scope.project.finance.budTotalq2 = $scope.project.finance.budExternalq2Total + $scope.project.finance.budInternalq2Total;
                $scope.project.finance.budTotalq3 = $scope.project.finance.budExternalq3Total + $scope.project.finance.budInternalq3Total;
                $scope.project.finance.budTotalq4 = $scope.project.finance.budExternalq4Total + $scope.project.finance.budInternalq4Total;

                $scope.project.finance.budTotalSum = $scope.project.finance.budTotalq1 + $scope.project.finance.budTotalq2 + $scope.project.finance.budTotalq3 + $scope.project.finance.budTotalq4;
            
                $scope.project.finance.budAccq1 = $scope.project.finance.budTotalq1;
                $scope.project.finance.budAccq2 = $scope.project.finance.budTotalq1 + $scope.project.finance.budTotalq2;
                $scope.project.finance.budAccq3 = $scope.project.finance.budTotalq1 + $scope.project.finance.budTotalq2 + $scope.project.finance.budTotalq3;
                $scope.project.finance.budAccq4 = $scope.project.finance.budTotalq1 + $scope.project.finance.budTotalq2 + $scope.project.finance.budTotalq3 + $scope.project.finance.budTotalq4;
            }
        }
    ]);
