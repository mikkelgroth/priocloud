Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}
angular.module('riskApp.controllers', [])
.filter('multiFilter', function () {
	  return function (items, filterData) {
	      if(filterData == undefined)
	          return items;
	      var keys = Object.keys(filterData);  
	      var filtered = [];
	      var populate = true;
	      for (var i = 0; i < items.length; i++) {
	          var item = items[i];
	          populate = true;
	          for(var j = 0; j < keys.length ; j++){
	              if(filterData[keys[j]] != undefined){
	                   //console.log(filterData[keys[j]]+ " >>>   "+item[keys[j]]);
	                  if(filterData[keys[j]].length == 0 || filterData[keys[j]].contains(item[keys[j]])){
	                      populate = true;
	                  }else{
	                      populate = false;
	                      break;
	                  }
	              }
	          }
	          if(populate){
	              filtered.push(item);
	          }
	      }
	    return filtered;
	  };
	})
.service('stateService', function(restService,$rootScope) {
	console.log('stateService initialized');
	var project={};	//active selected project
	var projects=[];
	var users=[];
	var company={};
	var bus=[];
	project.milestones=[];
	project.risks=[];
    project.statuses=[];

    
    this.setUsers = function(users) {
    	this.users=users;
    }
    this.getUsers = function() {
    	return users;
    }

    this.loadCompany = function() {
        console.log('loading Company');
        restService.getData('company').then(function(dataResponse) {
        	if(dataResponse.data && dataResponse.data.length>0){
	        	company=dataResponse.data[0];
	        	$rootScope.company=dataResponse.data;
        	}
        });
        console.log('loading bus');
        restService.getData('bu').then(function(dataResponse) {
        	if(dataResponse.data){
	        	bus=dataResponse.data;
	        	$rootScope.bus=dataResponse.data;
        		projects=[];
	        	angular.forEach(bus, function(bu) {
	                //{{user.email}} {{bus[0].owner.email}}
	                if(bu.owner && $rootScope.user.email==bu.owner.email){
	                	$rootScope.user.isOwner=true;
	                }

	        		//load all projects for this specific bu
	                restService.getData('project/'+bu._id.$oid).then(function(dataResponse) {
	                	projects=projects.concat(dataResponse.data);
	                	$rootScope.projects=projects;
	        	        console.log('loading projects for bu ['+bu._id.$oid+'] done');
	                });
	        	});
        	}
        });
    }
    this.getCompany = function() {
    	if(!bus){bus=[]};
    	return company;
    }
    this.addProject = function(newproject) {
    	projects.push(newproject);
    	$rootScope.projects=projects;
    }
    this.getProjects = function() {
    	return projects;
    }
    this.getProject = function() {
    	if(!project.milestones){project.milestones=[]};
    	if(!project.risks){project.risks=[]};
    	if(!project.statuses){project.statuses=[]};
    	return project;
    }
    this.setProject = function(p) {
    	project=p;
    }
})




//this service will save the state in a REST database
.service('restService', function($http) {
	console.log('rest service initialized');
	var SERVER=DBSERVER
	//'https://rest.ttsoftware.dk';
//	var SERVER='http://localhost:8080/rest';
	var auid;
	var uuid;
	this.setApplication = function(auid, uuid) {
		this.auid = auid;
		this.uuid = uuid;
	}
	this.getData = function(collection, oid) {
		if(oid){
			return $http.get(SERVER +'/' + this.auid +'/' + this.uuid + '/'+collection+'/'+oid+'?rnd=' + (Math.random()));
		}else{
			return $http.get(SERVER +'/' + this.auid +'/' + this.uuid + '/'+collection+'?rnd=' + (Math.random()));
		}
	}
	this.updateData = function(collection, data) {
		return $http.put(SERVER +'/' + this.auid +'/' + this.uuid + '/'+collection+'/'+data._id.$oid, data);
	}
	this.saveData = function(collection, data) {
		return $http.post(SERVER +'/' + this.auid +'/' + this.uuid + '/'+collection+'', data);
	}
	this.deleteData = function(collection, data) {
		return $http.delete(SERVER +'/' + this.auid +'/' + this.uuid + '/'+collection+'/' + data._id.$oid);
	}
})

//this controller handles login, logout and user creation
.controller('LoginController', function($scope, $http, $rootScope, $location, $window, restService, stateService, $routeParams, $timeout) {
	console.log("LoginController initialized");
    var SERVER=USERSERVER;
    $scope.SITE = SITE; 
    ///'https://user.ttsoftware.dk/user';
//	var SERVER='http://localhost:8080/user';
    
	$scope.newPassword = function() {
	    //alert("Setting new password for user [" + $scope.email+ "]: " +$scope.newpassword);
		$http.post(SERVER+'?action=updatepassword&application=priocloud&email=' + $scope.email + '&password=' + $scope.newpassword + '&onetimepassword='+$routeParams.otpw).
		success(function(data, status, headers, config) {
			$rootScope.user = data;
			$window.sessionStorage["user"] = JSON.stringify($rootScope.user);
			if (!$rootScope.user.authenticated) {
				alert('Reset failure:\n\n' + data.message);
			}else{
				$location.path('/dashboard');
				console.log('loading projects');
				restService.setApplication($rootScope.user.auid, $rootScope.user.uuid);
				stateService.loadCompany();
				//stateService.loadProjects();
				loadUsers();
			}
		});
	}
	
	$scope.loadAllCompanies = function() {
        console.log('Loading all Companies');
		console.log("*********************************");
		$http.post(SERVER+'?action=loadallcompanies&application=priocloud&auid=' + $rootScope.user.auid + '&uuid=' + $rootScope.user.uuid + '&email=' + $rootScope.user.email).
		success(function(data, status, headers, config) {
			if (data) {
				$scope.masters=data;
			} else {
				alert('Error getting users:\n\n' + data.message);
			}
		});
	}
	$scope.hackLogin = function(master) {
		alert("Hack login as " + master.email);
		$http.post(SERVER+'?action=masterlogin&application=priocloud&auid=' + $rootScope.user.auid + '&uuid=' + $rootScope.user.uuid + '&email=' + $rootScope.user.email  + '&masteruuid=' + master.uuid).
		success(function(data, status, headers, config) {
			$rootScope.user = data;
			$window.sessionStorage["user"] = JSON.stringify($rootScope.user);
			if (!$rootScope.user.authenticated) {
				alert('Login failure:\n\n' + data.message);
			}else{
				$location.path('/dashboard');
				console.log('loading projects');
				restService.setApplication($rootScope.user.auid, $rootScope.user.uuid);
				stateService.loadCompany();
				//stateService.loadProjects();
				loadUsers();
			}
		});
	}
	$scope.destroyCompany = function() {
        console.log('Destroying Company');
		console.log("*********************************");
		$http.post(SERVER+'?action=destroycompany&application=priocloud&auid=' + $rootScope.user.auid + '&uuid=' + $rootScope.user.uuid + '&email=' + $rootScope.user.email).
		success(function(data, status, headers, config) {
			if (data) {
				$scope.doLogout()
			} else {
				alert('Error getting users:\n\n' + data.message);
			}
		});
	}
	var loadUsers = function() {
        console.log('loading Users');
		console.log("*********************************");
		$http.post(SERVER+'?action=getusers&application=priocloud&auid='+ $rootScope.user.auid + '&uuid=' + $rootScope.user.uuid ).
		success(function(data, status, headers, config) {
			if (data) {
				stateService.setUsers(data);
				$rootScope.users=data;
			} else {
				alert('Error getting users:\n\n' + data.message);
			}
		});
	}
	function init(userload) {
		console.log($rootScope.user);
		console.log(!$rootScope.user);
		if (!$rootScope.user && $window.sessionStorage["user"] && $window.sessionStorage["user"]!="null") {
			try {
				console.log("loading user from session!");
				console.log("------------------------------");
				$rootScope.user = JSON.parse($window.sessionStorage["user"]);
				userload();
				restService.setApplication($rootScope.user.auid,$rootScope.user.uuid);
				stateService.loadCompany();
				//stateService.loadProjects();
			} catch (e) {}
		}
		console.log($rootScope.user);
	}
    init(loadUsers);	//handle users that press F5 in a SPA
    
    
    

    $scope.doLogout = function() {
		//$rootScope={};//clear all vars
		$rootScope.user = {
			'authenticated': false,
			'email': null
		};
		$window.sessionStorage["user"] = null;
		$location.path('/');
	};
    
     //timeout functions
  //displays a warning after 20 seconds, redirects to logout after another 10
  movement(); //init when login is done
  //$scope.inactive=false;
  var idleTimer;  //warn the user about imminent timeout
  var reloadTimer;  //redirect to logout page
  function callIdle(){
    console.log("You have been idle too long");
    //$scope.inactive=true; //display GUI warning
    reloadTimer=$timeout(callReload, 60*1000);
  }
  function callReload(){
    console.log("Reload here...");
    //$scope.inactive=false;
    //$location.path("logout");
      $scope.doLogout();
  }
  function movement(){
    //console.log("movement: "+new Date());
    $timeout.cancel(idleTimer);
    $timeout.cancel(reloadTimer);
    idleTimer=$timeout(callIdle, 9*60*1000);
  }
  angular.element(document.body).on('mousemove keydown DOMMouseScroll mousewheel mousedown touchstart', movement);
    
    
	$scope.doLogin = function() {
		$http.post(SERVER+'?action=login&application=priocloud&email=' + $scope.login.email + '&password=' + $scope.login.password).
		success(function(data, status, headers, config) {
			$rootScope.user = data;
			//$rootScope.user.admin = true;
			//$rootScope.user.demo = false;
			$window.sessionStorage["user"] = JSON.stringify($rootScope.user);
			if (!$rootScope.user.authenticated) {
				alert('Login failure:\n\n' + data.message);
			}else{
				$location.path('/dashboard');
				console.log('loading projects');
				restService.setApplication($rootScope.user.auid, $rootScope.user.uuid);
				stateService.loadCompany();
				//stateService.loadProjects();
				loadUsers();
			}
		});
	};
	$scope.createUser = function() {	//create admin user who owns this project
		$http.post(SERVER+'?action=createproject&application=priocloud&email=' + $scope.create.email + '&password=' + $scope.create.password).
		success(function(data, status, headers, config) {
			if (data.authenticated) {
				$rootScope.user = data;
				$window.sessionStorage["user"] = JSON.stringify($rootScope.user);
				$location.path('/admin');
				restService.setApplication($rootScope.user.auid, $rootScope.user.uuid);
				restService.saveData('company',{
					name:$scope.create.companyname,
				    projkpi1lable:'Strategy',
					projkpi2lable:'Customer focus',
					projkpi3lable:'Compliance',
					projkpi1weight:1,
					projkpi2weight:1,
					projkpi3weight:1,
					projkpi1sort:'tophigh',
					projkpi2sort:'tophigh',
					projkpi3sort:'tophigh',
                    
				    riskkpi1lable:'Probability',
					riskkpi2lable:'Customer impact',
					riskkpi3lable:'Project delay',
					riskkpi1weight:1,
					riskkpi2weight:1,
					riskkpi3weight:1,
					riskkpi1sort:'tophigh',
					riskkpi2sort:'tophigh',
					riskkpi3sort:'tophigh'
				
				}).success(function(dataResponse) {
					$scope.company=dataResponse;	//update the oid via angular
                    
				stateService.loadCompany();
					//add a BU with company name 
					var bu={name:$scope.create.companyname};
					restService.saveData('bu',angular.fromJson(bu)).success(function(dataResponse) {
						$scope.bus[0]=dataResponse;
					});
				});
            	
                //TODO: create default company with kpi1==strategy, .... here
				//TODO: create default BU here
				//TODO: create default 3 projects here

				loadUsers();
				alert('User created.');
			} else {
				alert('User creation failure:\n\n' + data.message);
			}
		});
	};
	$scope.addUser = function(user) {	//create sub user with limited rights - NB: MUST contain email and auid
		var data=angular.fromJson(user);
		$http.post(SERVER+'?action=adduser&application=priocloud&auid=' + $rootScope.user.auid + '&uuid=' + $rootScope.user.uuid, data).
		success(function(data, status, headers, config) {
			console.log(data);
			$scope.newuser={};
			loadUsers();
		}).error(function(dataResponse) {
			alert('failure: '+ dataResponse.message);
		});
	};
	$scope.fillUser = function(user) {
        $scope.edituser=user;
    };
	$scope.saveUser = function(user) {
		var data=angular.fromJson(user);
        console.log(data);
		$http.post(SERVER+'?action=updateuser&application=priocloud&auid=' + $rootScope.user.auid + '&uuid=' + user.uuid, data).
		success(function(data, status, headers, config) {
			console.log(data);
			loadUsers();
		}).error(function(dataResponse) {
			alert('failure: '+ dataResponse.message);
		});
	};
	$scope.updateUser = function(user) {
		var data=angular.fromJson(user);
		$http.post(SERVER+'?action=updateuser&application=priocloud&auid=' + $rootScope.user.auid + '&uuid=' + $rootScope.user.uuid, data).
		success(function(data, status, headers, config) {
			console.log(data);
			$rootScope.user = data;
			$window.sessionStorage["user"] = JSON.stringify($rootScope.user);
			loadUsers();
		}).error(function(dataResponse) {
			alert('failure: '+ dataResponse.message);
		});
	};
	$scope.deleteUser = function(user) {
		$http.post(SERVER+'?action=deleteuser&application=priocloud&auid=' + $rootScope.user.auid + '&uuid=' + $rootScope.user.uuid + '&email=' + user.email).
		success(function(data, status, headers, config) {
            var users=$rootScope.users;
            var index=users.indexOf(user);
		    users.splice(index, 1);
		}).error(function(dataResponse) {
			alert('failure: '+ dataResponse.message);
		});
	};
	$scope.resetUserPW = function(users, index) {
		console.log(users[index]);
		$scope.resetUserPWEmail(users[index].email);
	};
	$scope.resetUserPWEmail = function(email) {
		$http.post(SERVER+'?action=resetpassword&application=priocloud&email=' + email).
		success(function(data, status, headers, config) {
		    alert('PW reset and mail sent');
		}).error(function(dataResponse) {
			alert('failure: '+ dataResponse.message);
		});
	};
})
;

