angular
    .module('riskApp')
    .controller('DashboardController', [
        '$scope', 
        '$rootScope',
        function (
            $scope, 
            $rootScope
        ) {

            console.log("DashboardController init");

        }
    ]);
