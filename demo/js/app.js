'use strict';

// Declare app level module which depends on filters, and services
angular.module('riskApp', [
	'ngRoute',
	//'angular-sortable-view',
	'ui.sortable',
	'riskApp.controllers'
]).
config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/', {templateUrl: 'partials/login.html'});
	$routeProvider.when('/dashboard/:department_id', {templateUrl: 'partials/dashboard.html'});
	$routeProvider.when('/login', {templateUrl: 'partials/login.html', login: true});
	$routeProvider.when('/orgdia', {templateUrl: 'partials/orgdia.html', controller: 'OrgCtrl'});
	//$routeProvider.when('/download', {templateUrl: 'partials/download.html', controller: 'MyCtrl2'});
	$routeProvider.otherwise({
        redirectTo: '/'
      });
}]);