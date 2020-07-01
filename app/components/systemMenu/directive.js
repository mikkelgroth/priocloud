angular
    .module('riskApp')
    .directive('prioSystemMenu', [function () {

        function linkFunction(scope, element, attributes) {

        }

        return {
            restrict: 'E',
            replace: true,

            templateUrl: 'components/systemMenu/template.html',
            link: linkFunction

        };
    }]);



$(window).on('hashchange', function () {
    if (window.location.href.indexOf('system') > 0) {
        setSystemMenu();
    }
}).trigger('hashchange');

function setSystemMenu() {
    if (window.location.href.indexOf('/') > 0) {
        $('.menuactive').removeClass('menuactive');
        $('.system-menu-home').addClass('menuactive');
    }
    if (window.location.href.indexOf('/details') > 0) {
        $('.menuactive').removeClass('menuactive');
        $('.system-menu-details').addClass('menuactive');
    }
    if (window.location.href.indexOf('/dpia') > 0) {
        $('.menuactive').removeClass('menuactive');
        $('.system-menu-dpia').addClass('menuactive');
    }
    if (window.location.href.indexOf('/access') > 0) {
        $('.menuactive').removeClass('menuactive');
        $('.system-menu-access').addClass('menuactive');
    }
    if (window.location.href.indexOf('/perimeter') > 0) {
        $('.menuactive').removeClass('menuactive');
        $('.system-menu-perimeter').addClass('menuactive');
    }
    if (window.location.href.indexOf('/data') > 0) {
        $('.menuactive').removeClass('menuactive');
        $('.system-menu-data').addClass('menuactive');
    }
    if (window.location.href.indexOf('/connections') > 0) {
        $('.menuactive').removeClass('menuactive');
        $('.system-menu-connections').addClass('menuactive');
    }
    if (window.location.href.indexOf('/continuity') > 0) {
        $('.menuactive').removeClass('menuactive');
        $('.system-menu-continuity').addClass('menuactive');
    }
}