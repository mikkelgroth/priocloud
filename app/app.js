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

            $routeProvider.when('/theis', { controller: 'TheisController', templateUrl: 'components/theis/template.html?version=6.00' });

            // home menu
            $routeProvider.when('/login', { controller: 'LoginController', templateUrl: 'components/login/template.html?version=6.00' });
            $routeProvider.when('/about', { controller: 'AboutController', templateUrl: 'components/about/template.html?version=6.00' });
            $routeProvider.when('/alternatives', { controller: 'AlternativesController', templateUrl: 'components/alternatives/template.html?version=6.00' });
            $routeProvider.when('/register', { controller: 'RegisterController', templateUrl: 'components/register/template.html?version=6.00' });
            $routeProvider.when('/help', { controller: 'HelpController', templateUrl: 'components/help/template.html?version=6.00' });
            $routeProvider.when('/price', { controller: 'PriceengineController', templateUrl: 'components/priceengine/template.html?version=6.00' });
            $routeProvider.when('/settings', { controller: 'SettingsController', templateUrl: 'components/settings/template.html?version=6.00' });

            // projects menu
            $routeProvider.when('/projects', { controller: 'ProjectsOverviewController', templateUrl: 'components/projectsOverview/template.html?version=6.00' });
            $routeProvider.when('/projects/dependencies', { controller: 'ProjectsDependenciesController', templateUrl: 'components/projectsDependencies/template.html?version=6.00' });
            $routeProvider.when('/projects/risks', { controller: 'ProjectsRisksController', templateUrl: 'components/projectsRisks/template.html?version=6.00' });
            $routeProvider.when('/projects/deliverables', { controller: 'ProjectsDeliverablesController', templateUrl: 'components/projectsDeliverables/template.html?version=6.00' });
            $routeProvider.when('/projects/create', { controller: 'CreateProjectsController', templateUrl: 'components/createProjects/template.html?version=6.00' });

            // project
            $routeProvider.when('/project/:id', { controller: 'ProjectOverviewController', templateUrl: 'components/projectOverview/template.html?version=6.00' });
            $routeProvider.when('/project/:id/details', { controller: 'ProjectDetailsController', templateUrl: 'components/projectDetails/template.html?version=6.00' });
            $routeProvider.when('/project/:id/milestone', { controller: 'ProjectMilestoneController', templateUrl: 'components/projectMilestone/template.html?version=6.00' });
            $routeProvider.when('/project/:id/milestone/:milestoneid', { controller: 'ProjectMilestoneController', templateUrl: 'components/projectMilestone/template.html?version=6.00' });
            $routeProvider.when('/project/:id/risks', { controller: 'ProjectRisksController', templateUrl: 'components/projectRisks/template.html?version=6.00' });
            $routeProvider.when('/project/:id/risks/:riskid', { controller: 'ProjectRisksController', templateUrl: 'components/projectRisks/template.html?version=6.00' });
            $routeProvider.when('/project/:id/dependencies', { controller: 'ProjectDependenciesController', templateUrl: 'components/projectDependencies/template.html?version=6.00' });
            $routeProvider.when('/project/:id/dependencies/:depid', { controller: 'ProjectDependenciesController', templateUrl: 'components/projectDependencies/template.html?version=6.00' });

            // status
            $routeProvider.when('/project/:id/status', { controller: 'ProjectStatusController', templateUrl: 'components/projectStatus/template.html?version=6.00' });
            $routeProvider.when('/project/:id/status/action', { controller: 'ProjectStatusController', templateUrl: 'components/projectStatus/template.html?version=6.00' });
            $routeProvider.when('/project/:id/status/decision', { controller: 'ProjectStatusController', templateUrl: 'components/projectStatus/template.html?version=6.00' });
            $routeProvider.when('/project/:id/status/steerco', { controller: 'ProjectStatusController', templateUrl: 'components/projectStatus/template.html?version=6.00' });

            // finance
            $routeProvider.when('/project/:id/finance', { controller: 'ProjectFinanceController', templateUrl: 'components/projectFinance/template.html?version=6.00' });
            $routeProvider.when('/project/:id/finance/baselines', { controller: 'ProjectFinanceController', templateUrl: 'components/projectFinance/template.html?version=6.00' });
            $routeProvider.when('/project/:id/finance/budget', { controller: 'ProjectFinanceController', templateUrl: 'components/projectFinance/template.html?version=6.00' });
            $routeProvider.when('/project/:id/finance/posted', { controller: 'ProjectFinanceController', templateUrl: 'components/projectFinance/template.html?version=6.00' });
            $routeProvider.when('/project/:id/finance/deviation', { controller: 'ProjectFinanceController', templateUrl: 'components/projectFinance/template.html?version=6.00' });
            $routeProvider.when('/project/:id/finance/deviation-report', { controller: 'ProjectFinanceController', templateUrl: 'components/projectFinance/template.html?version=6.00' });

            // system
            $routeProvider.when('/systems', { controller: 'SystemsController', templateUrl: 'components/systemsOverview/template.html?version=6.00' });
            $routeProvider.when('/system/:id', { controller: 'SystemOverviewController', templateUrl: 'components/systemOverview/template.html?version=6.00' });
            $routeProvider.when('/system/:id/details', { controller: 'SystemDetailsController', templateUrl: 'components/systemDetails/template.html?version=6.00' });
            $routeProvider.when('/system/:id/dpia', { controller: 'SystemDPIAController', templateUrl: 'components/systemDPIA/template.html?version=6.00' });
            $routeProvider.when('/system/:id/connections', { controller: 'SystemConnectionsController', templateUrl: 'components/systemConnections/template.html?version=6.00' });
            $routeProvider.when('/system/:id/data', { controller: 'SystemDataController', templateUrl: 'components/systemData/template.html?version=6.00' });
            $routeProvider.when('/system/:id/perimeter', { controller: 'SystemPerimeterController', templateUrl: 'components/systemPerimeter/template.html?version=6.00' });
            $routeProvider.when('/system/:id/access', { controller: 'SystemAccessController', templateUrl: 'components/systemAccess/template.html?version=6.00' });
            $routeProvider.when('/system/:id/continuity', { controller: 'SystemContinuityController', templateUrl: 'components/systemContinuity/template.html?version=6.00' });

            // process
            $routeProvider.when('/processs', { controller: 'ProcesssController', templateUrl: 'components/processsOverview/template.html?version=6.00' });
            $routeProvider.when('/process/:id', { controller: 'ProcessOverviewController', templateUrl: 'components/processOverview/template.html?version=6.00' });
            $routeProvider.when('/process/:id/details', { controller: 'ProcessDetailsController', templateUrl: 'components/processDetails/template.html?version=6.00' });
            $routeProvider.when('/process/:id/steps', { controller: 'ProcessStepController', templateUrl: 'components/processSteps/template.html?version=6.00' });


            // admin
            $routeProvider.when('/admin', { controller: 'AdminController', templateUrl: 'components/admin/template.html?version=6.00' });
            $routeProvider.when('/admin/users', { controller: 'AdminUsersController', templateUrl: 'components/adminUsers/template.html?version=6.00' });
            $routeProvider.when('/admin/projects', { controller: 'AdminProjectsController', templateUrl: 'components/adminProjects/template.html?version=6.00' });
            $routeProvider.when('/admin/resource-types', { controller: 'AdminResourceTypesController', templateUrl: 'components/adminResourceTypes/template.html?version=6.00' });
            $routeProvider.when('/admin/portfolios', { controller: 'AdminPortfoliosController', templateUrl: 'components/adminPortfolios/template.html?version=6.00' });
            $routeProvider.when('/admin/systems', { controller: 'AdminSystemsController', templateUrl: 'components/adminSystems/template.html?version=6.00' });
            $routeProvider.when('/admin/processs', { controller: 'AdminProcesssController', templateUrl: 'components/adminProcesss/template.html?version=6.00' });
            $routeProvider.when('/admin/strategies', { controller: 'AdminStrategiesController', templateUrl: 'components/adminStrategies/template.html?version=6.00' });
            $routeProvider.when('/admin/delete', { controller: 'AdminDeleteController', templateUrl: 'components/adminDelete/template.html?version=6.00' });

            // other
            $routeProvider.when('/master', { controller: 'MasterController', templateUrl: 'components/master/template.html?version=6.00' });
            $routeProvider.when('/otpw/:otpw', { controller: 'LoginController', templateUrl: 'components/login/onetimepassword.html?version=6.00' });

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