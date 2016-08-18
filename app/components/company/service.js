angular
    .module('riskApp')
    .service('companyService', ['$rootScope', '$q', 'rx', 'restService', function ($rootScope, $q, rx, restService) {

        var _this = this;

        _this.company = new rx.BehaviorSubject({});
        _this.businessUnits = new rx.BehaviorSubject([]);
        _this.projects = new rx.BehaviorSubject([]);

        _this.loadCompany = function () {

            loadCompanyData();
            loadCompanyBusinessUnits();
        };

        function loadCompanyData() {

            restService.getData('company').then(function (dataResponse) {

                if (dataResponse.data && dataResponse.data.length > 0) {

                    _this.company.onNext(dataResponse.data[0]);
                }
            });
        }

        function loadCompanyBusinessUnits() {

            restService.getData('bu').then(function (dataResponse) {

                if (dataResponse.data) {

                    var projects = [];
                    var businessUnits = dataResponse.data;

                    _this.businessUnits.onNext(businessUnits);

                    businessUnits.forEach(function (businessUnit, index) {

                        /*
                        if (businessUnit.owner && $rootScope.user.email == businessUnit.owner.email) {
                            $rootScope.user.isOwner = true;
                        }
                        */

                        loadCompanyProjects(businessUnit._id.$oid).then(function (dataResponse) {

                            projects = projects.concat(dataResponse.data);

                            _this.projects.onNext(projects);
                        });
                    });
                }
            });
        }

        function loadCompanyProjects(oid) {

            return restService.getData('project/' + oid);
        }
    }]);