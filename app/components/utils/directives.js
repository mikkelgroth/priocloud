angular
    .module('riskApp')
    .directive('prioCsRender', [function () {

        function linkFunction(scope, element, attrs) {

            var cl = "Red";

            if (scope.prioCsRender != null) {

                if (scope.prioCsRender == 8 || scope.prioCsRender == 7 || scope.prioCsRender == 6) cl = "Green";
                if (scope.prioCsRender == 5 || scope.prioCsRender == 4) cl = "Yellow";
                if (scope.prioCsRender == 3 || scope.prioCsRender == 2) cl = "Orange";
            }

            element.addClass(cl);
        }

        return {
            restrict: 'A',
            scope: {
                prioCsRender: '=prioCsRender'
            },
            link: linkFunction
        };
    }])
    .directive('prioSkillRender$', [function () {

        function linkFunction(scope, element, attrs) {

            var cl = "Red";

            if (scope.prioSkillRender != null) {

                if (scope.prioSkillRender == 'Ok') cl = "Green";
                if (scope.prioSkillRender == 'Minor issue') cl = "Yellow";
                if (scope.prioSkillRender == 'Major issue') cl = "Orange";
            }

            element.addClass(cl);
        }

        return {
            restrict: 'A',
            scope: {
                prioSkillRender: '=prioSkillRender'
            },
            link: linkFunction
        };
    }])
    .directive('prioValueBarRender', [function () {

        function linkFunction(scope, element, attrs) {

            var cl = "Green";

            if (scope.prioValueBarRender != null) {

                if (scope.prioValueBarRender == 1) cl = "Red";
                if (scope.prioValueBarRender == 2) cl = "Orange";
                if (scope.prioValueBarRender == 3) cl = "Yellow";
            }

            element.addClass(cl);
        }

        return {
            restrict: 'A',
            scope: {
                prioValueBarRender: '=prioValueBarRender'
            },
            link: linkFunction
        };
    }])
    .directive('prioRiskBarRender', [function () {

        function linkFunction(scope, element, attrs) {

            var cl = "Red";

            if (scope.prioRiskBarRender != null) {

                if (scope.prioRiskBarRender == 1) cl = "Green";
                if (scope.prioRiskBarRender == 2) cl = "Yellow";
                if (scope.prioRiskBarRender == 3) cl = "Orange";
            }

            element.addClass(cl);
        }

        return {
            restrict: 'A',
            scope: {
                prioRiskBarRender: '=prioRiskBarRender'
            },
            link: linkFunction
        };
    }])
    .directive('prioKpiSizeRender', [function () {

        function linkFunction(scope, element, attrs) {

            var cl = "rad0";

            if (scope.prioKpiSizeRender != null) {

                if (scope.prioKpiSizeRender == '0') cl = "rad0";
                if (scope.prioKpiSizeRender == '10') cl = "rad1";
                if (scope.prioKpiSizeRender == '20') cl = "rad2";
                if (scope.prioKpiSizeRender == '40') cl = "rad3";
                if (scope.prioKpiSizeRender == '50') cl = "rad4";
                if (scope.prioKpiSizeRender == '70') cl = "rad5";
                if (scope.prioKpiSizeRender == '80') cl = "rad6";
                if (scope.prioKpiSizeRender == '100') cl = "rad7";
            }

            element.addClass(cl);
        }

        return {
            restrict: 'A',
            scope: {
                prioKpiSizeRender: '=prioKpiSizeRender'
            },
            link: linkFunction
        };
    }])
    .directive('prioSizeRender$', [function () {

        function linkFunction(scope, element, attrs) {

            var cl = "rad6";

            if (scope.prioSizeRender != null) {

                if (scope.prioSizeRender == 'No dependency') cl = "rad0";
                if (scope.prioSizeRender == 'Minor dependency') cl = "rad2";
                if (scope.prioSizeRender == 'Major dependency') cl = "rad4";
            }

            element.addClass(cl);
        }

        return {
            restrict: 'A',
            scope: {
                prioSizeRender: '=prioSizeRender'
            },
            link: linkFunction
        };
    }])
    .directive('prioClass', [function () {

        function linkFunction(scope, element, attrs) {

            var classList = [];

            if (scope.prioSizeRender == 'No dependency') classList.push("rad0");
            else if (scope.prioSizeRender == 'Minor dependency') classList.push("rad2");
            else if (scope.prioSizeRender == 'Major dependency') classList.push("rad4");
            else classList.push("rad6");

            if (scope.prioSkillRender == 'Ok') classList.push("Green");
            else if (scope.prioSkillRender == 'Minor issue') classList.push("Yellow");
            else if (scope.prioSkillRender == 'Major issue') classList.push("Orange");
            else classList.push("Red");

            element.addClass(classList.join(' '));
        }

        return {
            restrict: 'A',
            scope: {
                prioSizeRender: '=prioSizeRender',
                prioSkillRender: '=prioSkillRender'
            },
            link: linkFunction
        };
    }]);
