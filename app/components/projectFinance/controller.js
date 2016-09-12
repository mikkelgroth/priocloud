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

            companyService
                .company
                .subscribe(function (company) {

                    $scope.company = company;
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

            function calculateForPosted() {

                // Capex
                $scope.project.finance.postcapexprevSum = Number($scope.project.finance.postcapextprev) + Number($scope.project.finance.postcapextoneprev) + Number($scope.project.finance.postcapintprev);
                $scope.project.finance.postcapexq1Sum = Number($scope.project.finance.postcapextq1) + Number($scope.project.finance.postcapextoneq1) + Number($scope.project.finance.postcapintq1);
                $scope.project.finance.postcapexq2Sum = Number($scope.project.finance.postcapextq2) + Number($scope.project.finance.postcapextoneq2) + Number($scope.project.finance.postcapintq2);
                $scope.project.finance.postcapexq3Sum = Number($scope.project.finance.postcapextq3) + Number($scope.project.finance.postcapextoneq3) + Number($scope.project.finance.postcapintq3);
                $scope.project.finance.postcapexq4Sum = Number($scope.project.finance.postcapextq4) + Number($scope.project.finance.postcapextoneq4) + Number($scope.project.finance.postcapintq4);
                
                $scope.project.finance.postcapexExternal = Number($scope.project.finance.postcapextq1) + Number($scope.project.finance.postcapextq2) + Number($scope.project.finance.postcapextq3) + Number($scope.project.finance.postcapextq4);
                $scope.project.finance.postcapexExternalgrand = Number($scope.project.finance.postcapexExternal) + Number($scope.project.finance.postcapextprev);
                $scope.project.finance.postcapexExtOff = Number($scope.project.finance.postcapextoneq1) + Number($scope.project.finance.postcapextoneq2) + Number($scope.project.finance.postcapextoneq3) + Number($scope.project.finance.postcapextoneq4);
                $scope.project.finance.postcapexExtOffgrand = Number($scope.project.finance.postcapexExtOff) + Number($scope.project.finance.postcapextoneprev);
                $scope.project.finance.postcapexInternal = Number($scope.project.finance.postcapintq1) + Number($scope.project.finance.postcapintq2) + Number($scope.project.finance.postcapintq3) + Number($scope.project.finance.postcapintq4);
                $scope.project.finance.postcapexInternalgrand = Number($scope.project.finance.postcapexInternal) + Number($scope.project.finance.postcapintprev);
                
                $scope.project.finance.postcapexTotal = ($scope.project.finance.postcapexExternal + $scope.project.finance.postcapexExtOff + $scope.project.finance.postcapexInternal);
                $scope.project.finance.postcapexTotalgrand = ($scope.project.finance.postcapexTotal + $scope.project.finance.postcapexprevSum);
            
                // Opex
                $scope.project.finance.postopexprevSum = Number($scope.project.finance.postopextprev) + Number($scope.project.finance.postopextoneprev) + Number($scope.project.finance.postopintprev);
                $scope.project.finance.postopexq1Sum = Number($scope.project.finance.postopextq1) + Number($scope.project.finance.postopextoneq1) + Number($scope.project.finance.postopintq1);
                $scope.project.finance.postopexq2Sum = Number($scope.project.finance.postopextq2) + Number($scope.project.finance.postopextoneq2) + Number($scope.project.finance.postopintq2);
                $scope.project.finance.postopexq3Sum = Number($scope.project.finance.postopextq3) + Number($scope.project.finance.postopextoneq3) + Number($scope.project.finance.postopintq3);
                $scope.project.finance.postopexq4Sum = Number($scope.project.finance.postopextq4) + Number($scope.project.finance.postopextoneq4) + Number($scope.project.finance.postopintq4);
                
                $scope.project.finance.postopexExternal = Number($scope.project.finance.postopextq1) + Number($scope.project.finance.postopextq2) + Number($scope.project.finance.postopextq3) + Number($scope.project.finance.postopextq4);
                $scope.project.finance.postopexExternalgrand = Number($scope.project.finance.postopexExternal) + Number($scope.project.finance.postopextprev);
                $scope.project.finance.postopexExtOff = Number($scope.project.finance.postopextoneq1) + Number($scope.project.finance.postopextoneq2) + Number($scope.project.finance.postopextoneq3) + Number($scope.project.finance.postopextoneq4);
                $scope.project.finance.postopexExtOffgrand = Number($scope.project.finance.postopexExtOff) + Number($scope.project.finance.postopextoneprev);
                $scope.project.finance.postopexInternal = Number($scope.project.finance.postopintq1) + Number($scope.project.finance.postopintq2) + Number($scope.project.finance.postopintq3) + Number($scope.project.finance.postopintq4);
                $scope.project.finance.postopexInternalgrand = Number($scope.project.finance.postopexInternal) + Number($scope.project.finance.postopintprev);
                
                $scope.project.finance.postopexTotal = ($scope.project.finance.postopexExternal + $scope.project.finance.postopexExtOff + $scope.project.finance.postopexInternal);
                $scope.project.finance.postopexTotalgrand = ($scope.project.finance.postopexTotal + $scope.project.finance.postopexprevSum);
            


                // Totals
                $scope.project.finance.postExternalprevTotal = Number($scope.project.finance.postcapextprev) + Number($scope.project.finance.postcapextoneprev) + Number($scope.project.finance.postopextprev) + Number($scope.project.finance.postopextoneprev);
                $scope.project.finance.postExternalq1Total = Number($scope.project.finance.postcapextq1) + Number($scope.project.finance.postcapextoneq1) + Number($scope.project.finance.postopextq1) + Number($scope.project.finance.postopextoneq1);
                $scope.project.finance.postExternalq2Total = Number($scope.project.finance.postcapextq2) + Number($scope.project.finance.postcapextoneq2) + Number($scope.project.finance.postopextq2) + Number($scope.project.finance.postopextoneq2);
                $scope.project.finance.postExternalq3Total = Number($scope.project.finance.postcapextq3) + Number($scope.project.finance.postcapextoneq3) + Number($scope.project.finance.postopextq3) + Number($scope.project.finance.postopextoneq3);
                $scope.project.finance.postExternalq4Total = Number($scope.project.finance.postcapextq4) + Number($scope.project.finance.postcapextoneq4) + Number($scope.project.finance.postopextq4) + Number($scope.project.finance.postopextoneq4);

                $scope.project.finance.postExternalTotalSum = $scope.project.finance.postExternalq1Total + $scope.project.finance.postExternalq2Total + $scope.project.finance.postExternalq3Total + $scope.project.finance.postExternalq4Total;
                $scope.project.finance.postExternalTotalgrandSum = $scope.project.finance.postExternalTotalSum + $scope.project.finance.postExternalprevTotal;

                $scope.project.finance.postInternalprevTotal = Number($scope.project.finance.postopintprev) + Number($scope.project.finance.postcapintprev);
                $scope.project.finance.postInternalq1Total = Number($scope.project.finance.postcapintq1) + Number($scope.project.finance.postopintq1);
                $scope.project.finance.postInternalq2Total = Number($scope.project.finance.postcapintq2) + Number($scope.project.finance.postopintq2);
                $scope.project.finance.postInternalq3Total = Number($scope.project.finance.postcapintq3) + Number($scope.project.finance.postopintq3);
                $scope.project.finance.postInternalq4Total = Number($scope.project.finance.postcapintq4) + Number($scope.project.finance.postopintq4);

                $scope.project.finance.postInternalTotalSum = $scope.project.finance.postInternalq1Total + $scope.project.finance.postInternalq2Total + $scope.project.finance.postInternalq3Total + $scope.project.finance.postInternalq4Total;
                $scope.project.finance.postInternalTotalgrandSum = $scope.project.finance.postInternalTotalSum + $scope.project.finance.postInternalprevTotal;

                $scope.project.finance.postTotalprev = $scope.project.finance.postExternalprevTotal + $scope.project.finance.postInternalprevTotal;
                $scope.project.finance.postTotalq1 = $scope.project.finance.postExternalq1Total + $scope.project.finance.postInternalq1Total;
                $scope.project.finance.postTotalq2 = $scope.project.finance.postExternalq2Total + $scope.project.finance.postInternalq2Total;
                $scope.project.finance.postTotalq3 = $scope.project.finance.postExternalq3Total + $scope.project.finance.postInternalq3Total;
                $scope.project.finance.postTotalq4 = $scope.project.finance.postExternalq4Total + $scope.project.finance.postInternalq4Total;

                $scope.project.finance.postTotalSum = $scope.project.finance.postTotalq1 + $scope.project.finance.postTotalq2 + $scope.project.finance.postTotalq3 + $scope.project.finance.postTotalq4;
                $scope.project.finance.postTotalgrandSum = $scope.project.finance.postTotalSum + $scope.project.finance.postTotalprev;
            
                $scope.project.finance.postAccq1 = $scope.project.finance.postTotalq1;
                $scope.project.finance.postAccq2 = $scope.project.finance.postTotalq1 + $scope.project.finance.postTotalq2;
                $scope.project.finance.postAccq3 = $scope.project.finance.postTotalq1 + $scope.project.finance.postTotalq2 + $scope.project.finance.postTotalq3;
                $scope.project.finance.postAccq4 = $scope.project.finance.postTotalq1 + $scope.project.finance.postTotalq2 + $scope.project.finance.postTotalq3 + $scope.project.finance.postTotalq4;
            }

            function calculateForBudgetThisYear() {

                // Capex
                $scope.project.finance.budcapexprevSum = Number($scope.project.finance.budcapextprev) + Number($scope.project.finance.budcapextoneprev) + Number($scope.project.finance.budcapintprev);
                $scope.project.finance.budcapexq1Sum = Number($scope.project.finance.budcapextq1) + Number($scope.project.finance.budcapextoneq1) + Number($scope.project.finance.budcapintq1);
                $scope.project.finance.budcapexq2Sum = Number($scope.project.finance.budcapextq2) + Number($scope.project.finance.budcapextoneq2) + Number($scope.project.finance.budcapintq2);
                $scope.project.finance.budcapexq3Sum = Number($scope.project.finance.budcapextq3) + Number($scope.project.finance.budcapextoneq3) + Number($scope.project.finance.budcapintq3);
                $scope.project.finance.budcapexq4Sum = Number($scope.project.finance.budcapextq4) + Number($scope.project.finance.budcapextoneq4) + Number($scope.project.finance.budcapintq4);
                
                $scope.project.finance.budcapexExternal = Number($scope.project.finance.budcapextq1) + Number($scope.project.finance.budcapextq2) + Number($scope.project.finance.budcapextq3) + Number($scope.project.finance.budcapextq4);
                $scope.project.finance.budcapexExternalgrand = Number($scope.project.finance.budcapexExternal) + Number($scope.project.finance.budcapextprev);
                $scope.project.finance.budcapexExtOff = Number($scope.project.finance.budcapextoneq1) + Number($scope.project.finance.budcapextoneq2) + Number($scope.project.finance.budcapextoneq3) + Number($scope.project.finance.budcapextoneq4);
                $scope.project.finance.budcapexExtOffgrand = Number($scope.project.finance.budcapexExtOff) + Number($scope.project.finance.budcapextoneprev);
                $scope.project.finance.budcapexInternal = Number($scope.project.finance.budcapintq1) + Number($scope.project.finance.budcapintq2) + Number($scope.project.finance.budcapintq3) + Number($scope.project.finance.budcapintq4);
                $scope.project.finance.budcapexInternalgrand = Number($scope.project.finance.budcapexInternal) + Number($scope.project.finance.budcapintprev);
                
                $scope.project.finance.budcapexTotal = ($scope.project.finance.budcapexExternal + $scope.project.finance.budcapexExtOff + $scope.project.finance.budcapexInternal);
                $scope.project.finance.budcapexTotalgrand = ($scope.project.finance.budcapexTotal + $scope.project.finance.budcapexprevSum);
            
                // Opex
                $scope.project.finance.budopexprevSum = Number($scope.project.finance.budopextprev) + Number($scope.project.finance.budopextoneprev) + Number($scope.project.finance.budopintprev);
                $scope.project.finance.budopexq1Sum = Number($scope.project.finance.budopextq1) + Number($scope.project.finance.budopextoneq1) + Number($scope.project.finance.budopintq1);
                $scope.project.finance.budopexq2Sum = Number($scope.project.finance.budopextq2) + Number($scope.project.finance.budopextoneq2) + Number($scope.project.finance.budopintq2);
                $scope.project.finance.budopexq3Sum = Number($scope.project.finance.budopextq3) + Number($scope.project.finance.budopextoneq3) + Number($scope.project.finance.budopintq3);
                $scope.project.finance.budopexq4Sum = Number($scope.project.finance.budopextq4) + Number($scope.project.finance.budopextoneq4) + Number($scope.project.finance.budopintq4);
                
                $scope.project.finance.budopexExternal = Number($scope.project.finance.budopextq1) + Number($scope.project.finance.budopextq2) + Number($scope.project.finance.budopextq3) + Number($scope.project.finance.budopextq4);
                $scope.project.finance.budopexExternalgrand = Number($scope.project.finance.budopexExternal) + Number($scope.project.finance.budopextprev);
                $scope.project.finance.budopexExtOff = Number($scope.project.finance.budopextoneq1) + Number($scope.project.finance.budopextoneq2) + Number($scope.project.finance.budopextoneq3) + Number($scope.project.finance.budopextoneq4);
                $scope.project.finance.budopexExtOffgrand = Number($scope.project.finance.budopexExtOff) + Number($scope.project.finance.budopextoneprev);
                $scope.project.finance.budopexInternal = Number($scope.project.finance.budopintq1) + Number($scope.project.finance.budopintq2) + Number($scope.project.finance.budopintq3) + Number($scope.project.finance.budopintq4);
                $scope.project.finance.budopexInternalgrand = Number($scope.project.finance.budopexInternal) + Number($scope.project.finance.budopintprev);
                
                $scope.project.finance.budopexTotal = ($scope.project.finance.budopexExternal + $scope.project.finance.budopexExtOff + $scope.project.finance.budopexInternal);
                $scope.project.finance.budopexTotalgrand = ($scope.project.finance.budopexTotal + $scope.project.finance.budopexprevSum);
            


                // Totals
                $scope.project.finance.budExternalprevTotal = Number($scope.project.finance.budcapextprev) + Number($scope.project.finance.budcapextoneprev) + Number($scope.project.finance.budopextprev) + Number($scope.project.finance.budopextoneprev);
                $scope.project.finance.budExternalq1Total = Number($scope.project.finance.budcapextq1) + Number($scope.project.finance.budcapextoneq1) + Number($scope.project.finance.budopextq1) + Number($scope.project.finance.budopextoneq1);
                $scope.project.finance.budExternalq2Total = Number($scope.project.finance.budcapextq2) + Number($scope.project.finance.budcapextoneq2) + Number($scope.project.finance.budopextq2) + Number($scope.project.finance.budopextoneq2);
                $scope.project.finance.budExternalq3Total = Number($scope.project.finance.budcapextq3) + Number($scope.project.finance.budcapextoneq3) + Number($scope.project.finance.budopextq3) + Number($scope.project.finance.budopextoneq3);
                $scope.project.finance.budExternalq4Total = Number($scope.project.finance.budcapextq4) + Number($scope.project.finance.budcapextoneq4) + Number($scope.project.finance.budopextq4) + Number($scope.project.finance.budopextoneq4);

                $scope.project.finance.budExternalTotalSum = $scope.project.finance.budExternalq1Total + $scope.project.finance.budExternalq2Total + $scope.project.finance.budExternalq3Total + $scope.project.finance.budExternalq4Total;
                $scope.project.finance.budExternalTotalgrandSum = $scope.project.finance.budExternalTotalSum + $scope.project.finance.budExternalprevTotal;

                $scope.project.finance.budInternalprevTotal = Number($scope.project.finance.budopintprev) + Number($scope.project.finance.budcapintprev);
                $scope.project.finance.budInternalq1Total = Number($scope.project.finance.budcapintq1) + Number($scope.project.finance.budopintq1);
                $scope.project.finance.budInternalq2Total = Number($scope.project.finance.budcapintq2) + Number($scope.project.finance.budopintq2);
                $scope.project.finance.budInternalq3Total = Number($scope.project.finance.budcapintq3) + Number($scope.project.finance.budopintq3);
                $scope.project.finance.budInternalq4Total = Number($scope.project.finance.budcapintq4) + Number($scope.project.finance.budopintq4);

                $scope.project.finance.budInternalTotalSum = $scope.project.finance.budInternalq1Total + $scope.project.finance.budInternalq2Total + $scope.project.finance.budInternalq3Total + $scope.project.finance.budInternalq4Total;
                $scope.project.finance.budInternalTotalgrandSum = $scope.project.finance.budInternalTotalSum + $scope.project.finance.budInternalprevTotal;

                $scope.project.finance.budTotalprev = $scope.project.finance.budExternalprevTotal + $scope.project.finance.budInternalprevTotal;
                $scope.project.finance.budTotalq1 = $scope.project.finance.budExternalq1Total + $scope.project.finance.budInternalq1Total;
                $scope.project.finance.budTotalq2 = $scope.project.finance.budExternalq2Total + $scope.project.finance.budInternalq2Total;
                $scope.project.finance.budTotalq3 = $scope.project.finance.budExternalq3Total + $scope.project.finance.budInternalq3Total;
                $scope.project.finance.budTotalq4 = $scope.project.finance.budExternalq4Total + $scope.project.finance.budInternalq4Total;

                $scope.project.finance.budTotalSum = $scope.project.finance.budTotalq1 + $scope.project.finance.budTotalq2 + $scope.project.finance.budTotalq3 + $scope.project.finance.budTotalq4;
                $scope.project.finance.budTotalgrandSum = $scope.project.finance.budTotalSum + $scope.project.finance.budTotalprev;
            
                $scope.project.finance.budAccq1 = $scope.project.finance.budTotalq1;
                $scope.project.finance.budAccq2 = $scope.project.finance.budTotalq1 + $scope.project.finance.budTotalq2;
                $scope.project.finance.budAccq3 = $scope.project.finance.budTotalq1 + $scope.project.finance.budTotalq2 + $scope.project.finance.budTotalq3;
                $scope.project.finance.budAccq4 = $scope.project.finance.budTotalq1 + $scope.project.finance.budTotalq2 + $scope.project.finance.budTotalq3 + $scope.project.finance.budTotalq4;
            }
        }
    ]);
