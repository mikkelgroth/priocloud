angular
    .module('riskApp')
    .service('userService', ['$rootScope', '$window', '$q', '$http', 'rx', '$location', function ($rootScope, $window, $q, $http, rx, $location) {

        var _this = this;

        _this._internalUser = null;

        _this.user = new rx.BehaviorSubject('null');
        _this.userAuthenticated = new rx.BehaviorSubject(false);
        _this.users = new rx.BehaviorSubject([]);

        _this.isUserSubscriptionBound = false;

        _this.authenticate = function (user) {

            if (!_this.isUserSubscriptionBound) {
                _this.isUserSubscriptionBound = true;

                _this.user.subscribe(function (user) {

                    $window.sessionStorage["user"] = (user === 'null') ? 'null' : JSON.stringify(user);

                    _this._internalUser = user;
                    if (user!=null && user.auid!=null && user.uuid!=null) {
                        loadUsers(user.auid, user.uuid);
                    }
                    
                });
            }

            // RISK: HACK user to be admin and not demo
            //user.isOwner = true;
            //user.admin = true;
            //user.demo = false;
            // copy objects
            //const target = qcopy(source);
            function qcopy(src) {
                return Object.assign({}, src);
            }
            $rootScope.rootfiltersProjectsOverview = qcopy(user.userfiltersProjectsOverview);
            $rootScope.rootfiltersDependencies = qcopy(user.userfiltersDependencies);
            $rootScope.rootfiltersDeliverables = qcopy(user.userfiltersDeliverables);
            $rootScope.rootfiltersRisks = qcopy(user.userfiltersRisks);


            _this.user.onNext(user);
            _this.userAuthenticated.onNext(true);
        };

        _this.invalidate = function () {

            _this.user.onNext('null');
            _this.userAuthenticated.onNext(false);
        };

        _this.validateUser = function (auid, uuid) {

            return loadUserForAccount(auid, uuid);
        };

        _this.checkIfUserIsAuthenticated = function () {

            var defer = $q.defer();
            var userData = $window.sessionStorage["user"];
            if (!userData || userData == 'null') {
                ////////////////////////////////////////////////////                
                //PERFORM SSO LOGIN ON BACKEND
                $http.post('/.auth/me').
                    success(function (data, status, headers, config) {
                        console.log('Frontend rest sso=' + data);
                        var email = data[0].user_id;
                        var token = data[0].id_token;
                        $http.post(USERSERVER + '?action=ssologin&application=priocloud&email=' + email + '&token=' + token).
                            success(function (data, status, headers, config) {
                                console.log(data);
                                if (!data.authenticated) {
                                    alert('Login failure:\n\n' + data.message);
                                } else {
                                    //movement(); //init when login is done
                                    _this.authenticate(data);
                                    $location.path('/');
                                }

                            });
                    });
                ////////////////////////////////////////////////////                

                defer.resolve({ authenticated: false });
                return defer.promise;
            }

            var userDataParsed = JSON.parse(userData);

            _this
                .validateUser(userDataParsed.auid, userDataParsed.uuid)
                .then(function (data) {
                    if (data && data.length > 0) {
                        defer.resolve({ authenticated: true, user: userDataParsed });
                    } else {
                        defer.resolve({ authenticated: false });
                    }
                })
                .catch(function () {
                    defer.resolve({ authenticated: false });
                });

            return defer.promise;
        };

        _this.deleteUser = function (user) {

            return $http
                .post(USERSERVER + '?action=deleteuser&application=priocloud&auid=' + _this._internalUser.auid + '&uuid=' + _this._internalUser.uuid + '&email=' + user.email)
                .success(function (data, status, headers, config) {

                    return loadUsers(_this._internalUser.auid, _this._internalUser.uuid);
                });
        };

        _this.createUser = function (user) {

            var data = angular.fromJson(user);

            return $http
                .post(USERSERVER + '?action=adduser&application=priocloud&auid=' + _this._internalUser.auid + '&uuid=' + _this._internalUser.uuid, data)
                .success(function (data, status, headers, config) {

                    return loadUsers(_this._internalUser.auid, _this._internalUser.uuid);
                });
        };

        _this.updateUser = function (user) {

            var data = angular.fromJson(user);

            return $http
                .post(USERSERVER + '?action=updateuser&application=priocloud&auid=' + _this._internalUser.auid + '&uuid=' + _this._internalUser.uuid, data)
                .success(function (data, status, headers, config) {

                    return loadUsers(_this._internalUser.auid, _this._internalUser.uuid);
                });
        };

        _this.resetPassword = function (user) {

            $http
                .post(USERSERVER + '?action=resetpassword&application=priocloud&email=' + user.email)
                .success(function (data, status, headers, config) {

                    alert('PW reset and mail sent');
                });
        };

        function loadUsers(auid, uuid) {

            return loadUserForAccount(auid, uuid).then(function (data) {

                if (data && data.length > 0) {

                    _this.users.onNext(data);
                }

                return data;
            });
        };

        function loadUserForAccount(auid, uuid) {

            return $http
                .post(USERSERVER + '?action=getusers&application=priocloud&auid=' + auid + '&uuid=' + uuid)
                .then(function (response) {
                    return response.data;
                });
        }
    }]);