//var riskApp = angular.module('riskApp', ['angular-sortable-view', 'ui.sortable']);

angular.module('riskApp.controllers', [])
.controller('projectListCtrl', ['$scope','$rootScope', '$filter', 'restService', '$routeParams', function ($scope, $rootScope, $filter, restService, $routeParams) {
    var dashy;
    var obj = null;

	console.log($routeParams);
	console.log($routeParams.department_id);
	$scope.department=$routeParams.department_id;

    var redrawAll = function() {
        //popuplate dashboard
        dashy = new Dashboard('#dashboard', $scope.freqData);

        //TODO fix this ugly copy hack so we only have one instance
        $scope.impact = $filter('orderBy')(angular.copy($scope.freqData), '-freq.impact');
        $scope.prob = $filter('orderBy')(angular.copy($scope.freqData), '-freq.prob');
        $scope.proxi = $filter('orderBy')(angular.copy($scope.freqData), '-freq.prox');
    };
    
    //load from database
    var loadData = function() {
        console.log('loading freqData list');
        restService.getData($scope.department).then(function(dataResponse) {
            if (dataResponse.data.length > 0) {
                $scope.freqData = dataResponse.data[0].freqData;
                obj = dataResponse.data[0];
            } else {
            	console.log('No data found - defaulting to initial data load');
                obj = null;
                $scope.freqData = initialData;
            }
            /* 			if(!$scope.freqData || $scope.freqData.length===0){
    	            			restService.deleteData(dataResponse.data[0]);
    	        				}*/
            console.log($scope.freqData);
            console.log(initialData);
            redrawAll();
        });
    };

    function recount(arr, name, weight) {
        var count = arr.length;
        angular.forEach(arr, function(item) {
            $scope.setValue(item.proj, name, count*weight);
            count--;
        });
        dashy.redraw();
    }
    
    $scope.lable1Config = {
       stop: function(e, ui) {
           recount($scope.impact, "impact", 1);
       }
    };

	$scope.probConfig = {
	    stop: function(e, ui) {
	        recount($scope.prob, "prob", 2);
	    }
	};

	$scope.proxiConfig = {
	    stop: function(e, ui) {
	        recount($scope.proxi, "prox", 5);
	    }
	};

	$scope.changeHandler = function() {
	    console.log("Something changed!");
	}

	$scope.$watch('user', function() {
	    if ($scope.user && $scope.user.authenticated) {
	        //setup rest and load todolist when user logs in
	        restService.setUser($scope.user.uuid);
	        loadData();
	    }
	});

	$scope.addItem = function() {
	    var x = {
	        'proj': 'Proj X',
	        freq: {
	            impact: 1,
	            prob: 1,
	            prox: 1
	        }
	    };
	    $scope.freqData.push(x);
	    //we need to redraw the entire dashboard due to more legends
	    redrawAll();
	}

	$scope.saveData = function() {
	    if (obj != null) {
	        obj.freqData = $scope.freqData;
	        restService.updateData(obj);
	    } else {
	        obj = {};
	        obj.freqData = $scope.freqData;
	        obj.department_id = $scope.department;
	        restService.saveData(obj).then(function(dataResponse) {
	        	obj=dataResponse.data;
        	});
	    }
	};

	$scope.deleteData = function() {
	    restService.deleteData(obj);
	};
	
  var initialData= [
            {'proj': 'Proj A',freq:{impact:1, prob:1*2, prox:1*5}},
            {'proj': 'Proj B',freq:{impact:2, prob:2*2, prox:2*5}},
            {'proj': 'Proj C',freq:{impact:3, prob:3*2, prox:3*5}},
            {'proj': 'Proj D',freq:{impact:4, prob:4*2, prox:4*5}},
            {'proj': 'Proj E',freq:{impact:5, prob:5*2, prox:5*5}},
            {'proj': 'Proj F',freq:{impact:6, prob:6*2, prox:6*5}},
            {'proj': 'Proj G',freq:{impact:7, prob:7*2, prox:7*5}},
            {'proj': 'Proj H',freq:{impact:8, prob:8*2, prox:8*5}},
            {'proj': 'Proj I',freq:{impact:9, prob:9*2, prox:9*5}},
            {'proj': 'Proj J',freq:{impact:10, prob:10*2, prox:10*5}},
            {'proj': 'Proj K',freq:{impact:11, prob:11*2, prox:11*5}},
            {'proj': 'Proj L',freq:{impact:12, prob:12*2, prox:12*5}}
  ];
    
      var baseConfig = {
          placeholder: "beingDragged",
          tolerance: 'pointer',
          items: 'li',
          revert: 100
      };

      //TODO use baseconfig to setup generic watch collection instead of the 3 hardcoded ones...
      $scope.priocloudConfig = angular.extend({}, baseConfig, {
          update: function(a,b,c){
              console.log('XXXXX');
              console.log(a);
              console.log(b);
              console.log(c);
              console.log('XXXXX');},    
      });

	 $scope.setValue = function(proj_name, type,val) {
	     var found = $filter('filter')($scope.freqData, {proj: proj_name}, true);
	     if (found.length) {
	         found[0].freq[type]=val;
	         recalculateScore();
	     }
	 }
	 
/*	 //TODO: set UUID as ID from DB instead of this ugly search...
	 $scope.getByName = function(proj_name) {
	     var found = $filter('filter')($scope.freqData, {proj: proj_name}, true);
	     if (found.length) {
	         return (found[0]);
	     }
	     return null;
	 }
*/
    $scope.$watchCollection('freqData', function() {
       console.log('hey, myVar has changed!');
   });

    recalculateScore= function(){
       console.log('time to recalculate!');
        //let's recalculate the total
        angular.forEach($scope.freqData, function(item){
             item.total=item.freq.impact+item.freq.prob+item.freq.prox;
        });
    };
    

}])

//this service will save the state in a REST database
.service('restService', function($http) {
	//var SERVER='http://localhost:8080/rest';
	var SERVER='https://rest.ttsoftware.dk';
	var uuid;
	this.setUser = function(uuid) {
		this.uuid = uuid;
	}
	this.getData = function(department) {
		return $http.get(SERVER +'/' + this.uuid + '/priocloud?rnd=' + (Math.random()) +'&key=department_id&val='+department);
	}
	this.saveData = function(data) {
		return $http.post(SERVER +'/' + this.uuid + '/priocloud', data);
	}
	this.updateData = function(data) {
        var oid=data._id.$oid;
        delete data._id;
		return $http.put(SERVER +'/' + this.uuid + '/priocloud/'+oid, data);
	}
	this.deleteData = function(data) {
		return $http.delete(SERVER +'/' + this.uuid + '/priocloud/' + data._id.$oid);
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
	//var SERVER='http://localhost:8080/user';
	var SERVER='https://user.ttsoftware.dk/user';
	$scope.doLogout = function() {
		$rootScope.user = {
			'authenticated': false,
			'email': null
		};
		$window.sessionStorage["user"] = null;
		$location.path('/');
	};
	$scope.doLogin = function() {
		$http.post(SERVER+'?action=login&email=' + $scope.login.email + '&password=' + $scope.login.password).
		success(function(data, status, headers, config) {
			$rootScope.user = data;
			$window.sessionStorage["user"] = JSON.stringify($rootScope.user);
			if (!$rootScope.user.authenticated) {
				alert('Login failure:\n\n' + data.message);
			}else{
				$location.path('/orgdia');
			}
		});
	};
	$scope.createUser = function() {
		$http.post(SERVER+'?action=create&email=' + $scope.create.email + '&password=' + $scope.create.password).
		success(function(data, status, headers, config) {
			if (data.authenticated) {
				alert('User created.');
			} else {
				alert('User creation failure:\n\n' + data.message);
			}
		});
	};
})

//this controller handles login, logout and user creation
	.controller('OrgCtrl', function($scope, $http, $rootScope, $location, $window){
    		var root = {
    		    "name": "flare",
    		        "children": [{
    		        "name": "analytics",
    		            "children": [{
    		            "name": "cluster",
    		                "children": [{
    		                "name": "AgglomerativeCluster",
    		                    "size": 3938
    		            }, {
    		                "name": "CommunityStructure",
    		                    "size": 3812
    		            }, {
    		                "name": "HierarchicalCluster",
    		                    "size": 6714
    		            }, {
    		                "name": "MergeEdge",
    		                    "size": 743
    		            }]
    		        }, {
    		            "name": "graph",
    		                "children": [{
    		                "name": "BetweennessCentrality",
    		                    "size": 3534
    		            }, {
    		                "name": "LinkDistance",
    		                    "size": 5731
    		            }, {
    		                "name": "MaxFlowMinCut",
    		                    "size": 7840
    		            }, {
    		                "name": "ShortestPaths",
    		                    "size": 5914
    		            }, {
    		                "name": "SpanningTree",
    		                    "size": 3416
    		            }]
    		        }, {
    		            "name": "optimization",
    		                "children": [{
    		                "name": "AspectRatioBanker",
    		                    "size": 7074
    		            }]
    		        }]
    		    }, {
    		        "name": "animate",
    		            "children": [{
    		            "name": "Easing",
    		                "size": 17010
    		        }, {
    		            "name": "FunctionSequence",
    		                "size": 5842
    		        }, {
    		            "name": "interpolate",
    		                "children": [{
    		                "name": "ArrayInterpolator",
    		                    "size": 1983
    		            }, {
    		                "name": "ColorInterpolator",
    		                    "size": 2047
    		            }, {
    		                "name": "DateInterpolator",
    		                    "size": 1375
    		            }, {
    		                "name": "Interpolator",
    		                    "size": 8746
    		            }]
    		        }, {
    		            "name": "ISchedulable",
    		                "size": 1041
    		        }]
    		    }]
    		};
        $scope.root = root;
        var callback = function(department) {
            $scope.department = department;
            $scope.$apply();
        }
        var orgDia = new OrgDia('#orgdia', $scope.root, callback);
        $scope.selectDepartment = function() {
            $location.path("/dashboard/" + $scope.department.name);
        }
        $scope.editDepartment = function() {
            console.log('edit');
            $scope.root.children[0].name = "hest"
                //  orgDia.setName();
                //$location.path("/orgdia");
            var orgDia = new OrgDia('#orgdia', $scope.root, callback);
        }
        $scope.department = "test";
        
	})
;

