angular
    .module('riskApp')
    .service('companyService', ['$rootScope', '$q', 'rx', 'restService', function ($rootScope, $q, rx, restService) {

        var _this = this;

        _this._projects = [];

        _this.company = new rx.BehaviorSubject({});
        _this.businessUnits = new rx.BehaviorSubject([]);
        _this.projects = new rx.BehaviorSubject([]);

        _this.loadCompany = function () {

            loadCompanyData();
            loadCompanyBusinessUnitsAndProjects().then(function (data) {

                data.projects.map(function (project) {

                    generateUniqueIdsForAllRisksOnProject(project);
                    generateUniqueIdsForAllMilestonesOnProject(project);

                    return project;
                });

                _this.businessUnits.onNext(data.businessUnits);
                _this.projects.onNext(data.projects);
            });
        };

        _this.projects.subscribe(function (projects) {

            _this._projects = projects;
        });

        _this.getProject = function (projectId) {

            return _this.projects
                .flatMap(function (projects) {
                    return rx.Observable.fromArray(projects);
                })
                .first(function (a, b, c) {
                    return a && a._id.$oid === projectId;
                });
        };

        _this.saveProject = function (project) {

            // Set total on project 
            project.total = Math.round((
                parseInt(project.kpi1) +
                parseInt(project.kpi2) +
                parseInt(project.kpi3) +
                parseInt(project.kpi4) +
                parseInt(project.kpi5) +
                parseInt(project.kpi6)
            ) / 6);

            // Update project if it exists
            if (project._id) {

                restService.updateData('project', angular.fromJson(project)).success(function (updatedProject) {

                    console.log("----- PROJECT UPDATED (" + project._id.$oid + ")");

                    var projectIndex = _this._projects
                        .map(function (p) { return p._id.$oid; })
                        .indexOf(updatedProject._id.$oid);

                    if (~projectIndex) {

                        _this._projects[projectIndex] = updatedProject;
                        _this.projects.onNext(_this._projects);
                    }

                }).error(function (dataResponse) {

                    console.log('ERROR ...');
                });

            // Add project if id doesn't exists
            } else {

                project.kpi1 = 0;
                project.kpi2 = 0;
                project.kpi3 = 0;
                project.kpi4 = 0;
                project.kpi5 = 0;
                project.kpi6 = 0;
                project.total = 0;

                restService.saveData('project', angular.fromJson(project)).success(function (newProject) {

                    _this._projects.push(newProject);
                    _this.projects.onNext(_this._projects);

                }).error(function (dataResponse) {

                    console.log('ERROR ...');
                });
            }
        };

        function loadCompanyData() {

            restService.getData('company').then(function (dataResponse) {

                if (dataResponse.data && dataResponse.data.length > 0) {

                    _this.company.onNext(dataResponse.data[0]);
                }
            });
        }

        function loadCompanyBusinessUnitsAndProjects() {

            var deferred = $q.defer();

            restService.getData('bu').then(function (dataResponse) {

                if (dataResponse.data) {

                    var projects = [];
                    var businessUnits = dataResponse.data;

                    rx.Observable
                        .fromArray(businessUnits)
                        .map(function (businessUnit) {

                            return businessUnit._id.$oid;
                        })
                        .flatMap(function (businessUnitId) {

                            return rx.Observable
                                .fromPromise(loadCompanyProjects(businessUnitId));
                        })
                        .subscribe(function (dataResponse) {

                            projects = projects.concat(dataResponse.data);

                        }, function (err) { }, function () {

                            deferred.resolve({ businessUnits: businessUnits, projects: projects });
                        });
                }
            });

            return deferred.promise;
        }

        function loadCompanyProjects(oid) {

            return restService.getData('project/' + oid);
        }

        function generateUniqueIdsForAllRisksOnProject(project) {

            project.risks.map(function (risk) {
                risk._id = Math.random().toString(36).substr(2, 9);
                return risk;
            });
        }

        function generateUniqueIdsForAllMilestonesOnProject(project) {

            project.milestones.map(function (milestone) {
                milestone._id = Math.random().toString(36).substr(2, 9);
                return milestone;
            });
        }
    }]);