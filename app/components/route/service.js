angular
    .module('riskApp')
    .service('routeService', ['$rootScope', 'rx', function ($rootScope, rx) {

        var _this = this;

        _this.route = new rx.BehaviorSubject('/');

        _this.setRoute = function (path) {
            _this.route.onNext(path);
        };
    }]);