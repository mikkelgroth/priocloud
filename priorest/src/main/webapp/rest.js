angular.module('todoApp', ['ngAnimate'])

//this service will save the state in a REST database
.service('restService', function($http) {
//	var SERVER='http://rest.ttsoftware.dk';
	var SERVER='http://localhost:8080/rest';
	var uuid;
	this.setUser = function(uuid) {
		this.uuid = uuid;
	}
	this.getData = function(collection, oid) {
		if(oid){
			return $http.get(SERVER +'/' + this.uuid + '/'+collection+'/'+oid+'?rnd=' + (Math.random()));
		}else{
			return $http.get(SERVER +'/' + this.uuid + '/'+collection+'?rnd=' + (Math.random()));
		}
	}
	this.updateData = function(collection, data) {
		return $http.put(SERVER +'/' + this.uuid + '/'+collection+'/'+data._id.$oid, data);
	}
	this.saveData = function(collection, data) {
		return $http.post(SERVER +'/' + this.uuid + '/'+collection+'', data);
	}
	this.deleteData = function(collection, data) {
		return $http.delete(SERVER +'/' + this.uuid + '/'+collection+'/' + data._id.$oid);
	}
})

//this controller handles login, logout and user creation
.controller('LoginController', function($scope, $http, $rootScope, $location, $window) {
	function init() {
		if ($window.sessionStorage["user"]) {
			try {
				$rootScope.user = JSON.parse($window.sessionStorage["user"]);
			} catch (e) {}
		}
	}
	init();	//handle users that press F5 in a SPA
	var SERVER='http://localhost:8080/user';
	//SERVER='http://laptoplost.com/ll';
	$scope.doLogout = function() {
		$rootScope.user = {
			'authenticated': false,
			'email': null
		};
		$window.sessionStorage["user"] = null;
	};
	$scope.doLogin = function() {
		$http.post(SERVER+'?action=login&email=' + $scope.login.email + '&password=' + $scope.login.password+ '&application=prio').
		success(function(data, status, headers, config) {
			$rootScope.user = data;
			$window.sessionStorage["user"] = JSON.stringify($rootScope.user);
			if (!$rootScope.user.authenticated) {
				alert('Login failure:\n\n' + data.message);
			}
		});
	};
	$scope.createUser = function() {
		console.log("create sub user");
		var url=SERVER+'?action=create&email=' + $scope.create.email + '&password=' + $scope.create.password;
		url+='&uuid='+$rootScope.user.uuid;
		url+='&auid='+$rootScope.user.auid+'&application='+$rootScope.user.application;
		$http.post(url).
		success(function(data, status, headers, config) {
			if (data.authenticated) {
				alert('User created.');
			} else {
				alert('User creation failure:\n\n' + data.message);
			}
		});
	};
	$scope.createProject = function() {
		$http.post(SERVER+'?action=createproject&email=' + $scope.newproject.email + '&password=' + $scope.newproject.password+ '&application=' + $scope.newproject.application).
		success(function(data, status, headers, config) {
			if (data.authenticated) {
				$rootScope.user = data;
				$window.sessionStorage["user"] = JSON.stringify($rootScope.user);
				$scope.loginurl=SERVER+'?action=login&application=' + $scope.newproject.application+ '&email=xxx&password=yyy';
				alert('User created.');
			} else {
				alert('User creation failure:\n\n' + data.message);
			}
		});
	};
})

//this controller is the main logic handling the notes, userlogin, rest calls and push notifications
.controller('TodoController', ['$scope', 'restService', 
	function($scope, restService) {

		$scope.collection='player';

		$scope.$watch('user', function() {
			if ($scope.user && $scope.user.authenticated) {
				//setup rest and load todolist when user logs in
				restService.setUser($scope.user.uuid);
			}
		});

		$scope.select = function(todo) {
			$scope.selected=todo;
			$scope.oid=todo._id.$oid;
			$scope.data=angular.toJson(todo, true);
		}

		$scope.doRest = function(method) {
			console.log(method);
			console.log($scope.collection);
			console.log($scope.oid);
			if(method=='GET'){
				restService.getData($scope.collection,$scope.oid).then(function(dataResponse) {
					$scope.todos = dataResponse.data;
				});
			}
			if(method=='POST'){
				restService.saveData($scope.collection,angular.fromJson($scope.data)).then(function(dataResponse) {});
			}
			if(method=='PUT'){
				restService.updateData($scope.collection,angular.fromJson($scope.data)).then(function(dataResponse) {});
			}
			if(method=='DEL'){
				restService.deleteData($scope.collection,$scope.selected).then(function(){pushService.push();});
			}
		};


	}
])
;