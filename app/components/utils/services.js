angular
    .module('riskApp')
    .service('util', function () {
         var _this = this;
         _this.uuid=function () {
                    let u = Date.now().toString(16) + Math.random().toString(16) + '0'.repeat(16);
                    return [u.substr(0, 8), u.substr(8, 4), '4000-8' + u.substr(13, 3), u.substr(16, 12)].join('-');
                }
    })
    .service('restService', ['$http', 'userService', function ($http, userService) {

        var _this = this;
        var _SERVER = DBSERVER

        userService.user.subscribe(function (user) {

            _this.auid = user.auid;
            _this.uuid = user.uuid;
        });

        _this.getData = function (collection, oid) {
            if (_this.uuid != undefined && _this.auid != undefined) {
                if (oid) {

                    return $http.get(_SERVER + '/' + _this.auid + '/' + _this.uuid + '/' + collection + '/' + oid + '?rnd=' + (Math.random()));

                } else {

                    return $http.get(_SERVER + '/' + _this.auid + '/' + _this.uuid + '/' + collection + '?rnd=' + (Math.random()));
                }
            } else {
                console.log("No UUID and or AUID in getData() in util.service.js");
                return;
            }
        };

        _this.updateData = function (collection, data) {
            if (_this.uuid != undefined && _this.auid != undefined) {

                return $http.put(_SERVER + '/' + _this.auid + '/' + _this.uuid + '/' + collection + '/' + data._id.$oid, data);
            } else {
                console.log("No UUID and or AUID in updateData() in util.service.js");
                return;
            }
        };

        _this.saveData = function (collection, data) {
            if (_this.uuid != undefined && _this.auid != undefined) {

                return $http.post(_SERVER + '/' + _this.auid + '/' + _this.uuid + '/' + collection + '', data);
            } else {
                console.log("No UUID and or AUID in saveData() in util.service.js");
                return;
            }
        };

        _this.deleteData = function (collection, data) {
            if (_this.uuid != undefined && _this.auid != undefined) {

                return $http.delete(_SERVER + '/' + _this.auid + '/' + _this.uuid + '/' + collection + '/' + data._id.$oid);
            } else {
                console.log("No UUID and or AUID in deleteData() in util.service.js");
                return;
            }
        };
    }]);