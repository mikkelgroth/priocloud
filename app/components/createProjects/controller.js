angular
    .module('riskApp')
    .controller('CreateProjectsController', [
        '$scope',
        '$location',
        'userService',
        'companyService',
        'restService',
        function (
            $scope,
            $location,
            userService,
            companyService,
            restService
        ) {

            userService
                .user
                .subscribe(function (user) {

                    $scope.user = user;
                });

            userService
                .users
                .subscribe(function (users) {

                    $scope.users = users;
                });

            companyService
                .company
                .subscribe(function (company) {

                    $scope.company = company;
                });


            companyService
                .businessUnits
                .subscribe(function (units) {

                    $scope.bus = units;
                });

            companyService
                .projects
                .subscribe(function (projects) {

                    $scope.projects = projects;
                });

            $scope.newProject = function (project) {


                /** Project Details  */
                project.priority ='4. Backlog(H2)';
                project.state = 'Template';
                project.type = 'Project';
                

                /** Project Finance  */
/** bud capex */
                project.finance = new Object();
                project.finance.budcapextprev = 0;
                project.finance.budcapextoneprev = 0;
                project.finance.budcapintprev = 0;

                project.finance.budcapextq1 = 0;
                project.finance.budcapextq2 = 0;
                project.finance.budcapextq3 = 0;
                project.finance.budcapextq4 = 0;

                project.finance.budcapextoneq1 = 0;
                project.finance.budcapextoneq2 = 0;
                project.finance.budcapextoneq3 = 0;
                project.finance.budcapextoneq4 = 0;

                project.finance.budcapintq1 = 0;
                project.finance.budcapintq2 = 0;
                project.finance.budcapintq3 = 0;
                project.finance.budcapintq4 = 0;
/** bud opex */
                project.finance.budopextprev = 0;
                project.finance.budopextoneprev = 0;
                project.finance.budopintprev = 0;

                project.finance.budopextq1 = 0;
                project.finance.budopextq2 = 0;
                project.finance.budopextq3 = 0;
                project.finance.budopextq4 = 0;

                project.finance.budopextoneq1 = 0;
                project.finance.budopextoneq2 = 0;
                project.finance.budopextoneq3 = 0;
                project.finance.budopextoneq4 = 0;

                project.finance.budopintq1 = 0;
                project.finance.budopintq2 = 0;
                project.finance.budopintq3 = 0;
                project.finance.budopintq4 = 0;

/** post capex */
                project.finance.postcapextprev = 0;
                project.finance.postcapextoneprev = 0;
                project.finance.postcapintprev = 0;

                project.finance.postcapextq1 = 0;
                project.finance.postcapextq2 = 0;
                project.finance.postcapextq3 = 0;
                project.finance.postcapextq4 = 0;

                project.finance.postcapextoneq1 = 0;
                project.finance.postcapextoneq2 = 0;
                project.finance.postcapextoneq3 = 0;
                project.finance.postcapextoneq4 = 0;

                project.finance.postcapintq1 = 0;
                project.finance.postcapintq2 = 0;
                project.finance.postcapintq3 = 0;
                project.finance.postcapintq4 = 0;
/** post opex */
                project.finance.postopextprev = 0;
                project.finance.postopextoneprev = 0;
                project.finance.postopintprev = 0;

                project.finance.postopextq1 = 0;
                project.finance.postopextq2 = 0;
                project.finance.postopextq3 = 0;
                project.finance.postopextq4 = 0;

                project.finance.postopextoneq1 = 0;
                project.finance.postopextoneq2 = 0;
                project.finance.postopextoneq3 = 0;
                project.finance.postopextoneq4 = 0;

                project.finance.postopintq1 = 0;
                project.finance.postopintq2 = 0;
                project.finance.postopintq3 = 0;
                project.finance.postopintq4 = 0;

/** next capex */
                project.finance.nextcapextprev = 0;
                project.finance.nextcapextoneprev = 0;
                project.finance.nextcapintprev = 0;

                project.finance.nextcapextq1 = 0;
                project.finance.nextcapextq2 = 0;
                project.finance.nextcapextq3 = 0;
                project.finance.nextcapextq4 = 0;

                project.finance.nextcapextoneq1 = 0;
                project.finance.nextcapextoneq2 = 0;
                project.finance.nextcapextoneq3 = 0;
                project.finance.nextcapextoneq4 = 0;

                project.finance.nextcapintq1 = 0;
                project.finance.nextcapintq2 = 0;
                project.finance.nextcapintq3 = 0;
                project.finance.nextcapintq4 = 0;
/** next opex */
                project.finance.nextopextprev = 0;
                project.finance.nextopextoneprev = 0;
                project.finance.nextopintprev = 0;

                project.finance.nextopextq1 = 0;
                project.finance.nextopextq2 = 0;
                project.finance.nextopextq3 = 0;
                project.finance.nextopextq4 = 0;

                project.finance.nextopextoneq1 = 0;
                project.finance.nextopextoneq2 = 0;
                project.finance.nextopextoneq3 = 0;
                project.finance.nextopextoneq4 = 0;

                project.finance.nextopintq1 = 0;
                project.finance.nextopintq2 = 0;
                project.finance.nextopintq3 = 0;
                project.finance.nextopintq4 = 0;

                project.financeControl = 'Green';
                project.depriciation = 'TBD';
                project.depriciationdate = (new Date()).toISOString();
                project.opexprojectnumber = 'TBD';
                project.projectnumber ='TBD';
                project.isControlled = false;


                /** Project Milestones/Deliverables  */
                project.milestones = [];
                project.milestones.push({});
                project.milestones[0]._id = Math.random().toString(36).substr(2, 9);
                
                project.milestones[0].date = (new Date()).toISOString();
                var end = new Date();
                end.setFullYear(end.getFullYear()+1);
                project.milestones[0].enddate = end.toISOString();
                project.milestones[0].status = 'Green';
                project.milestones[0].state = 'Target';
                project.milestones[0].audience = 'Internal';
                project.milestones[0].acountable = project.po.name;
                project.milestones[0].responsible = project.pm.name;
                project.milestones[0].title = project.title + 'Project';
                project.milestones[0].bena = '1';
                project.milestones[0].effort= '1';
                project.milestones[0].sena= '1';
                project.milestones[0].risklevel= '1';

                /** Project Risk  */
                project.risks = [];
                project.risks.push({});
                project.risks[0]._id = Math.random().toString(36).substr(2, 9);
                
                project.risks[0].title = 'General Project Risk';
                project.risks[0].type = 'Risk';
                project.risks[0].proximity = 'Project';
                project.risks[0].acc = project.pm.name;

                project.risks[0].prob = 1;
                project.risks[0].impact = 1;
                project.risks[0].total = 1;
                project.risks[0].response = 'Accept';
                project.risks[0].acc = 'TBD';
                project.risks[0].audience = 'Internal';
                project.risks[0].status = 'Green';
                project.risks[0].state = 'New';

                /** Project Issue  */
                project.risks.push({});
                project.risks[1]._id = Math.random().toString(36).substr(2, 9);
                
                project.risks[1].title = 'General Project Issue';
                project.risks[1].type = 'Issue';
                project.risks[1].proximity = 'Project';
                project.risks[1].acc = project.pm.name;

                project.risks[1].prob = '1';
                project.risks[1].impact = '1';
                project.risks[1].total = 1;
                project.risks[1].response = 'Accept';
                project.risks[1].acc = 'TBD';
                project.risks[1].audience = 'Internal';
                project.risks[1].status = 'Green';
                project.risks[1].state = 'New';


                /** Project KPI  */
                project.kpi1 = 0;
                project.kpi2 = 0;
                project.kpi3 = 0;
                project.kpi4 = 0;
                project.kpi5 = 0;
                project.kpi6 = 0;
                project.total = 0;


                /** Project Status  */
                project.statuses = [];
                project.statuses.push({});
                project.statuses[0].date = (new Date()).toISOString();   
                project.statuses[0].title = 'Project created';

                project.statuses[0].status = "Green";
                project.statuses[0].overallcomments = "TBD";
                project.statuses[0].statusbc = "Green";
                project.statuses[0].statussc = "Green";
                project.statuses[0].statustl = "Green";
                project.statuses[0].statusres = "Green";
                project.statuses[0].statusbud = "Green";
                project.statuses[0].statusrisk = "Green";
                
                project.statuses[0].apo = "Not evaluated";
                project.statuses[0].statusstate = "Draft";
                project.statuses[0].active = true;
                
                project.statuses[0].cs = "4";
                project.statuses[0].productcs = "4";





                companyService.saveProject(project, $scope.user);
            };

            $scope.editProject = function (project) {

                $location.path('/project/' + project._id.$oid + '/details')
            };

            $scope.deleteProject = function (project) {

                companyService.deleteProject(project);
            };
        }
    ]);
