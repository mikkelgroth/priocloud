angular
    .module('riskApp')
    .service('userService', ['$window', '$q', '$http', 'rx', function ($window, $q, $http, rx) {

        var _this = this;

        _this.user = new rx.BehaviorSubject('null');
        _this.userAuthenticated = new rx.BehaviorSubject(false);
        _this.users = new rx.BehaviorSubject([]);

        _this.authenticate = function (user) {

            _this.user.subscribe(function (user) {

                $window.sessionStorage["user"] = (user === 'null') ? 'null' : JSON.stringify(user);

                loadUsers(user.auid, user.uuid);
            });

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

        function loadUsers(auid, uuid) {

            loadUserForAccount(auid, uuid).then(function(data) {

                if (data && data.length > 0) {
                    
                    _this.users.onNext(data);
                }
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

angular
    .module('riskApp')
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
                    console.log(filterData[keys[j]]+ "    "+item[keys[j]]);
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
    });

Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}