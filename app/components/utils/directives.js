angular
    .module('riskApp')
    .directive('prioClass', [function () {

        function linkFunction(scope, element, attrs) {

            var classList = [];

            if (scope.prioSizeRender == 'No dependency') classList.push("rad0");
            else if (scope.prioSizeRender == 'Minor dependency') classList.push("rad2");
            else if (scope.prioSizeRender == 'Major dependency') classList.push("rad4");
            else if (scope.prioSizeRender) classList.push("rad6");

            if (scope.prioSkillRender == 'Ok') classList.push("Green");
            else if (scope.prioSkillRender == 'Minor issue') classList.push("Yellow");
            else if (scope.prioSkillRender == 'Major issue') classList.push("Orange");
            else if (scope.prioSkillRender) classList.push("Red");

            if (scope.prioKpiSizeRender == '0') classList.push("rad0");
            else if (scope.prioKpiSizeRender == '10') classList.push("rad1");
            else if (scope.prioKpiSizeRender == '20') classList.push("rad2");
            else if (scope.prioKpiSizeRender == '40') classList.push("rad3");
            else if (scope.prioKpiSizeRender == '50') classList.push("rad4");
            else if (scope.prioKpiSizeRender == '70') classList.push("rad5");
            else if (scope.prioKpiSizeRender == '80') classList.push("rad6");
            else if (scope.prioKpiSizeRender == '100') classList.push("rad7");
            else if (scope.prioKpiSizeRender) classList.push("rad0");

            if (scope.prioValueBarRender == 1) classList.push("Red");
            else if (scope.prioValueBarRender == 2) classList.push("Orange");
            else if (scope.prioValueBarRender == 3) classList.push("Yellow");
            else if (scope.prioValueBarRender) classList.push("Green");

            if (scope.prioRiskBarRender == 1) classList.push("Green");
            else if (scope.prioRiskBarRender == 2) classList.push("Yellow");
            else if (scope.prioRiskBarRender == 3) classList.push("Orange");
            else if (scope.prioRiskBarRender) classList.push("Red");

            if (scope.prioCsRender == 8 || scope.prioCsRender == 7 || scope.prioCsRender == 6) classList.push("Green");
            else if (scope.prioCsRender == 5 || scope.prioCsRender == 4) classList.push("Yellow");
            else if (scope.prioCsRender == 3 || scope.prioCsRender == 2) classList.push("Orange");
            else if (scope.prioCsRender) classList.push("Red");

            element.addClass(classList.join(' '));
        }

        return {
            restrict: 'A',
            scope: {
                prioSizeRender: '=prioSizeRender',
                prioSkillRender: '=prioSkillRender',
                prioKpiSizeRender: '=prioKpiSizeRender',
                prioValueBarRender: '=prioValueBarRender',
                prioRiskBarRender: '=prioRiskBarRender',
                prioCsRender: '=prioCsRender'
            },
            link: linkFunction
        };
    }]);
