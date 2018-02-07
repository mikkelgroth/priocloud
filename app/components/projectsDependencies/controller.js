    angular
    .module('riskApp')
    .controller('ProjectsDependenciesController', [
        '$scope',
        '$location',
        'userService',
        'companyService',
        function (
            $scope,
            $location,
            userService,
            companyService
        ) {

            $scope.depsearch=[];
            $scope.depsearch.resname=[];
            
            companyService.projects.subscribe(function (projects) {

                $scope.projects = projects;
                $scope.depList = setDepList(projects);
            });

            companyService.businessUnits.subscribe(function (units) {

                $scope.bus = units;
            });
            userService
            .user
            .subscribe(function (user) {

                $scope.user = user;
            });

            userService.users.subscribe(function (users) {

                $scope.users = users;
                $scope.depsearch.resname=[$scope.user.name];
            });

            $scope.goToDepInProject = function (depId, projectId) {

                $location.path('/project/' + projectId + '/dependencies/' + depId);
            };

            

            function setDepList(projects) {

                var deps = [];
                deps = deps.concat.apply([], projects.map(function (project) {

                    if (!project.deps) {
                        return [];
                    }

                    return project.deps.map(function (dep) {

                        dep['projectid'] = project._id.$oid;
                        dep['projectoid'] = project._id.$oid;
                        dep['projecttitle'] = project.title;
                        dep['buname'] = project.bu.name;
                        dep['depbuname'] = (dep != null && dep.bu != null && dep.bu.name != null)?dep.bu.name:"UNKNOWN";
                        dep['support'] = project.support;
                        dep['pstate'] = project.state;
                        dep['ptype'] = project.type;
                        dep['acname'] = (dep.requester != null) ? dep.requester.name : 'TBD';
                        dep['resname'] = (dep.resowner != null) ? dep.resowner.name : 'TBD';
                       
                        
                        
                        return dep;
                    });
                }));

                return deps;
            }


        }
    ]);
