angular
    .module('riskApp')
    .controller('PriceengineController', [
        '$scope', 
        function (
            $scope
        ) {
            $scope.priceengine = {};
            $scope.priceengine.Basic = true;
            
            //Prices
            $scope.priceengine.NrUsers = 5;
            $scope.priceengine.NrViewUsers = 10;
            $scope.priceengine.NrViewUsersPrice = 0.10
            $scope.priceengine.BasicPrice = 1.00;
            $scope.priceengine.POsectionPrice = 0.20;
            $scope.priceengine.StatusPrice = 0.30;
            $scope.priceengine.SteercoPrice = 0.30;
            $scope.priceengine.ActionpointsPrice = 0.50;
            $scope.priceengine.DeliverablesPrice = 0.50;
            $scope.priceengine.FinancePrice = 0.50;
            $scope.priceengine.IssuesPrice = 0.50;
            $scope.priceengine.DependPrice = 0.50;
            $scope.priceengine.ResourceOverviewPrice = 1.00;
            
            $scope.priceengine.StrategyPrice = 2.00;

            $scope.priceengine.SystemPrice = 2.00;
            $scope.priceengine.ProcessPrice = 2.00;
            $scope.priceengine.GDPRPrice = 3.00;

            $scope.priceengine.monthlycost = 0;
            $scope.priceengine.monthlyusercost = 0;
            $scope.priceengine.yearlydiscount = 40;
            $scope.priceengine.yearlycost = 0;
            $scope.priceengine.minimumfee = 29;
            updateprice();

            function updateprice() {
                var priceperviewuser = $scope.priceengine.NrViewUsers * $scope.priceengine.NrViewUsersPrice;
                var priceperuser = 0;

                if($scope.priceengine.Basic)priceperuser += $scope.priceengine.BasicPrice;
                if($scope.priceengine.POsection)priceperuser += $scope.priceengine.POsectionPrice;
                if($scope.priceengine.Status)priceperuser += $scope.priceengine.StatusPrice;
                if($scope.priceengine.Actionpoints)priceperuser += $scope.priceengine.ActionpointsPrice;
                if($scope.priceengine.Deliverables)priceperuser += $scope.priceengine.DeliverablesPrice;
                if($scope.priceengine.Finance)priceperuser += $scope.priceengine.FinancePrice;
                if($scope.priceengine.Issues)priceperuser += $scope.priceengine.IssuesPrice;
                if($scope.priceengine.Depend)priceperuser += $scope.priceengine.DependPrice;
                if($scope.priceengine.ResourceOverview)priceperuser += $scope.priceengine.ResourceOverviewPrice;
                if($scope.priceengine.GDPR)priceperuser += $scope.priceengine.GDPRPrice;
                
                if($scope.priceengine.Strategy)priceperuser += $scope.priceengine.StrategyPrice;
                
                if($scope.priceengine.System)priceperuser += $scope.priceengine.SystemPrice;
                if($scope.priceengine.Process)priceperuser += $scope.priceengine.ProcessPrice;
                if($scope.priceengine.Steerco)priceperuser += $scope.priceengine.SteercoPrice;

                $scope.priceengine.monthlyusercost = priceperuser;
                $scope.priceengine.monthlycost = Math.max(Math.ceil(priceperuser * $scope.priceengine.NrUsers) + priceperviewuser, $scope.priceengine.minimumfee);
                $scope.priceengine.yearlycost = Math.max(((Math.ceil(priceperuser * $scope.priceengine.NrUsers) + priceperviewuser) * 12 * (100-$scope.priceengine.yearlydiscount) / 100), $scope.priceengine.minimumfee);
            }
            
            $scope.updatepriceengine = function () {
                if (Number($scope.priceengine.NrUsers)!=undefined && Number($scope.priceengine.NrViewUsers)!=undefined) {
                    updateprice();
                }
            };
        }
    ]);
