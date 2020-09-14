angular
    .module('riskApp')
    .directive('prioAdminMenu', [function() {
        
        function linkFunction(scope, element, attributes) {
            
        }	
        
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'components/adminMenu/template.html',
            link: linkFunction
        };
    }]);

    $(window).on('hashchange', function () {
        if (window.location.href.indexOf('admin') > 0) {
            setAdminMenu();
        }
    }).trigger('hashchange');

    function setAdminMenu() {
        //console.log("inside setAdminMenu");
        if (window.location.href.indexOf('/') > 0) {
            $('.menuactive').removeClass('menuactive');
            $('.admin-menu-home').addClass('menuactive');
        }
        if (window.location.href.indexOf('/users') > 0) {
            $('.menuactive').removeClass('menuactive');
            $('.admin-menu-users').addClass('menuactive');
        }
        if (window.location.href.indexOf('/projects') > 0) {
            $('.menuactive').removeClass('menuactive');
            $('.admin-menu-projects').addClass('menuactive');
        }
        if (window.location.href.indexOf('/resource-types') > 0) {
            $('.menuactive').removeClass('menuactive');
            $('.admin-menu-resource-types').addClass('menuactive');
        }
        if (window.location.href.indexOf('/portfolios') > 0) {
            $('.menuactive').removeClass('menuactive');
            $('.admin-menu-portfolios').addClass('menuactive');
        }
        if (window.location.href.indexOf('/systems') > 0) {
            $('.menuactive').removeClass('menuactive');
            $('.admin-menu-systems').addClass('menuactive');
        }
        if (window.location.href.indexOf('/processs') > 0) {
            $('.menuactive').removeClass('menuactive');
            $('.admin-menu-processs').addClass('menuactive');
        }
        if (window.location.href.indexOf('/strategies') > 0) {
            $('.menuactive').removeClass('menuactive');
            $('.admin-menu-strategies').addClass('menuactive');
        }
    }
    
