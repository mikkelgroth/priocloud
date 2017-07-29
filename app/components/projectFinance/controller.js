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
                $scope.hasChanged=false;
            };

            
            $scope.saveNow = function () {
                var depd = new Date($("#depriciationdate")[0].value);
                if(depd instanceof Date && !isNaN(depd.valueOf())){$scope.project.depriciationdate=depd.toISOString();}
        
                $scope.hasChanged=true;               
            };

            function listenForViewChanges() {

                $scope.$watch(function () {

                    calculateForBudgetThisYear();
                    calculateForPosted();
                    calculateForDeviation();
                    calculateForNextYear();
                });
            }

            function calculateForDeviation(){
                $scope.project.finance.devcapextprev = ($scope.project.finance.budcapextprev - $scope.project.finance.postcapextprev);
                $scope.project.finance.devcapextq1 = ($scope.project.finance.budcapextq1 - $scope.project.finance.postcapextq1);
                $scope.project.finance.devcapextq2 = ($scope.project.finance.budcapextq2 - $scope.project.finance.postcapextq2);
                $scope.project.finance.devcapextq3 = ($scope.project.finance.budcapextq3 - $scope.project.finance.postcapextq3);
                $scope.project.finance.devcapextq4 = ($scope.project.finance.budcapextq4 - $scope.project.finance.postcapextq4);
                $scope.project.finance.devcapexExternal = ($scope.project.finance.budcapexExternal - $scope.project.finance.postcapexExternal);
                $scope.project.finance.devcapexExternalgrand = ($scope.project.finance.budcapexExternalgrand - $scope.project.finance.postcapexExternalgrand);
            
                $scope.project.finance.devcapintprev = ($scope.project.finance.budcapintprev - $scope.project.finance.postcapintprev);
                $scope.project.finance.devcapintq1 = ($scope.project.finance.budcapintq1 - $scope.project.finance.postcapintq1);
                $scope.project.finance.devcapintq2 = ($scope.project.finance.budcapintq2 - $scope.project.finance.postcapintq2);
                $scope.project.finance.devcapintq3 = ($scope.project.finance.budcapintq3 - $scope.project.finance.postcapintq3);
                $scope.project.finance.devcapintq4 = ($scope.project.finance.budcapintq4 - $scope.project.finance.postcapintq4);
                $scope.project.finance.devcapexInternal = ($scope.project.finance.budcapexInternal - $scope.project.finance.postcapexInternal);
                $scope.project.finance.devcapexInternalgrand = ($scope.project.finance.budcapexInternalgrand - $scope.project.finance.postcapexInternalgrand);
            
                $scope.project.finance.devcapexprevSum = ($scope.project.finance.budcapexprevSum - $scope.project.finance.postcapexprevSum);
                $scope.project.finance.devcapexq1Sum = ($scope.project.finance.budcapexq1Sum - $scope.project.finance.postcapexq1Sum);
                $scope.project.finance.devcapexq2Sum = ($scope.project.finance.budcapexq2Sum - $scope.project.finance.postcapexq2Sum);
                $scope.project.finance.devcapexq3Sum = ($scope.project.finance.budcapexq3Sum - $scope.project.finance.postcapexq3Sum);
                $scope.project.finance.devcapexq4Sum = ($scope.project.finance.budcapexq4Sum - $scope.project.finance.postcapexq4Sum);
                $scope.project.finance.devcapexTotal = ($scope.project.finance.budcapexTotal - $scope.project.finance.postcapexTotal);
                $scope.project.finance.devcapexTotalgrand = ($scope.project.finance.budcapexTotalgrand - $scope.project.finance.postcapexTotalgrand);
            
                $scope.project.finance.devopextprev = ($scope.project.finance.budopextprev - $scope.project.finance.postopextprev);
                $scope.project.finance.devopextq1 = ($scope.project.finance.budopextq1 - $scope.project.finance.postopextq1);
                $scope.project.finance.devopextq2 = ($scope.project.finance.budopextq2 - $scope.project.finance.postopextq2);
                $scope.project.finance.devopextq3 = ($scope.project.finance.budopextq3 - $scope.project.finance.postopextq3);
                $scope.project.finance.devopextq4 = ($scope.project.finance.budopextq4 - $scope.project.finance.postopextq4);
                $scope.project.finance.devopexExternal = ($scope.project.finance.budopexExternal - $scope.project.finance.postopexExternal);
                $scope.project.finance.devopexExternalgrand = ($scope.project.finance.budopexExternalgrand - $scope.project.finance.postopexExternalgrand);
            
                $scope.project.finance.devopintprev = ($scope.project.finance.budopintprev - $scope.project.finance.postopintprev);
                $scope.project.finance.devopintq1 = ($scope.project.finance.budopintq1 - $scope.project.finance.postopintq1);
                $scope.project.finance.devopintq2 = ($scope.project.finance.budopintq2 - $scope.project.finance.postopintq2);
                $scope.project.finance.devopintq3 = ($scope.project.finance.budopintq3 - $scope.project.finance.postopintq3);
                $scope.project.finance.devopintq4 = ($scope.project.finance.budopintq4 - $scope.project.finance.postopintq4);
                $scope.project.finance.devopexInternal = ($scope.project.finance.budopexInternal - $scope.project.finance.postopexInternal);
                $scope.project.finance.devopexInternalgrand = ($scope.project.finance.budopexInternalgrand - $scope.project.finance.postopexInternalgrand);
            
                $scope.project.finance.devopexprevSum = ($scope.project.finance.budopexprevSum - $scope.project.finance.postopexprevSum);
                $scope.project.finance.devopexq1Sum = ($scope.project.finance.budopexq1Sum - $scope.project.finance.postopexq1Sum);
                $scope.project.finance.devopexq2Sum = ($scope.project.finance.budopexq2Sum - $scope.project.finance.postopexq2Sum);
                $scope.project.finance.devopexq3Sum = ($scope.project.finance.budopexq3Sum - $scope.project.finance.postopexq3Sum);
                $scope.project.finance.devopexq4Sum = ($scope.project.finance.budopexq4Sum - $scope.project.finance.postopexq4Sum);
                $scope.project.finance.devopexTotal = ($scope.project.finance.budopexTotal - $scope.project.finance.postopexTotal);
                $scope.project.finance.devopexTotalgrand = ($scope.project.finance.budopexTotalgrand - $scope.project.finance.postopexTotalgrand);
            
                $scope.project.finance.devExternalprevTotal = ($scope.project.finance.budExternalprevTotal - $scope.project.finance.postExternalprevTotal);
                $scope.project.finance.devExternalq1Total = ($scope.project.finance.budExternalq1Total - $scope.project.finance.postExternalq1Total);
                $scope.project.finance.devExternalq2Total = ($scope.project.finance.budExternalq2Total - $scope.project.finance.postExternalq2Total);
                $scope.project.finance.devExternalq3Total = ($scope.project.finance.budExternalq3Total - $scope.project.finance.postExternalq3Total);
                $scope.project.finance.devExternalq4Total = ($scope.project.finance.budExternalq4Total - $scope.project.finance.postExternalq4Total);
                $scope.project.finance.devExternalTotalSum = ($scope.project.finance.budExternalTotalSum - $scope.project.finance.postExternalTotalSum);
                $scope.project.finance.devExternalTotalgrandSum = ($scope.project.finance.budExternalTotalgrandSum - $scope.project.finance.postExternalTotalgrandSum);
            
                $scope.project.finance.devInternalprevTotal = ($scope.project.finance.budInternalprevTotal -$scope.project.finance.postInternalprevTotal);
                $scope.project.finance.devInternalq1Total = ($scope.project.finance.budInternalq1Total - $scope.project.finance.postInternalq1Total);
                $scope.project.finance.devInternalq2Total = ($scope.project.finance.budInternalq2Total - $scope.project.finance.postInternalq2Total);
                $scope.project.finance.devInternalq3Total = ($scope.project.finance.budInternalq3Total - $scope.project.finance.postInternalq3Total);
                $scope.project.finance.devInternalq4Total = ($scope.project.finance.budInternalq4Total - $scope.project.finance.postInternalq4Total);
                $scope.project.finance.devInternalTotalSum = ($scope.project.finance.budInternalTotalSum - $scope.project.finance.postInternalTotalSum);
                $scope.project.finance.devInternalTotalgrandSum = ($scope.project.finance.budInternalTotalgrandSum - $scope.project.finance.postInternalTotalgrandSum);
            
                $scope.project.finance.devTotalprev = ($scope.project.finance.budTotalprev - $scope.project.finance.postTotalprev);
                $scope.project.finance.devTotalq1 = ($scope.project.finance.budTotalq1 - $scope.project.finance.postTotalq1);
                $scope.project.finance.devTotalq2 = ($scope.project.finance.budTotalq2 - $scope.project.finance.postTotalq2);
                $scope.project.finance.devTotalq3 = ($scope.project.finance.budTotalq3 - $scope.project.finance.postTotalq3);
                $scope.project.finance.devTotalq4 = ($scope.project.finance.budTotalq4 - $scope.project.finance.postTotalq4);
                $scope.project.finance.devTotalSum = ($scope.project.finance.budTotalSum - $scope.project.finance.postTotalSum);
                $scope.project.finance.devTotalgrandSum = ($scope.project.finance.budTotalgrandSum - $scope.project.finance.postTotalgrandSum);
            
                $scope.project.finance.devAccq1 = ($scope.project.finance.budAccq1 - $scope.project.finance.postAccq1);
                $scope.project.finance.devAccq2 = ($scope.project.finance.budAccq2 - $scope.project.finance.postAccq2);
                $scope.project.finance.devAccq3 = ($scope.project.finance.budAccq3 - $scope.project.finance.postAccq3);
                $scope.project.finance.devAccq4 = ($scope.project.finance.budAccq4 - $scope.project.finance.postAccq4);
                
            }

            function calculateForPosted() {

                // Capex
                $scope.project.finance.postcapexprevSum = Number($scope.project.finance.postcapextprev) + Number($scope.project.finance.postcapintprev);
                $scope.project.finance.postcapexq1Sum = Number($scope.project.finance.postcapextq1) + Number($scope.project.finance.postcapintq1);
                $scope.project.finance.postcapexq2Sum = Number($scope.project.finance.postcapextq2) + Number($scope.project.finance.postcapintq2);
                $scope.project.finance.postcapexq3Sum = Number($scope.project.finance.postcapextq3) + Number($scope.project.finance.postcapintq3);
                $scope.project.finance.postcapexq4Sum = Number($scope.project.finance.postcapextq4) + Number($scope.project.finance.postcapintq4);
                
                $scope.project.finance.postcapexExternal = Number($scope.project.finance.postcapextq1) + Number($scope.project.finance.postcapextq2) + Number($scope.project.finance.postcapextq3) + Number($scope.project.finance.postcapextq4);
                $scope.project.finance.postcapexExternalgrand = Number($scope.project.finance.postcapexExternal) + Number($scope.project.finance.postcapextprev);
                $scope.project.finance.postcapexInternal = Number($scope.project.finance.postcapintq1) + Number($scope.project.finance.postcapintq2) + Number($scope.project.finance.postcapintq3) + Number($scope.project.finance.postcapintq4);
                $scope.project.finance.postcapexInternalgrand = Number($scope.project.finance.postcapexInternal) + Number($scope.project.finance.postcapintprev);
                
                $scope.project.finance.postcapexTotal = ($scope.project.finance.postcapexExternal + $scope.project.finance.postcapexInternal);
                $scope.project.finance.postcapexTotalgrand = ($scope.project.finance.postcapexTotal + $scope.project.finance.postcapexprevSum);
            
                // Opex
                $scope.project.finance.postopexprevSum = Number($scope.project.finance.postopextprev) + Number($scope.project.finance.postopintprev);
                $scope.project.finance.postopexq1Sum = Number($scope.project.finance.postopextq1) + Number($scope.project.finance.postopintq1);
                $scope.project.finance.postopexq2Sum = Number($scope.project.finance.postopextq2) + Number($scope.project.finance.postopintq2);
                $scope.project.finance.postopexq3Sum = Number($scope.project.finance.postopextq3) + Number($scope.project.finance.postopintq3);
                $scope.project.finance.postopexq4Sum = Number($scope.project.finance.postopextq4) + Number($scope.project.finance.postopintq4);
                
                $scope.project.finance.postopexExternal = Number($scope.project.finance.postopextq1) + Number($scope.project.finance.postopextq2) + Number($scope.project.finance.postopextq3) + Number($scope.project.finance.postopextq4);
                $scope.project.finance.postopexExternalgrand = Number($scope.project.finance.postopexExternal) + Number($scope.project.finance.postopextprev);
                $scope.project.finance.postopexInternal = Number($scope.project.finance.postopintq1) + Number($scope.project.finance.postopintq2) + Number($scope.project.finance.postopintq3) + Number($scope.project.finance.postopintq4);
                $scope.project.finance.postopexInternalgrand = Number($scope.project.finance.postopexInternal) + Number($scope.project.finance.postopintprev);
                
                $scope.project.finance.postopexTotal = ($scope.project.finance.postopexExternal + $scope.project.finance.postopexInternal);
                $scope.project.finance.postopexTotalgrand = ($scope.project.finance.postopexTotal + $scope.project.finance.postopexprevSum);
            


                // Totals
                $scope.project.finance.postExternalprevTotal = Number($scope.project.finance.postcapextprev) + Number($scope.project.finance.postopextprev);
                $scope.project.finance.postExternalq1Total = Number($scope.project.finance.postcapextq1) + Number($scope.project.finance.postopextq1);
                $scope.project.finance.postExternalq2Total = Number($scope.project.finance.postcapextq2) + Number($scope.project.finance.postopextq2);
                $scope.project.finance.postExternalq3Total = Number($scope.project.finance.postcapextq3) + Number($scope.project.finance.postopextq3);
                $scope.project.finance.postExternalq4Total = Number($scope.project.finance.postcapextq4) + Number($scope.project.finance.postopextq4);

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
                $scope.project.finance.budcapexprevSum = Number($scope.project.finance.budcapextprev) + Number($scope.project.finance.budcapintprev);
                $scope.project.finance.budcapexq1Sum = Number($scope.project.finance.budcapextq1) + Number($scope.project.finance.budcapintq1);
                $scope.project.finance.budcapexq2Sum = Number($scope.project.finance.budcapextq2) + Number($scope.project.finance.budcapintq2);
                $scope.project.finance.budcapexq3Sum = Number($scope.project.finance.budcapextq3) + Number($scope.project.finance.budcapintq3);
                $scope.project.finance.budcapexq4Sum = Number($scope.project.finance.budcapextq4) + Number($scope.project.finance.budcapintq4);
                
                $scope.project.finance.budcapexExternal = Number($scope.project.finance.budcapextq1) + Number($scope.project.finance.budcapextq2) + Number($scope.project.finance.budcapextq3) + Number($scope.project.finance.budcapextq4);
                $scope.project.finance.budcapexExternalgrand = Number($scope.project.finance.budcapexExternal) + Number($scope.project.finance.budcapextprev);
                $scope.project.finance.budcapexInternal = Number($scope.project.finance.budcapintq1) + Number($scope.project.finance.budcapintq2) + Number($scope.project.finance.budcapintq3) + Number($scope.project.finance.budcapintq4);
                $scope.project.finance.budcapexInternalgrand = Number($scope.project.finance.budcapexInternal) + Number($scope.project.finance.budcapintprev);
                
                $scope.project.finance.budcapexTotal = ($scope.project.finance.budcapexExternal + $scope.project.finance.budcapexInternal);
                $scope.project.finance.budcapexTotalgrand = ($scope.project.finance.budcapexTotal + $scope.project.finance.budcapexprevSum);
            
                // Opex
                $scope.project.finance.budopexprevSum = Number($scope.project.finance.budopextprev) + Number($scope.project.finance.budopintprev);
                $scope.project.finance.budopexq1Sum = Number($scope.project.finance.budopextq1) + Number($scope.project.finance.budopintq1);
                $scope.project.finance.budopexq2Sum = Number($scope.project.finance.budopextq2) + Number($scope.project.finance.budopintq2);
                $scope.project.finance.budopexq3Sum = Number($scope.project.finance.budopextq3) + Number($scope.project.finance.budopintq3);
                $scope.project.finance.budopexq4Sum = Number($scope.project.finance.budopextq4) + Number($scope.project.finance.budopintq4);
                
                $scope.project.finance.budopexExternal = Number($scope.project.finance.budopextq1) + Number($scope.project.finance.budopextq2) + Number($scope.project.finance.budopextq3) + Number($scope.project.finance.budopextq4);
                $scope.project.finance.budopexExternalgrand = Number($scope.project.finance.budopexExternal) + Number($scope.project.finance.budopextprev);
                $scope.project.finance.budopexInternal = Number($scope.project.finance.budopintq1) + Number($scope.project.finance.budopintq2) + Number($scope.project.finance.budopintq3) + Number($scope.project.finance.budopintq4);
                $scope.project.finance.budopexInternalgrand = Number($scope.project.finance.budopexInternal) + Number($scope.project.finance.budopintprev);
                
                $scope.project.finance.budopexTotal = ($scope.project.finance.budopexExternal + $scope.project.finance.budopexInternal);
                $scope.project.finance.budopexTotalgrand = ($scope.project.finance.budopexTotal + $scope.project.finance.budopexprevSum);
            


                // Totals
                $scope.project.finance.budExternalprevTotal = Number($scope.project.finance.budcapextprev) + Number($scope.project.finance.budopextprev);
                $scope.project.finance.budExternalq1Total = Number($scope.project.finance.budcapextq1) + Number($scope.project.finance.budopextq1);
                $scope.project.finance.budExternalq2Total = Number($scope.project.finance.budcapextq2) + Number($scope.project.finance.budopextq2);
                $scope.project.finance.budExternalq3Total = Number($scope.project.finance.budcapextq3) + Number($scope.project.finance.budopextq3);
                $scope.project.finance.budExternalq4Total = Number($scope.project.finance.budcapextq4) + Number($scope.project.finance.budopextq4);

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

            function calculateForNextYear() {

                // Capex
                $scope.project.finance.nextcapexprevSum = Number($scope.project.finance.nextcapextprev) + Number($scope.project.finance.nextcapintprev);
                $scope.project.finance.nextcapexq1Sum = Number($scope.project.finance.nextcapextq1) + Number($scope.project.finance.nextcapintq1);
                $scope.project.finance.nextcapexq2Sum = Number($scope.project.finance.nextcapextq2) + Number($scope.project.finance.nextcapintq2);
                $scope.project.finance.nextcapexq3Sum = Number($scope.project.finance.nextcapextq3) + Number($scope.project.finance.nextcapintq3);
                $scope.project.finance.nextcapexq4Sum = Number($scope.project.finance.nextcapextq4) + Number($scope.project.finance.nextcapintq4);
                
                $scope.project.finance.nextcapexExternal = Number($scope.project.finance.nextcapextq1) + Number($scope.project.finance.nextcapextq2) + Number($scope.project.finance.nextcapextq3) + Number($scope.project.finance.nextcapextq4);
                $scope.project.finance.nextcapexExternalgrand = Number($scope.project.finance.nextcapexExternal) + Number($scope.project.finance.nextcapextprev);
                $scope.project.finance.nextcapexInternal = Number($scope.project.finance.nextcapintq1) + Number($scope.project.finance.nextcapintq2) + Number($scope.project.finance.nextcapintq3) + Number($scope.project.finance.nextcapintq4);
                $scope.project.finance.nextcapexInternalgrand = Number($scope.project.finance.nextcapexInternal) + Number($scope.project.finance.nextcapintprev);
                
                $scope.project.finance.nextcapexTotal = ($scope.project.finance.nextcapexExternal + $scope.project.finance.nextcapexInternal);
                $scope.project.finance.nextcapexTotalgrand = ($scope.project.finance.nextcapexTotal + $scope.project.finance.nextcapexprevSum);
            
                // Opex
                $scope.project.finance.nextopexprevSum = Number($scope.project.finance.nextopextprev) + Number($scope.project.finance.nextopintprev);
                $scope.project.finance.nextopexq1Sum = Number($scope.project.finance.nextopextq1) + Number($scope.project.finance.nextopintq1);
                $scope.project.finance.nextopexq2Sum = Number($scope.project.finance.nextopextq2) + Number($scope.project.finance.nextopintq2);
                $scope.project.finance.nextopexq3Sum = Number($scope.project.finance.nextopextq3) + Number($scope.project.finance.nextopintq3);
                $scope.project.finance.nextopexq4Sum = Number($scope.project.finance.nextopextq4) + Number($scope.project.finance.nextopintq4);
                
                $scope.project.finance.nextopexExternal = Number($scope.project.finance.nextopextq1) + Number($scope.project.finance.nextopextq2) + Number($scope.project.finance.nextopextq3) + Number($scope.project.finance.nextopextq4);
                $scope.project.finance.nextopexExternalgrand = Number($scope.project.finance.nextopexExternal) + Number($scope.project.finance.nextopextprev);
                $scope.project.finance.nextopexInternal = Number($scope.project.finance.nextopintq1) + Number($scope.project.finance.nextopintq2) + Number($scope.project.finance.nextopintq3) + Number($scope.project.finance.nextopintq4);
                $scope.project.finance.nextopexInternalgrand = Number($scope.project.finance.nextopexInternal) + Number($scope.project.finance.nextopintprev);
                
                $scope.project.finance.nextopexTotal = ($scope.project.finance.nextopexExternal + $scope.project.finance.nextopexInternal);
                $scope.project.finance.nextopexTotalgrand = ($scope.project.finance.nextopexTotal + $scope.project.finance.nextopexprevSum);
            


                // Totals
                $scope.project.finance.nextExternalprevTotal = Number($scope.project.finance.nextcapextprev) + Number($scope.project.finance.nextopextprev);
                $scope.project.finance.nextExternalq1Total = Number($scope.project.finance.nextcapextq1) + Number($scope.project.finance.nextopextq1);
                $scope.project.finance.nextExternalq2Total = Number($scope.project.finance.nextcapextq2) + Number($scope.project.finance.nextopextq2);
                $scope.project.finance.nextExternalq3Total = Number($scope.project.finance.nextcapextq3) + Number($scope.project.finance.nextopextq3);
                $scope.project.finance.nextExternalq4Total = Number($scope.project.finance.nextcapextq4) + Number($scope.project.finance.nextopextq4);

                $scope.project.finance.nextExternalTotalSum = $scope.project.finance.nextExternalq1Total + $scope.project.finance.nextExternalq2Total + $scope.project.finance.nextExternalq3Total + $scope.project.finance.nextExternalq4Total;
                $scope.project.finance.nextExternalTotalgrandSum = $scope.project.finance.nextExternalTotalSum + $scope.project.finance.nextExternalprevTotal;

                $scope.project.finance.nextInternalprevTotal = Number($scope.project.finance.nextopintprev) + Number($scope.project.finance.nextcapintprev);
                $scope.project.finance.nextInternalq1Total = Number($scope.project.finance.nextcapintq1) + Number($scope.project.finance.nextopintq1);
                $scope.project.finance.nextInternalq2Total = Number($scope.project.finance.nextcapintq2) + Number($scope.project.finance.nextopintq2);
                $scope.project.finance.nextInternalq3Total = Number($scope.project.finance.nextcapintq3) + Number($scope.project.finance.nextopintq3);
                $scope.project.finance.nextInternalq4Total = Number($scope.project.finance.nextcapintq4) + Number($scope.project.finance.nextopintq4);

                $scope.project.finance.nextInternalTotalSum = $scope.project.finance.nextInternalq1Total + $scope.project.finance.nextInternalq2Total + $scope.project.finance.nextInternalq3Total + $scope.project.finance.nextInternalq4Total;
                $scope.project.finance.nextInternalTotalgrandSum = $scope.project.finance.nextInternalTotalSum + $scope.project.finance.nextInternalprevTotal;

                $scope.project.finance.nextTotalprev = $scope.project.finance.nextExternalprevTotal + $scope.project.finance.nextInternalprevTotal;
                $scope.project.finance.nextTotalq1 = $scope.project.finance.nextExternalq1Total + $scope.project.finance.nextInternalq1Total;
                $scope.project.finance.nextTotalq2 = $scope.project.finance.nextExternalq2Total + $scope.project.finance.nextInternalq2Total;
                $scope.project.finance.nextTotalq3 = $scope.project.finance.nextExternalq3Total + $scope.project.finance.nextInternalq3Total;
                $scope.project.finance.nextTotalq4 = $scope.project.finance.nextExternalq4Total + $scope.project.finance.nextInternalq4Total;

                $scope.project.finance.nextTotalSum = $scope.project.finance.nextTotalq1 + $scope.project.finance.nextTotalq2 + $scope.project.finance.nextTotalq3 + $scope.project.finance.nextTotalq4;
                $scope.project.finance.nextTotalgrandSum = $scope.project.finance.nextTotalSum + $scope.project.finance.nextTotalprev;
            
                $scope.project.finance.nextAccq1 = $scope.project.finance.nextTotalq1;
                $scope.project.finance.nextAccq2 = $scope.project.finance.nextTotalq1 + $scope.project.finance.nextTotalq2;
                $scope.project.finance.nextAccq3 = $scope.project.finance.nextTotalq1 + $scope.project.finance.nextTotalq2 + $scope.project.finance.nextTotalq3;
                $scope.project.finance.nextAccq4 = $scope.project.finance.nextTotalq1 + $scope.project.finance.nextTotalq2 + $scope.project.finance.nextTotalq3 + $scope.project.finance.nextTotalq4;
            }

        }
    ]);
