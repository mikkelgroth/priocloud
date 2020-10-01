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



$(window).on('hashchange', function () {
    if (window.location.href.indexOf('project') > 0) {
        setProjectMenu();
    }
}).trigger('hashchange');

function setProjectMenu() {
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
    if (window.location.href.indexOf('/keyresults') > 0) {
        $('.menuactive').removeClass('menuactive');
        $('.project-menu-keyresults').addClass('menuactive');
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
        $('.details-menu-details').addClass('submenuactive');

        if (window.location.href.indexOf('/priority') > 0) {
            $('.submenuactive').removeClass('submenuactive');
            $('.details-menu-priority').addClass('submenuactive');
        }
        if (window.location.href.indexOf('/simplestatus') > 0) {
            $('.submenuactive').removeClass('submenuactive');
            $('.details-menu-simplestatus').addClass('submenuactive');
        }
        if (window.location.href.indexOf('/strategy') > 0) {
            $('.submenuactive').removeClass('submenuactive');
            $('.details-menu-strategy').addClass('submenuactive');
        }
        if (window.location.href.indexOf('/owners') > 0) {
            $('.submenuactive').removeClass('submenuactive');
            $('.details-menu-owners').addClass('submenuactive');
        }
        if (window.location.href.indexOf('/businesscase') > 0) {
            $('.submenuactive').removeClass('submenuactive');
            $('.details-menu-businesscase').addClass('submenuactive');
        }
    }


}
