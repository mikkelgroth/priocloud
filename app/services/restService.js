angular
    .module('riskApp')
    .service('restService', ['$http', function ($http) {

        var SERVER = DBSERVER

        var auid;
        var uuid;

        this.setApplication = function (auid, uuid) {
            this.auid = auid;
            this.uuid = uuid;
        };

        this.getData = function (collection, oid) {
            if (oid) {
                return $http.get(SERVER + '/' + this.auid + '/' + this.uuid + '/' + collection + '/' + oid + '?rnd=' + (Math.random()));
            } else {
                return $http.get(SERVER + '/' + this.auid + '/' + this.uuid + '/' + collection + '?rnd=' + (Math.random()));
            }
        };

        this.updateData = function (collection, data) {
            return $http.put(SERVER + '/' + this.auid + '/' + this.uuid + '/' + collection + '/' + data._id.$oid, data);
        };

        this.saveData = function (collection, data) {
            return $http.post(SERVER + '/' + this.auid + '/' + this.uuid + '/' + collection + '', data);
        };

        this.deleteData = function (collection, data) {
            return $http.delete(SERVER + '/' + this.auid + '/' + this.uuid + '/' + collection + '/' + data._id.$oid);
        };
    }]);