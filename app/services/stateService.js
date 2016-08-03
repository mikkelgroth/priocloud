angular
    .module('riskApp')
    .service('stateService', ['$rootScope', 'restService', function ($rootScope, restService) {

        var project = {};	//active selected project
        var projects = [];
        var users = [];
        var company = {};
        var bus = [];

        project.milestones = [];
        project.risks = [];
        project.statuses = [];

        this.setUsers = function (users) {
            this.users = users;
        };

        this.getUsers = function () {
            return users;
        };

        this.loadCompany = function () {

            restService.getData('company').then(function (dataResponse) {
                if (dataResponse.data && dataResponse.data.length > 0) {
                    company = dataResponse.data[0];
                    $rootScope.company = dataResponse.data;
                }
            });

            restService.getData('bu').then(function (dataResponse) {
                if (dataResponse.data) {
                    bus = dataResponse.data;
                    $rootScope.bus = dataResponse.data;
                    projects = [];
                    angular.forEach(bus, function (bu) {
                        //{{user.email}} {{bus[0].owner.email}}
                        if (bu.owner && $rootScope.user.email == bu.owner.email) {
                            $rootScope.user.isOwner = true;
                        }

                        //load all projects for this specific bu
                        restService.getData('project/' + bu._id.$oid).then(function (dataResponse) {
                            projects = projects.concat(dataResponse.data);
                            $rootScope.projects = projects;
                            console.log('loading projects for bu [' + bu._id.$oid + '] done');
                        });
                    });
                }
            });
        }

        this.getCompany = function () {
            if (!bus) { bus = [] };
            return company;
        };

        this.addProject = function (newproject) {
            projects.push(newproject);
            $rootScope.projects = projects;
        };

        this.getProjects = function () {
            return projects;
        };

        this.getProject = function () {
            if (!project.milestones) { project.milestones = [] };
            if (!project.risks) { project.risks = [] };
            if (!project.statuses) { project.statuses = [] };
            return project;
        };

        this.setProject = function (p) {
            project = p;
        };
    }]);