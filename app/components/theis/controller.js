angular
    .module('riskApp')
    .controller('TheisController', [
        '$scope',
        '$rootScope',
        '$http',
        '$location',
        'userService', 
        'companyService',
        '$timeout',
        '$window',
        '$routeParams',
        function (
            $scope,
            $rootScope,
            $http,
            $location,
            userService, 
            companyService,
            $timeout,
            $window,
            $routeParams
        ) {

    $scope.cleanupDemoData = function() {
        console.log("cleanupDemoData");
        $http.post(USERSERVER+'?action=cleanupdemodata&application=priocloud')
            .success(function (data, status, headers, config) {
                alert('Done');
            }).error(function (dataResponse) {
                alert('failure: ' + dataResponse.message);
            });
    }

    $scope.sendMail = function(to, subject, message) {
        var data={'to':to, 'subject':subject, 'message':message};
        console.log("sendMail");
        $http.post("/priomail", data)
            .success(function (data, status, headers, config) {
                alert('Done');
            }).error(function (dataResponse) {
                alert('failure: ' + dataResponse.message);
            });
    }
    $scope.excelDemo = function() {
            /* starting from this data */
            var data = [
              { name: "Barack Obama", pres: 44 },
              { name: "Donald Trump", pres: 45 }
            ];

            /* generate a worksheet */
            var ws = XLSX.utils.json_to_sheet(data);

            /* add to workbook */
            var wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Presidents");

            /* write workbook and force a download */
            XLSX.writeFile(wb, "sheetjs.xlsx");
    }
    $scope.createTemplateProject = function() {
        console.log("create template account");
        $http.post(USERSERVER+'?action=createtemplateproject&application=priocloud')
            .success(function (data, status, headers, config) {
                if (data.authenticated) {
                    userService.authenticate(data);
                    companyService.loadCompany();
                    alert('Your username is: ' + data.email + "\nYour password is: t\nThe project will be automatically erased in 1 week");
                }
            }).error(function (dataResponse) {
                alert('failure: ' + dataResponse.message);
            });
    }

    $scope.cloneData = function() {
        console.log("clone account");
        var userData = JSON.parse($window.sessionStorage["user"]);
        $http.post(USERSERVER+'?action=clone&application=priocloud&auid=' + userData.auid + '&uuid=' + userData.uuid)
            .success(function (data, status, headers, config) {
                alert('Done');
            }).error(function (dataResponse) {
                alert('failure: ' + dataResponse.message);
            });
    }

    $scope.deleteAccount = function() {
        console.log("delete account");
        var userData = JSON.parse($window.sessionStorage["user"]);
        $http.post(USERSERVER+'?action=destroycompany&application=priocloud&auid=' + userData.auid + '&uuid=' + userData.uuid)
            .success(function (data, status, headers, config) {
                alert('Done');
            }).error(function (dataResponse) {
                alert('failure: ' + dataResponse.message);
            });
    }

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
