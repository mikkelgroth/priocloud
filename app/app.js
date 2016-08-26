'use strict';

angular
    .module('riskApp', [
        'rx',
        'ngRoute',
        'ngAnimate',
        'ui.sortable'
    ])
    .config([
        '$routeProvider', function(
            $routeProvider
        ) {

            $routeProvider.when('/', { redirectTo: '/projects' });
            $routeProvider.when('/dashboard', { redirectTo: '/projects' });

            // home menu
            $routeProvider.when('/login', { controller: 'LoginController', templateUrl: 'components/login/template.html' });
            $routeProvider.when('/about', { controller: 'AboutController', templateUrl: 'components/about/template.html' });
            $routeProvider.when('/alternatives', { controller: 'AlternativesController', templateUrl: 'components/alternatives/template.html' });
            $routeProvider.when('/register', { controller: 'RegisterController', templateUrl: 'components/register/template.html' });
            $routeProvider.when('/help', { controller: 'HelpController', templateUrl: 'components/help/template.html' });

            // projects menu
            $routeProvider.when('/projects', { controller: 'ProjectsOverviewController', templateUrl: 'components/projectsOverview/template.html' });
            $routeProvider.when('/projects/dependencies', { controller: 'ProjectsDependenciesController', templateUrl: 'components/projectsDependencies/template.html' });
            $routeProvider.when('/projects/kpi', { controller: 'ProjectsKpiController', templateUrl: 'components/projectsKpi/template.html' });
            $routeProvider.when('/projects/status', { controller: 'ProjectsStatusController', templateUrl: 'components/projectsStatus/template.html' });
            $routeProvider.when('/projects/purpose', { controller: 'ProjectsPurposeController', templateUrl: 'components/projectsPurpose/template.html' });
            $routeProvider.when('/projects/risks', { controller: 'ProjectsRisksController', templateUrl: 'components/projectsRisks/template.html' });
            $routeProvider.when('/projects/deliverables', { controller: 'ProjectsDeliverablesController', templateUrl: 'components/projectsDeliverables/template.html' });

            // project
            $routeProvider.when('/project/:id', { controller: 'ProjectOverviewController', templateUrl: 'components/projectOverview/template.html' });
            $routeProvider.when('/project/:id/details', { controller: 'ProjectDetailsController', templateUrl: 'components/projectDetails/template.html' });
            $routeProvider.when('/project/:id/status', { controller: 'ProjectStatusController', templateUrl: 'components/projectStatus/template.html' });
            $routeProvider.when('/project/:id/milestone', { controller: 'ProjectMilestoneController', templateUrl: 'components/projectMilestone/template.html' });
            $routeProvider.when('/project/:id/risks', { controller: 'ProjectRisksController', templateUrl: 'components/projectRisks/template.html' });
            $routeProvider.when('/project/:id/dependencies', { controller: 'ProjectDependenciesController', templateUrl: 'components/projectDependencies/template.html' });
            $routeProvider.when('/project/:id/kpi', { controller: 'ProjectKpiController', templateUrl: 'components/projectKpi/template.html' });
            $routeProvider.when('/project/:id/finance', { controller: 'ProjectOverviewController', templateUrl: 'components/projectOverview/template.html' });

            // project risks
            $routeProvider.when('/project/:id/risks/:riskid', { controller: 'ProjectRisksController', templateUrl: 'components/projectRisks/template.html' });
            
            // project milestone
            $routeProvider.when('/project/:id/milestone/:milestoneid', { controller: 'ProjectMilestoneController', templateUrl: 'components/projectMilestone/template.html' });
            
            // other
            $routeProvider.when('/settings', { controller: 'SettingsController', templateUrl: 'components/settings/settings.html' });
            $routeProvider.when('/admin', { controller: 'AdminController', templateUrl: 'components/admin/admin.html' });
            $routeProvider.when('/master', { controller: 'MasterController', templateUrl: 'components/master/master.html' });
            $routeProvider.when('/otpw/:otpw', { controller: 'LoginController', templateUrl: 'components/login/onetimepassword.html' });
            
            $routeProvider.otherwise({
                redirectTo: '/projects'
            });

            /*
            $routeProvider.when('/project', { controller: 'ProjectController', templateUrl: 'components/project/project.html' });
            $routeProvider.when('/prio', { controller: 'PrioController', templateUrl: 'components/prio/prio.html' });
            $routeProvider.when('/risk', { controller: 'RiskController', templateUrl: 'components/risk/risk.html' });
            */
    }])
    .run([
        '$rootScope', 
        '$location', 
        'routeService', 
        'userService', 
        'companyService', function(
            $rootScope, 
            $location, 
            routeService, 
            userService, 
            companyService
        ) {
        
            $rootScope.SITENAME = SITENAME;

            $rootScope.$on('$routeChangeSuccess', function(next, current) { 

                routeService.setRoute(current.originalPath);
            });

            $rootScope.logout = function () {

                userService.invalidate();
                $location.path('/login');
            };

            $rootScope.userHasBeenValidated = false;

            userService
                .checkIfUserIsAuthenticated()
                .then(function(data) {
                    
                    $rootScope.userHasBeenValidated = true;

                    if (data.authenticated) {

                        userService.authenticate(data.user);

                    } else {

                        userService.invalidate();
                        $location.path('/login');
                    }
                });

            userService
                .userAuthenticated
                .subscribe(function (isAuthenticated) {

                    if (isAuthenticated) {
                        
                        companyService.loadCompany();
                    }
                });
    }]);