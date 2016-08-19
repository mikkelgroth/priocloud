angular
    .module('riskApp')
    .service('restService', ['$http', 'userService', function ($http, userService) {

        var _this = this;
        var _SERVER = DBSERVER

        userService.user.subscribe(function (user) {

            _this.auid = user.auid;
            _this.uuid = user.uuid;
        });

        _this.getData = function (collection, oid) {
            
            if (oid) {

                return $http.get(_SERVER + '/' + _this.auid + '/' + _this.uuid + '/' + collection + '/' + oid + '?rnd=' + (Math.random()));
            
            } else {

                return $http.get(_SERVER + '/' + _this.auid + '/' + _this.uuid + '/' + collection + '?rnd=' + (Math.random()));
            }
        };

        _this.updateData = function (collection, data) {

            return $http.put(_SERVER + '/' + _this.auid + '/' + _this.uuid + '/' + collection + '/' + data._id.$oid, data);
        };

        _this.saveData = function (collection, data) {

            return $http.post(_SERVER + '/' + _this.auid + '/' + _this.uuid + '/' + collection + '', data);
        };

        _this.deleteData = function (collection, data) {
            
            return $http.delete(_SERVER + '/' + _this.auid + '/' + _this.uuid + '/' + collection + '/' + data._id.$oid);
        };
    }]);