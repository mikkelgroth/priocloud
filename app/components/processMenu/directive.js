angular
    .module('riskApp')
    .directive('prioProcessMenu', [function () {

        function linkFunction(scope, element, attributes) {

        }

        return {
            restrict: 'E',
            replace: true,

            templateUrl: 'components/processMenu/template.html',
            link: linkFunction

        };
    }]);



$(window).on('hashchange', function () {
    if (window.location.href.indexOf('process') > 0) {
        setProcessMenu();
    }
}).trigger('hashchange');

function setProcessMenu() {
    if (window.location.href.indexOf('/') > 0) {
        $('.menuactive').removeClass('menuactive');
        $('.process-menu-home').addClass('menuactive');
    }
    if (window.location.href.indexOf('/details') > 0) {
        $('.menuactive').removeClass('menuactive');
        $('.process-menu-details').addClass('menuactive');
    }
    if (window.location.href.indexOf('/steps') > 0) {
        $('.menuactive').removeClass('menuactive');
        $('.process-menu-steps').addClass('menuactive');
    }
}
