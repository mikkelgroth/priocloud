angular
    .module('riskApp')
    .service('userService', ['$window', '$timeout', 'rx', function ($window, $timeout, rx) {
 
        var _this = this;

        _this.user = new rx.BehaviorSubject({});
        _this.userAuthenticated = new rx.BehaviorSubject(false);

        _this.user.subscribe(function(user) {

            $window.sessionStorage["user"] = JSON.stringify(user);
        });

        _this.authenticate = function (user) {

            _this.user.onNext(user);
            _this.userAuthenticated.onNext(true);
        };

        _this.invalidate = function () {

            _this.user.onNext({});
            _this.userAuthenticated.onNext(false);
        };
    }]);