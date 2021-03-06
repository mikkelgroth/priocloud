angular
    .module('riskApp')
    .controller('LoginController', [
        '$scope',
        '$rootScope',
        '$http',
        '$location',
        'userService', 
        '$timeout',
        '$window',
        '$routeParams',
        function (
            $scope,
            $rootScope,
            $http,
            $location,
            userService, 
            $timeout,
            $window,
            $routeParams
        ) {

                

/*
     //timeout functions
  //displays a warning after 20 seconds, redirects to logout after another 10
  
  //$scope.inactive=false;
  var idleTimer;  //warn the user about imminent timeout
  var reloadTimer;  //redirect to logout page
  function callIdle(){
    console.log("You have been idle too long");
    //$scope.inactive=true; //display GUI warning
    reloadTimer=$timeout(callReload, 2*1000);
  }
  function callReload(){
    console.log("Reload here...");
    //$scope.inactive=false;
    //$location.path("logout");
      $rootScope.logout();
  }
  function movement(){
    //console.log("movement: "+new Date());
    $timeout.cancel(idleTimer);
    $timeout.cancel(reloadTimer);
    idleTimer=$timeout(callIdle, 20*60*1000);
  }
  angular.element(document.body).on('keydown DOMMouseScroll mousedown', movement);
    */
$scope.newPassword = function() {
	    //alert("Setting new password for user [" + $scope.email+ "]: " +$scope.newpassword);
		$http.post(USERSERVER+'?action=updatepassword&application=priocloud&email=' + $scope.email + '&password=' + $scope.newpassword + '&onetimepassword='+$routeParams.otpw).
		success(function(data, status, headers, config) {
			$rootScope.user = data;
			$window.sessionStorage["user"] = JSON.stringify($rootScope.user);

			if (!$rootScope.user.authenticated) {
				alert('Reset failure:\n\n' + data.message);
			}else{
				//movement(); //init when login is done
                            userService.authenticate(data);
                            $location.path('/');
			}
		});
	}


            $scope.login = function () {

                $http
                    .post(USERSERVER + '?action=login&application=priocloud&email=' + $scope.email + '&password=' + $scope.password)
                    .success(function (data, status, headers, config) {

                        if (!data.authenticated) {

                            alert('Login failure:\n\n' + data.message);

                        } else {
                            //movement(); //init when login is done
                            userService.authenticate(data);
                            $location.path('/');
                        }
                    });
            };

            $scope.reloadPrio = function () {
                window.location.reload();
            };

/*
            $scope.logout = function () {
console.log("Logout...");
                userService.invalidate();
                $location.path('/');
            };
*/
            $scope.resetPassword = function (email) {

                $http
                    .post(USERSERVER + '?action=resetpassword&application=priocloud&email=' + email)
                    .success(function (data, status, headers, config) {
                        
                        alert('PW reset and mail sent');
                    
                    }).error(function (dataResponse) {
                        
                        alert('failure: ' + dataResponse.message);
                    });
            };
        }
    ]);
