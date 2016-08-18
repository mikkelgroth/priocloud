angular
    .module('riskApp')
    .directive('prioCsRender', [function () {

        function linkFunction(scope, element, attrs) {

            var cl = "Red";

            if (scope.data != null) {

                if (scope.data == 8 || scope.data == 7 || scope.data == 6) cl = "Green";
                if (scope.data == 5 || scope.data == 4) cl = "Yellow";
                if (scope.data == 3 || scope.data == 2) cl = "Orange";
            }

            element.addClass(cl);
        }

        return {
            restrict: 'A',
            scope: {
                data: '=prioCsRender'
            },
            link: linkFunction
        };
    }])
    .directive('prioSkillRender', [function () {

        function linkFunction(scope, element, attrs) {

            var cl = "Red";

            if (scope.data != null) {

                if (scope.data == 'Ok') cl = "Green";
                if (scope.data == 'Minor issue') cl = "Yellow";
                if (scope.data == 'Major issue') cl = "Orange";
            }

            element.addClass(cl);
        }

        return {
            restrict: 'A',
            scope: {
                data: '=prioSkillRender'
            },
            link: linkFunction
        };
    }])
    .directive('prioValueBarRender', [function () {

        function linkFunction(scope, element, attrs) {

            var cl = "Green";

            if (scope.data != null) {

                if (scope.data == 1) cl = "Red";
                if (scope.data == 2) cl = "Orange";
                if (scope.data == 3) cl = "Yellow";
            }

            element.addClass(cl);
        }

        return {
            restrict: 'A',
            scope: {
                data: '=prioValueBarRender'
            },
            link: linkFunction
        };
    }])
    .directive('prioRiskBarRender', [function () {

        function linkFunction(scope, element, attrs) {

            var cl = "Red";

            if (scope.data != null) {

                if (scope.data == 1) cl = "Green";
                if (scope.data == 2) cl = "Yellow";
                if (scope.data == 3) cl = "Orange";
            }

            element.addClass(cl);
        }

        return {
            restrict: 'A',
            scope: {
                data: '=prioRiskBarRender'
            },
            link: linkFunction
        };
    }])
    .directive('prioKpiSizeRender', [function () {

        function linkFunction(scope, element, attrs) {

            var cl = "rad0";

            if (scope.data != null) {

                if (scope.data == '0') cl = "rad0";
                if (scope.data == '10') cl = "rad1";
                if (scope.data == '20') cl = "rad2";
                if (scope.data == '40') cl = "rad3";
                if (scope.data == '50') cl = "rad4";
                if (scope.data == '70') cl = "rad5";
                if (scope.data == '80') cl = "rad6";
                if (scope.data == '100') cl = "rad7";
            }

            element.addClass(cl);
        }

        return {
            restrict: 'A',
            scope: {
                data: '=prioKpiSizeRender'
            },
            link: linkFunction
        };
    }])
    .directive('prioSizeRender', [function () {

        function linkFunction(scope, element, attrs) {

            var cl = "rad6";

            if (scope.data != null) {

                if (scope.data == 'No dependency') cl = "rad0";
                if (scope.data == 'Minor dependency') cl = "rad2";
                if (scope.data == 'Major dependency') cl = "rad4";
            }

            element.addClass(cl);
        }

        return {
            restrict: 'A',
            scope: {
                data: '=prioSizeRender'
            },
            link: linkFunction
        };
    }]);
