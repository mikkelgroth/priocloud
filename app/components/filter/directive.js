angular
    .module('riskApp')
    .directive('prioFilter', ['', function() {
        
        function linkFunction(scope, element, attrs) {
            
        }	
        
        return {
            restrict: 'A',
            scope: {
                filterModel: "=prioFilterModel",
                businessUnits: "=prioBusinessUnits",
                productOwners: "=prioProductOwners",
                productManagers: "=prioProductManagers",
                states: "=prioStates",
                audiences: "=prioAudiences",
                supports: "=prioSupports",
                orderModel: "=prioOrderModel",
                orderItems: "=prioOrderItems"
            },
            link: linkFunction
        };
    }]);
