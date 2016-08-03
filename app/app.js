'use strict';

angular
    .module('riskApp', [
        'ngRoute',
        'ngAnimate',
        'ui.sortable'
    ])
    .config(['$routeProvider', function($routeProvider) {

        $routeProvider.when('/', { redirectTo: '/projects' });
        $routeProvider.when('/dashboard', { redirectTo: '/projects' });

        $routeProvider.when('/login', { controller: 'LoginController', templateUrl: 'components/login/login.html' });

        // Overviews/lists
        $routeProvider.when('/projects', { controller: 'ProjectsOverviewController', templateUrl: 'components/projectsOverview/template.html' });
        $routeProvider.when('/projects/dependencies', { controller: 'ProjectsDependenciesController', templateUrl: 'components/projectsDependencies/template.html' });
        $routeProvider.when('/projects/kpi', { controller: 'ProjectsKpiController', templateUrl: 'components/projectsKpi/template.html' });
        $routeProvider.when('/projects/status', { controller: 'ProjectsStatusController', templateUrl: 'components/projectsStatus/template.html' });
        $routeProvider.when('/projects/purpose', { controller: 'ProjectsPurposeController', templateUrl: 'components/projectsPurpose/template.html' });
        $routeProvider.when('/projects/risks', { controller: 'ProjectsRisksController', templateUrl: 'components/projectsRisks/template.html' });
        $routeProvider.when('/projects/deliverables', { controller: 'ProjectsDeliverablesController', templateUrl: 'components/projectsDeliverables/template.html' });


        $routeProvider.when('/project', { controller: 'ProjectController', templateUrl: 'components/project/project.html' });
        $routeProvider.when('/prio', { controller: 'PrioController', templateUrl: 'components/prio/prio.html' });
        $routeProvider.when('/risk', { controller: 'RiskController', templateUrl: 'components/risk/risk.html' });
        $routeProvider.when('/settings', { controller: 'SettingsController', templateUrl: 'components/settings/settings.html' });
        $routeProvider.when('/admin', { controller: 'AdminController', templateUrl: 'components/admin/admin.html' });
        $routeProvider.when('/master', { controller: 'MasterController', templateUrl: 'components/master/master.html' });
        $routeProvider.when('/otpw/:otpw', { controller: 'LoginController', templateUrl: 'components/login/onetimepassword.html' });
        
        $routeProvider.otherwise({
            redirectTo: '/projects'
        });
    }])
    .run(['$rootScope', function($rootScope) {
        
        $rootScope.SITENAME = SITENAME;

        //$rootScope.route = "/login";
        //$rootScope.$on('$routeChangeSuccess', function(next, current) { 
        //    $rootScope.route = current.originalPath;
        //});
    }]);