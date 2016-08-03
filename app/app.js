'use strict';

angular
    .module('riskApp', [
        'ngRoute',
        'ngAnimate',
        'ui.sortable',
        //'riskApp.components'
    ])
    .config(['$routeProvider', function($routeProvider) {

        $routeProvider.when('/', { redirectTo: '/dashboard' });
        $routeProvider.when('/login', { controller: 'LoginController', templateUrl: 'components/login/login.html' });
        $routeProvider.when('/dashboard', { controller: 'DashboardController', templateUrl: 'components/dashboard/dashboard.html' });
        $routeProvider.when('/project', { controller: 'ProjectController', templateUrl: 'components/project/project.html' });
        $routeProvider.when('/prio', { controller: 'PrioController', templateUrl: 'components/prio/prio.html' });
        $routeProvider.when('/risk', { controller: 'RiskController', templateUrl: 'components/risk/risk.html' });
        $routeProvider.when('/settings', { controller: 'SettingsController', templateUrl: 'components/settings/settings.html' });
        $routeProvider.when('/admin', { controller: 'AdminController', templateUrl: 'components/admin/admin.html' });
        $routeProvider.when('/master', { controller: 'MasterController', templateUrl: 'components/master/master.html' });
        $routeProvider.when('/otpw/:otpw', { controller: 'LoginController', templateUrl: 'components/login/onetimepassword.html' });
        
        $routeProvider.otherwise({
            redirectTo: '/dashboard'
        });
    }])
    .run(['$rootScope', function($rootScope) {
        
        $rootScope.SITENAME = SITENAME;
        $rootScope.route = "/login";
        
        $rootScope.$on('$routeChangeSuccess', function(next, current) { 
            
            $rootScope.route = current.originalPath;
        });
    }]);