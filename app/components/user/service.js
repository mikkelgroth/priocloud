angular
    .module('riskApp')
    .service('userService', ['$window', '$timeout', 'rx', function ($window, $timeout, rx) {
 
        var _this = this;

        _this.user = {
            id: 1234,
            name: 'mikkel',
            authenticated: true
        }

        _this.userAuthenticated = new rx.BehaviorSubject(true);

        $window.sessionStorage["user"] = JSON.stringify(_this.user);

        $timeout(function() {
            
            _this.userAuthentication.onNext(false);

        }, 5000);


    }]);