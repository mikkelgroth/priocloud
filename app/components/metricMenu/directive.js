angular
    .module('riskApp')
    .directive('prioMetricMenu', [function () {

        function linkFunction(scope, element, attributes) {

        }

        return {
            restrict: 'E',
            replace: true,

            templateUrl: 'components/metricMenu/template.html',
            link: linkFunction

        };
    }]);



$(window).on('hashchange', function () {
    if (window.location.href.indexOf('metric') > 0) {
        setMetricMenu();
    }
}).trigger('hashchange');

function setMetricMenu() {
    if (window.location.href.indexOf('/') > 0) {
        $('.menuactive').removeClass('menuactive');
        $('.metric-menu-home').addClass('menuactive');
    }
    if (window.location.href.indexOf('/details') > 0) {
        $('.menuactive').removeClass('menuactive');
        $('.metric-menu-details').addClass('menuactive');
    }
    if (window.location.href.indexOf('/metricvalues') > 0) {
        $('.menuactive').removeClass('menuactive');
        $('.metric-menu-metricvalues').addClass('menuactive');
    }
}
