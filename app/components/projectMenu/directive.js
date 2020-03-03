angular
    .module('riskApp')
    .directive('prioProjectMenu', [function () {

        function linkFunction(scope, element, attributes) {

        }

        return {
            restrict: 'E',
            replace: true,
           
            templateUrl: 'components/projectMenu/template.html',
            link: linkFunction

        };
    }]);



$(window).bind('hashchange', function () {
    setMenu();
});

$(document).ready(function () {
    setInterval(function () {
        setMenu();

    }, 200)
});

function setMenu() {

    if (window.location.href.indexOf('/') > 0) {
        $('.menuactive').removeClass('menuactive');
        $('.project-menu-home').addClass('menuactive');
    }
    if (window.location.href.indexOf('/finance') > 0) {
        $('.menuactive').removeClass('menuactive');
        $('.project-menu-finance').addClass('menuactive');
        $('.finance-menu-keyfigures').addClass('submenuactive');

        if (window.location.href.indexOf('/baselines') > 0) {
            $('.submenuactive').removeClass('submenuactive');
            $('.finance-menu-baselines').addClass('submenuactive');
        }
        if (window.location.href.indexOf('/budget') > 0) {
            $('.submenuactive').removeClass('submenuactive');
            $('.finance-menu-budget').addClass('submenuactive');
        }
        if (window.location.href.indexOf('/posted') > 0) {
            $('.submenuactive').removeClass('submenuactive');
            $('.finance-menu-posted').addClass('submenuactive');
        }
        if (window.location.href.indexOf('/deviation') > 0) {
            $('.submenuactive').removeClass('submenuactive');
            $('.finance-menu-deviation').addClass('submenuactive');
        }
        if (window.location.href.indexOf('/next-year') > 0) {
            $('.submenuactive').removeClass('submenuactive');
            $('.finance-menu-next-year').addClass('submenuactive');
        }

    }
    if (window.location.href.indexOf('/dependencies') > 0) {
        $('.menuactive').removeClass('menuactive');
        $('.project-menu-dependencies').addClass('menuactive');
    }
    if (window.location.href.indexOf('/risks') > 0) {
        $('.menuactive').removeClass('menuactive');
        $('.project-menu-risks').addClass('menuactive');
    }
    if (window.location.href.indexOf('/milestone') > 0) {
        $('.menuactive').removeClass('menuactive');
        $('.project-menu-deliverables').addClass('menuactive');
    }
    if (window.location.href.indexOf('/status') > 0) {
        $('.menuactive').removeClass('menuactive');
        $('.project-menu-status').addClass('menuactive');
        $('.status-menu-status').addClass('submenuactive');

        if (window.location.href.indexOf('/action') > 0) {
            $('.submenuactive').removeClass('submenuactive');
            $('.status-menu-action').addClass('submenuactive');
        }
        if (window.location.href.indexOf('/decision') > 0) {
            $('.submenuactive').removeClass('submenuactive');
            $('.status-menu-decision').addClass('submenuactive');
        }
        if (window.location.href.indexOf('/steerco') > 0) {
            $('.submenuactive').removeClass('submenuactive');
            $('.status-menu-steerco').addClass('submenuactive');
        }
    }
    if (window.location.href.indexOf('/details') > 0) {
        $('.menuactive').removeClass('menuactive');
        $('.project-menu-details').addClass('menuactive');
    }


}
