angular
    .module('riskApp')
    .service('companyService', ['$rootScope', '$q', 'rx', 'restService', function ($rootScope, $q, rx, restService) {

        var _this = this;

        _this._company = {};
        _this._projects = [];
        _this._systems = [];
        _this._processs = [];

        _this.company = new rx.BehaviorSubject({});
        _this.businessUnits = new rx.BehaviorSubject([]);
        _this.projects = new rx.BehaviorSubject([]);
        _this.systems = new rx.BehaviorSubject([]);
        _this.processs = new rx.BehaviorSubject([]);

        _this.projects.subscribe(function (projects) {
            _this._projects = projects;
        });
        _this.processs.subscribe(function (processs) {
            _this._processs = processs;
        });
        _this.systems.subscribe(function (systems) {
            _this._systems = systems;
        });

        _this.company.subscribe(function (company) {
            _this._company = company;
            $rootScope.company = company;
        });

        _this.loadCompany = function () {
            loadCompanyData().then(function (data) {
            });
        };

        _this.reloadCompany = function () {
            loadCompanyBusinessUnitsAndProjects().then(function (data) {
                data.projects.map(function (project) {
                    return project;
                });
                _this.businessUnits.onNext(data.businessUnits);
                _this.projects.onNext(data.projects);
            });
        };

        _this.reloadSystems = function () {           
            loadCompanySystems().then(function (data) {                
                _this.systems.onNext(data.systems);
            });
        };
        _this.reloadProcesss = function () {           
            loadCompanyProcesss().then(function (data) {                
                _this.processs.onNext(data.processs);
            });
        };


        function loadCompanySystems() {
            var deferred = $q.defer();
            restService.getData('system').then(function (dataResponse) {
                if (dataResponse.data && dataResponse.data.length > 0) {
                    _this.systems.onNext(dataResponse.data);
                }
            });
            return deferred.promise;
        }
        function loadCompanyProcesss() {
            var deferred = $q.defer();
            restService.getData('process').then(function (dataResponse) {
                if (dataResponse.data && dataResponse.data.length > 0) {
                    _this.processs.onNext(dataResponse.data);
                }
            });
            return deferred.promise;
        }

        /**
         * SOCKET CONN for new project
         */
        /*
        io('https://server.dk/api/projects').listen('new', function (project) {

            _this.projects.onNext(_this._projects.concat([project]));
        });
        */

        _this.saveCompany = function (company) {
            if (company._id) {	//update
                restService.updateData('company', angular.fromJson(company)).success(function () {
                    _this.company.onNext(company);
                });
                console.log("----- Company UPDATED -------");
            } else {	//add
                restService.saveData('company', angular.fromJson(company)).success(function (dataResponse) {
                    _this.company.onNext(dataResponse);
                });
                console.log("----- Company ADD -------");
            }
        };

        //SYSTEMS START
        _this.getSystem = function (systemId) {
            return _this.systems
                .flatMap(function (systems) {
                    return rx.Observable.fromArray(systems);
                })
                .first(function (a) {
                    return a && a._id.$oid === systemId;
                });
        };

        _this.saveSystem = function (system, user) {
            _this.saveSystemName(system, user, true)
        }
        _this.saveSystemOnLoad = function (system) {
            _this.saveSystemName(system, null, false)
        }
        _this.saveSystemName = function (system, user, showSaver) {
            systemhaschanged = false;
            deleteThis = false;
            if (showSaver) {
                if ((system.pm != null && user.email == system.pm.email) ||
                    (system.altpm != null && user.email == system.altpm.email)) {
                    system.lastchangeddatepm = new Date();
                    system.lastchangedbypm = user.name;
                }
                if ((system.po != null && user.email == system.po.email) ||
                    (system.altpo != null && user.email == system.altpo.email)) {
                    system.lastchangeddatepo = new Date();
                    system.lastchangedbypo = user.name;
                }
                system.lastchangeddate = new Date();
                system.lastchangedby = user.name;
            }
            // Update system if it exists
            if (system._id) {
                restService
                    .updateData('system', angular.fromJson(system))
                    .success(function (updatedSystem) {
                        console.log("UPDATED: " + system.title);
                        systemhaschanged = false;
                        deleteThis = false;
                        var systemIndex = _this._systems
                            .map(function (p) { return p._id.$oid; })
                            .indexOf(updatedSystem._id.$oid);
                        if (~systemIndex) {
                            _this._systems[systemIndex] = updatedSystem;
                            _this.systems.onNext(_this._systems);
                        }
                    })
                    .error(function (dataResponse) {
                        console.log('ERROR ...');
                    });
                // Add system if id doesn't exists
            } else {
                restService
                    .saveData('system', angular.fromJson(system))
                    .success(function (newSystem) {
                        _this._systems.push(newSystem);
                        _this.systems.onNext(_this._systems);
                    })
                    .error(function (dataResponse) {
                        console.log('ERROR ...');
                    });
            }
        };

        _this.deleteSystem = function (system) {
            restService
                .deleteData('system', angular.fromJson(system))
                .success(function (dataResponse) {
                    var systemIndex = _this._systems
                        .map(function (p) { return p._id.$oid; })
                        .indexOf(system._id.$oid);

                    _this._systems.splice(systemIndex, 1);
                    _this.systems.onNext(_this._systems);
                })
                .error(function (dataResponse) {
                    console.log('ERROR DELETE SYSTEM');
                });
        };
        //Systems END

        //PROCESSS START
        _this.getProcess = function (processId) {
            return _this.processs
                .flatMap(function (processs) {
                    return rx.Observable.fromArray(processs);
                })
                .first(function (a, b, c) {
                    return a && a._id.$oid === processId;
                });
        };

        _this.saveProcess = function (process, user) {
            _this.saveProcessName(process, user, true)
        }
        _this.saveProcessOnLoad = function (process) {
            _this.saveProcessName(process, null, false)
        }
        _this.saveProcessName = function (process, user, showSaver) {
            processhaschanged = false;
            deleteThis = false;
            if (showSaver) {
                if ((process.pm != null && user.email == process.pm.email) ||
                    (process.altpm != null && user.email == process.altpm.email)) {
                    process.lastchangeddatepm = new Date();
                    process.lastchangedbypm = user.name;
                }
                if ((process.po != null && user.email == process.po.email) ||
                    (process.altpo != null && user.email == process.altpo.email)) {
                    process.lastchangeddatepo = new Date();
                    process.lastchangedbypo = user.name;
                }
                process.lastchangeddate = new Date();
                process.lastchangedby = user.name;
            }
            // Update process if it exists
            if (process._id) {
                restService
                    .updateData('process', angular.fromJson(process))
                    .success(function (updatedProcess) {
                        console.log("UPDATED: " + process.title);
                        processhaschanged = false;
                        deleteThis = false;
                        var processIndex = _this._processs
                            .map(function (p) { return p._id.$oid; })
                            .indexOf(updatedProcess._id.$oid);
                        if (~processIndex) {
                            _this._processs[processIndex] = updatedProcess;
                            _this.processs.onNext(_this._processs);
                        }
                    })
                    .error(function (dataResponse) {
                        console.log('ERROR ...');
                    });
                // Add process if id doesn't exists
            } else {
                restService
                    .saveData('process', angular.fromJson(process))
                    .success(function (newProcess) {
                        _this._processs.push(newProcess);
                        _this.processs.onNext(_this._processs);
                    })
                    .error(function (dataResponse) {
                        console.log('ERROR ...');
                    });
            }
        };

        _this.deleteProcess = function (process) {
            restService
                .deleteData('process', angular.fromJson(process))
                .success(function (dataResponse) {
                    var processIndex = _this._processs
                        .map(function (p) { return p._id.$oid; })
                        .indexOf(process._id.$oid);

                    _this._processs.splice(processIndex, 1);
                    _this.processs.onNext(_this._processs);
                })
                .error(function (dataResponse) {
                    console.log('ERROR DELETE SYSTEM');
                });
        };
        //PROCESSS END


        //PROJECTS START
        _this.getProject = function (projectId) {
            return _this.projects
                .flatMap(function (projects) {
                    return rx.Observable.fromArray(projects);
                })
                .first(function (a, b, c) {
                    return a && a._id.$oid === projectId;
                });
        };

        _this.saveProject = function (project, user) {
            _this.saveProjectName(project, user, true)
        }
        _this.saveProjectOnLoad = function (project) {
            _this.saveProjectName(project, null, false)
        }
        _this.saveProjectName = function (project, user, showSaver) {
            projecthaschanged = false;
            deleteThis = false;
            if (showSaver) {
                if ((project.pm != null && user.email == project.pm.email) ||
                    (project.altpm != null && user.email == project.altpm.email)) {
                    project.lastchangeddatepm = new Date();
                    project.lastchangedbypm = user.name;
                }
                if ((project.po != null && user.email == project.po.email) ||
                    (project.altpo != null && user.email == project.altpo.email)) {
                    project.lastchangeddatepo = new Date();
                    project.lastchangedbypo = user.name;
                }
                project.lastchangeddate = new Date();
                project.lastchangedby = user.name;
            }
            // Update project if it exists
            if (project._id) {
                restService
                    .updateData('project', angular.fromJson(project))
                    .success(function (updatedProject) {
                        console.log("UPDATED: " + project.title);
                        projecthaschanged = false;
                        deleteThis = false;
                        var projectIndex = _this._projects
                            .map(function (p) { return p._id.$oid; })
                            .indexOf(updatedProject._id.$oid);
                        if (~projectIndex) {
                            _this._projects[projectIndex] = updatedProject;
                            _this.projects.onNext(_this._projects);
                        }
                    })
                    .error(function (dataResponse) {
                        console.log('ERROR ...');
                    });
                // Add project if id doesn't exists
            } else {
                restService
                    .saveData('project', angular.fromJson(project))
                    .success(function (newProject) {
                        _this._projects.push(newProject);
                        _this.projects.onNext(_this._projects);
                    })
                    .error(function (dataResponse) {
                        console.log('ERROR ...');
                    });
            }
        };

        _this.deleteProject = function (project) {
            restService
                .deleteData('project', angular.fromJson(project))
                .success(function (dataResponse) {
                    var projectIndex = _this._projects
                        .map(function (p) { return p._id.$oid; })
                        .indexOf(project._id.$oid);

                    _this._projects.splice(projectIndex, 1);
                    _this.projects.onNext(_this._projects);
                })
                .error(function (dataResponse) {
                    console.log('ERROR DELETE PROJECT');
                });
        };


        //Projects END

        function loadCompanyData() {
            var deferred = $q.defer();
            restService.getData('company').then(function (dataResponse) {
                if (dataResponse.data && dataResponse.data.length > 0) {
                    _this.company.onNext(dataResponse.data[0]);
                }
            });
            return deferred.promise;
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
            if (oid != null) {
                return restService.getData('project/' + oid);
            } else {
                console.log("----- OID NULL loadCompanyProjects -------");
                return {};
            }
        }


        function generateUniqueIdsForAllRisksOnProject(project) {
            var anyNewIds = false;
            if (project.risks) {
                project.risks.map(function (risk) {
                    if (!risk._id) {
                        risk._id = Math.random().toString(36).substr(2, 9);
                        anyNewIds = true;
                    }
                    return risk;
                });
            }
            return anyNewIds;
        }

        function generateUniqueIdsForAllMilestonesOnProject(project) {
            var anyNewIds = false;
            if (project.milestones) {
                project.milestones.map(function (milestone) {
                    if (!milestone._id) {
                        milestone._id = Math.random().toString(36).substr(2, 9);
                        anyNewIds = true;
                    }
                    return milestone;
                });
            }
            return anyNewIds;
        }
    }]);