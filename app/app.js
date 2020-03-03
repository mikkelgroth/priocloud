'use strict';

angular
    .module('riskApp', [
        'rx',
        'chart.js',
        'ngRoute',
        'ngAnimate',
        'ui.sortable'
    ])
    .config([
        '$routeProvider', function (
            $routeProvider
        ) {

            $routeProvider.when('/', { redirectTo: '/projects' });
            $routeProvider.when('/dashboard', { redirectTo: '/projects' });

            // home menu
            $routeProvider.when('/login', { controller: 'LoginController', templateUrl: 'components/login/template.html?version4.04' });
            $routeProvider.when('/about', { controller: 'AboutController', templateUrl: 'components/about/template.html?version4.04' });
            $routeProvider.when('/alternatives', { controller: 'AlternativesController', templateUrl: 'components/alternatives/template.html?version4.04' });
            $routeProvider.when('/register', { controller: 'RegisterController', templateUrl: 'components/register/template.html?version4.04' });
            $routeProvider.when('/help', { controller: 'HelpController', templateUrl: 'components/help/template.html?version4.04' });
            $routeProvider.when('/settings', { controller: 'SettingsController', templateUrl: 'components/settings/template.html?version4.04' });

            // projects menu
            $routeProvider.when('/projects', { controller: 'ProjectsOverviewController', templateUrl: 'components/projectsOverview/template.html?version4.04' });
            $routeProvider.when('/projects/dependencies', { controller: 'ProjectsDependenciesController', templateUrl: 'components/projectsDependencies/template.html?version4.04' });
            $routeProvider.when('/projects/risks', { controller: 'ProjectsRisksController', templateUrl: 'components/projectsRisks/template.html?version4.04' });
            $routeProvider.when('/projects/deliverables', { controller: 'ProjectsDeliverablesController', templateUrl: 'components/projectsDeliverables/template.html?version4.04' });
            $routeProvider.when('/projects/create', { controller: 'CreateProjectsController', templateUrl: 'components/createProjects/template.html?version4.04' });

            // project
            $routeProvider.when('/project/:id', { controller: 'ProjectOverviewController', templateUrl: 'components/projectOverview/template.html?version4.04' });
            $routeProvider.when('/project/:id/details', { controller: 'ProjectDetailsController', templateUrl: 'components/projectDetails/template.html?version4.04' });
            $routeProvider.when('/project/:id/milestone', { controller: 'ProjectMilestoneController', templateUrl: 'components/projectMilestone/template.html?version4.04' });
            $routeProvider.when('/project/:id/milestone/:milestoneid', { controller: 'ProjectMilestoneController', templateUrl: 'components/projectMilestone/template.html?version4.04' });
            $routeProvider.when('/project/:id/risks', { controller: 'ProjectRisksController', templateUrl: 'components/projectRisks/template.html?version4.04' });
            $routeProvider.when('/project/:id/risks/:riskid', { controller: 'ProjectRisksController', templateUrl: 'components/projectRisks/template.html?version4.04' });
            $routeProvider.when('/project/:id/dependencies', { controller: 'ProjectDependenciesController', templateUrl: 'components/projectDependencies/template.html?version4.04' });
            $routeProvider.when('/project/:id/dependencies/:depid', { controller: 'ProjectDependenciesController', templateUrl: 'components/projectDependencies/template.html?version4.04' });

            // status
            $routeProvider.when('/project/:id/status', { controller: 'ProjectStatusController', templateUrl: 'components/projectStatus/template.html?version4.04' });
            $routeProvider.when('/project/:id/status/action', { controller: 'ProjectStatusController', templateUrl: 'components/projectStatus/template.html?version4.04' });
            $routeProvider.when('/project/:id/status/decision', { controller: 'ProjectStatusController', templateUrl: 'components/projectStatus/template.html?version4.04' });
            $routeProvider.when('/project/:id/status/steerco', { controller: 'ProjectStatusController', templateUrl: 'components/projectStatus/template.html?version4.04' });
           
            // finance
            $routeProvider.when('/project/:id/finance', { controller: 'ProjectFinanceController', templateUrl: 'components/projectFinance/template.html?version4.04' });
            $routeProvider.when('/project/:id/finance/baselines', { controller: 'ProjectFinanceController', templateUrl: 'components/projectFinance/template.html?version4.04' });
            $routeProvider.when('/project/:id/finance/budget', { controller: 'ProjectFinanceController', templateUrl: 'components/projectFinance/template.html?version4.04' });
            $routeProvider.when('/project/:id/finance/posted', { controller: 'ProjectFinanceController', templateUrl: 'components/projectFinance/template.html?version4.04' });
            $routeProvider.when('/project/:id/finance/deviation', { controller: 'ProjectFinanceController', templateUrl: 'components/projectFinance/template.html?version4.04' });
            $routeProvider.when('/project/:id/finance/deviation-report', { controller: 'ProjectFinanceController', templateUrl: 'components/projectFinance/template.html?version4.04' });

            // system
            $routeProvider.when('/systems', { controller: 'SystemsController', templateUrl: 'components/systemsOverview/template.html?version4.04' });
            $routeProvider.when('/system/:id', { controller: 'SystemOverviewController', templateUrl: 'components/systemOverview/template.html?version4.04' });
            
            // admin
            $routeProvider.when('/admin', { controller: 'AdminController', templateUrl: 'components/admin/template.html?version4.04' });
            $routeProvider.when('/admin/users', { controller: 'AdminUsersController', templateUrl: 'components/adminUsers/template.html?version4.04' });
            $routeProvider.when('/admin/projects', { controller: 'AdminProjectsController', templateUrl: 'components/adminProjects/template.html?version4.04' });
            $routeProvider.when('/admin/resource-types', { controller: 'AdminResourceTypesController', templateUrl: 'components/adminResourceTypes/template.html?version4.04' });
            $routeProvider.when('/admin/portfolios', { controller: 'AdminPortfoliosController', templateUrl: 'components/adminPortfolios/template.html?version4.04' });
            $routeProvider.when('/admin/systems', { controller: 'AdminSystemsController', templateUrl: 'components/adminSystems/template.html?version4.04' });
            $routeProvider.when('/admin/processes', { controller: 'AdminProcessesController', templateUrl: 'components/adminProcesses/template.html?version4.04' });
            $routeProvider.when('/admin/delete', { controller: 'AdminDeleteController', templateUrl: 'components/adminDelete/template.html?version4.04' });

            // other
            $routeProvider.when('/master', { controller: 'MasterController', templateUrl: 'components/master/template.html?version4.04' });
            $routeProvider.when('/otpw/:otpw', { controller: 'LoginController', templateUrl: 'components/login/onetimepassword.html?version4.04' });

            $routeProvider.otherwise({
                redirectTo: '/projects'
            });
        }])
    .run([
        '$rootScope',
        '$location',
        '$http',
        'routeService',
        'userService',
        'companyService', function (
            $rootScope,
            $location,
            $http,
            routeService,
            userService,
            companyService
        ) {

            $rootScope.SITENAME = SITENAME;
            $rootScope.SSO = SSO;

            $rootScope.$on('$routeChangeSuccess', function (next, current) {
                routeService.setRoute(current.originalPath);
            });

            $rootScope.logout = function () {
                //ad logout 
                $http.post('/.auth/logout');
                userService.invalidate();
                $location.path('/login');
            };

            $rootScope.userHasBeenValidated = false;

            userService
                .checkIfUserIsAuthenticated()
                .then(function (data) {

                    $rootScope.userHasBeenValidated = true;

                    if (data.authenticated) {

                        userService.authenticate(data.user);

                    }


                    else {
                        var pid = $location.path().split("/")[1] || "Unknown";
                        console.log(pid);
                        if (pid === "otpw") {
                            console.log('direct to otpw');

                        } else {
                            console.log('Login redirect from app.js' + $location.path());
                            userService.invalidate();
                            $location.path('/login');

                        }
                    }
                });

            userService
                .user
                .subscribe(function (user) {

                    if (user.authenticated) {
                        console.log("START LOGIN")
                        $rootScope.user = user;
                        companyService.loadCompany();
                        console.log("END LOGIN")
                    }
                });
        }]);