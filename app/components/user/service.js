angular
    .module('riskApp')
    .service('userService', ['$window', '$q', '$http', 'rx', function ($window, $q, $http, rx) {

        var _this = this;

        _this.user = new rx.BehaviorSubject('null');
        _this.userAuthenticated = new rx.BehaviorSubject(false);

        _this.authenticate = function (user) {

            _this.user.subscribe(function (user) {

                $window.sessionStorage["user"] = (user === 'null') ? 'null' : JSON.stringify(user);
            });

            _this.user.onNext(user);
            _this.userAuthenticated.onNext(true);
        };

        _this.invalidate = function () {

            _this.user.onNext('null');
            _this.userAuthenticated.onNext(false);
        };

        _this.validateUser = function (auid, uuid) {

            return $http
                .post(USERSERVER + '?action=getusers&application=priocloud&auid=' + auid + '&uuid=' + uuid)
                .then(function (response) {
                    return response.data;
                });
        };

        _this.checkIfUserIsAuthenticated = function () {

            var defer = $q.defer();
            var userData = $window.sessionStorage["user"];
            if (!userData || userData == 'null') {
                defer.resolve({ authenticated: false });
                return defer.promise;
            }

            var userDataParsed = JSON.parse(userData);

            _this
                .validateUser(userDataParsed.auid, userDataParsed.uuid)
                .then(function(data) {
                    if (data && data.length > 0) {
                        defer.resolve({ authenticated: true, user: userDataParsed });
                    } else {
                        defer.resolve({ authenticated: false });
                    }
                })
                .catch(function() { 
                    defer.resolve({ authenticated: false });
                });

            return defer.promise;
        };
    }]);