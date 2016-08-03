'use strict';

// Declare app level module which depends on filters, and services
angular.module('riskApp', [
	'ngRoute',
	'ngAnimate',
	'ui.sortable',
//	'multiFilter',
	'riskApp.controllers'
]).
config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/', 		{templateUrl: 'partials/login.html'});
	//static html templates:
	$routeProvider.when('/project', 	{
		controller: 'ProjectCtrl',
		resolve: ['$location','stateService', function($location, stateService) {
			
			// Redirect user to dashboard, if project is not set in stateService
			if (!stateService.getProject().auid) {
				$location.path("/dashboard");
			}
		}],
		templateUrl: 'partials/Project.html'
	});
	$routeProvider.when('/dashboard', 	{controller: 'ProjectCtrl',templateUrl: 'partials/PortfolioDashboard.html'});
	$routeProvider.when('/prio', 		{controller: 'projectListCtrl',templateUrl: 'partials/PortfolioPrio.html'});
	$routeProvider.when('/risk', 		{controller: 'riskListCtrl',templateUrl: 'partials/RiskPrio.html'});
	$routeProvider.when('/settings', 	{controller: 'LoginController',templateUrl: 'partials/Settings.html'});
	$routeProvider.when('/admin', 		{controller: 'ProjectCtrl',templateUrl: 'partials/Admin.html'});
	$routeProvider.when('/master', 		{controller: 'LoginController',templateUrl: 'partials/Master.html'});
	$routeProvider.when('/otpw/:otpw', 	{controller: 'LoginController',templateUrl: 'partials/OneTimePW.html'});
	$routeProvider.when('/login', 		{templateUrl: 'partials/login.html', login: true});
	$routeProvider.otherwise({
		redirectTo: '/'
	});
}]).
run(['$rootScope', function($rootScope) {
	
	$rootScope.SITENAME = SITENAME;
	$rootScope.route = "/login";
	
	$rootScope.$on('$routeChangeSuccess', function(next, current) { 
		
		$rootScope.route = current.originalPath;
	});
 
}]);