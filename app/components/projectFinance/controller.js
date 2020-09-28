angular
    .module('riskApp')
    .controller('ProjectFinanceController', [
        '$scope',
        '$routeParams',
        '$location',
        'userService',
        'companyService',
        'routeService',
        'util',
        function (
            $scope,
            $routeParams,
            $location,
            userService,
            companyService,
            routeService,
            util
        ) {

            var projectId = $routeParams.id;

            userService
                .user
                .subscribe(function (user) {
                    $scope.user = user;
                });

            companyService
                .getProject(projectId)
                .subscribe(function (project) {
                    $scope.project = project;
                });

            companyService
                .businessUnits
                .subscribe(function (units) {
                    $scope.bus = units;
                });

            companyService
                .company
                .subscribe(function (company) {
                    $scope.company = company;
                });

            userService
                .users
                .subscribe(function (users) {
                    $scope.sessionsusers = JSON.parse(JSON.stringify(users));
                    for (let i = 0; $scope.sessionsusers != null && i < $scope.sessionsusers.length; i++) {
                        const element = $scope.sessionsusers[i];
                        element.bu = {};
                    };
                });

            routeService
                .route
                .subscribe(function (route) {
                    $scope.route = route.substring(route.lastIndexOf('/') + 1);
                });

            if (($scope.project.editUser != null && $scope.project.editUser.email == $scope.user.email)) {
                $scope.user.changeContent = true;
            } else {
                $scope.user.changeContent = false;
            }
            $scope.year = (new Date()).getFullYear();
            cleanbudget($scope.project);
            loadCostbudget($scope.project);
            loadCostdepend($scope.project);
            loadposted($scope.project);
            listenForViewChanges();


            $scope.close = function () {
                $('.popup').removeClass('active');
                $('.popupbaseline').removeClass('active');
                $('.popupposted').removeClass('active');
            };

            // Baselines


            $scope.closebaseline = function () {
                $('.popupbaseline').removeClass('active');
                $scope.deletebaselineThis = false;
            };

            $scope.savebaseline = function () {
                companyService.saveProjectName($scope.project, $scope.user, true);
                $scope.editbaseline = {};
                $('.popupbaseline').removeClass('active');
                $scope.hasChanged = false;
                $scope.deletebaselineThis = false;
            };

            $scope.addbaseline = function () {
                if ($scope.project.finance.baselines == null) $scope.project.finance.baselines = [];
                var n = {};
                n.baselineuid = util.uuid();
                n.date =  new Date();
                n.peoplecapex = $scope.project.finance.costdepcapextotalttotal;
                n.peopleopex = $scope.project.finance.costdepopextotalttotal;
                n.peopleinternal = $scope.project.finance.costdeptotalinternalttotal;
                n.peopleexternal = $scope.project.finance.costdeptotalexternalttotal;
                n.peopletotal = $scope.project.finance.costdeptotaltotalttotal;
                n.costcapex = $scope.project.finance.costcapexttotal;
                n.costopex = $scope.project.finance.costopexttotal;
                n.costtotal = $scope.project.finance.costtotalttotal;
                n.grandtotal = $scope.project.finance.budTotalgrandSum;

                var last = $scope.project.statuses[$scope.project.statuses.length - 1];

                n.laststatusflag = last.status;
                n.laststatusdate = last.date;
                n.laststatustitle = last.title;
                n.laststatusoverallcomments = last.overallcomments;

                n.startdate = $scope.project.milestones[0].date;
                n.enddate = $scope.project.milestones[0].enddate;
                n.enabler = $scope.project.milestones[0].enablerlable;
                n.limiter = $scope.project.milestones[0].limiterlable;

                n.bu = $scope.project.bu.name;
                n.portfolio = $scope.project.support.name;
                n.state = $scope.project.state;
                n.priority = $scope.project.priority;

                $scope.project.finance.baselines.push(n);
                companyService.saveProjectName($scope.project, $scope.user, true);

                $scope.editbaseline = n;
                $('.popupbaseline').addClass('active');
                $scope.deletebaselineThis = false;
            };

            $scope.editbase = function (c) {
                if (c.baselineuid == undefined) {
                    c.baselineuid = util.uuid();
                }
                $scope.editbaseline = c;
                $('.popupbaseline').addClass('active');
                $scope.deletebaselineThis = false;
            };

            $scope.delbaseline = function (c) {
                $scope.project.finance.baselines.splice($scope.project.finance.baselines.indexOf(c), 1);
                companyService.saveProjectName($scope.project, $scope.user, true);
                $scope.editbaseline = {};
                $('.popupbaseline').removeClass('active');
                $scope.hasChanged = false;
                $scope.deletebaselineThis = false;
            };

            $scope.deletebaseline = function () {
                $scope.deletebaselineThis = true;
            };


            function cleanbudget(project) {

                //costdep totals

                project.finance.costdepcapexexternaltprev = 0;
                project.finance.costdepcapexexternaltq1 = 0;
                project.finance.costdepcapexexternaltq2 = 0;
                project.finance.costdepcapexexternaltq3 = 0;
                project.finance.costdepcapexexternaltq4 = 0;
                project.finance.costdepcapexexternaltyear = 0;
                project.finance.costdepcapexexternaltfuture = 0;
                project.finance.costdepcapexexternalttotal = 0;

                project.finance.costdepopexexternaltprev = 0;
                project.finance.costdepopexexternaltq1 = 0;
                project.finance.costdepopexexternaltq2 = 0;
                project.finance.costdepopexexternaltq3 = 0;
                project.finance.costdepopexexternaltq4 = 0;
                project.finance.costdepopexexternaltyear = 0;
                project.finance.costdepopexexternaltfuture = 0;
                project.finance.costdepopexexternalttotal = 0;

                project.finance.costdepcapexinternaltprev = 0;
                project.finance.costdepcapexinternaltq1 = 0;
                project.finance.costdepcapexinternaltq2 = 0;
                project.finance.costdepcapexinternaltq3 = 0;
                project.finance.costdepcapexinternaltq4 = 0;
                project.finance.costdepcapexinternaltyear = 0;
                project.finance.costdepcapexinternaltfuture = 0;
                project.finance.costdepcapexinternalttotal = 0;

                project.finance.costdepopexinternaltprev = 0;
                project.finance.costdepopexinternaltq1 = 0;
                project.finance.costdepopexinternaltq2 = 0;
                project.finance.costdepopexinternaltq3 = 0;
                project.finance.costdepopexinternaltq4 = 0;
                project.finance.costdepopexinternaltyear = 0;
                project.finance.costdepopexinternaltfuture = 0;
                project.finance.costdepopexinternalttotal = 0;

                project.finance.costdeptotalinternaltprev = 0;
                project.finance.costdeptotalexternaltprev = 0;
                project.finance.costdeptotalinternaltq1 = 0;
                project.finance.costdeptotalinternaltq2 = 0;
                project.finance.costdeptotalinternaltq3 = 0;
                project.finance.costdeptotalinternaltq4 = 0;
                project.finance.costdeptotalinternaltyear = 0;
                project.finance.costdeptotalexternaltq1 = 0;
                project.finance.costdeptotalexternaltq2 = 0;
                project.finance.costdeptotalexternaltq3 = 0;
                project.finance.costdeptotalexternaltq4 = 0;
                project.finance.costdeptotalexternaltyear = 0;
                project.finance.costdeptotalinternaltfuture = 0;
                project.finance.costdeptotalexternaltfuture = 0;
                project.finance.costdeptotalinternalttotal = 0;
                project.finance.costdeptotalexternalttotal = 0;

                project.finance.costdeptotaltotaltprev = 0;
                project.finance.costdeptotaltotaltq1 = 0;
                project.finance.costdeptotaltotaltq2 = 0;
                project.finance.costdeptotaltotaltq3 = 0;
                project.finance.costdeptotaltotaltq4 = 0;
                project.finance.costdeptotaltotaltyear = 0;
                project.finance.costdeptotaltotaltfuture = 0;
                project.finance.costdeptotaltotalttotal = 0;

                project.finance.costdepcapextotaltprev = 0;
                project.finance.costdepcapextotaltq1 = 0;
                project.finance.costdepcapextotaltq2 = 0;
                project.finance.costdepcapextotaltq3 = 0;
                project.finance.costdepcapextotaltq4 = 0;
                project.finance.costdepcapextotaltyear = 0;
                project.finance.costdepcapextotaltfuture = 0;
                project.finance.costdepcapextotalttotal = 0;

                project.finance.costdepopextotaltprev = 0;
                project.finance.costdepopextotaltq1 = 0;
                project.finance.costdepopextotaltq2 = 0;
                project.finance.costdepopextotaltq3 = 0;
                project.finance.costdepopextotaltq4 = 0;
                project.finance.costdepopextotaltyear = 0;
                project.finance.costdepopextotaltfuture = 0;
                project.finance.costdepopextotalttotal = 0;

                //budgets

                project.finance.budcapextprev = 0;
                project.finance.budcapextq1 = 0;
                project.finance.budcapextq2 = 0;
                project.finance.budcapextq3 = 0;
                project.finance.budcapextq4 = 0;
                project.finance.budcapextfuture = 0;

                project.finance.postcapextprev = 0;
                project.finance.postcapextq1 = 0;
                project.finance.postcapextq2 = 0;
                project.finance.postcapextq3 = 0;
                project.finance.postcapextq4 = 0;
                project.finance.postcapextfuture = 0;

                project.finance.budopextprev = 0;
                project.finance.budopextq1 = 0;
                project.finance.budopextq2 = 0;
                project.finance.budopextq3 = 0;
                project.finance.budopextq4 = 0;
                project.finance.budopextfuture = 0;

                project.finance.postopextprev = 0;
                project.finance.postopextq1 = 0;
                project.finance.postopextq2 = 0;
                project.finance.postopextq3 = 0;
                project.finance.postopextq4 = 0;
                project.finance.postopextfuture = 0;


                project.finance.budcapintprev = 0;
                project.finance.budcapintq1 = 0;
                project.finance.budcapintq2 = 0;
                project.finance.budcapintq3 = 0;
                project.finance.budcapintq4 = 0;
                project.finance.budcapintfuture = 0;

                project.finance.postcapintprev = 0;
                project.finance.postcapintq1 = 0;
                project.finance.postcapintq2 = 0;
                project.finance.postcapintq3 = 0;
                project.finance.postcapintq4 = 0;
                project.finance.postcapintfuture = 0;

                project.finance.budopintprev = 0;
                project.finance.budopintq1 = 0;
                project.finance.budopintq2 = 0;
                project.finance.budopintq3 = 0;
                project.finance.budopintq4 = 0;
                project.finance.budopintfuture = 0;

                project.finance.postopintprev = 0;
                project.finance.postopintq1 = 0;
                project.finance.postopintq2 = 0;
                project.finance.postopintq3 = 0;
                project.finance.postopintq4 = 0;
                project.finance.postopintfuture = 0;

            }

            // load dependencies into budget
            function loadCostdepend(project) {
                var thisYear = $scope.year;
                if ($scope.project.filters == undefined) $scope.project.filters = {};
                if ($scope.project.filters.showyear == undefined) {
                    $scope.project.filters.showyear = thisYear;
                } else {
                    thisYear = Number($scope.project.filters.showyear);
                }

                for (let i = 0; project.deps != null && i < project.deps.length; i++) {
                    const c = project.deps[i];

                    c.quantumint = c.quantum * c.rt.capacityintpercent / 100;
                    c.quantumext = c.quantum * c.rt.capacityextpercent / 100;

                    var q1start = (new Date('' + thisYear + ', 1, 1')).getTime();
                    var q2start = (new Date('' + thisYear + ', 4, 1')).getTime();
                    var q3start = (new Date('' + thisYear + ', 7, 1')).getTime();
                    var q4start = (new Date('' + thisYear + ', 10, 1')).getTime();
                    var q1startnext = (new Date('' + (thisYear + 1) + ', 1, 1')).getTime();


                    var daysiprev = 0;
                    var daysinq1 = 0;
                    var daysinq2 = 0;
                    var daysinq3 = 0;
                    var daysinq4 = 0;
                    var daysinfuture = 0;

                    var depstart;
                    var depend;
                    var timeDiff = 0;

                    depstart = Date.parse(c.depdate);
                    depend = Date.parse(c.depdeaddate);

                    // Set budget per quarter
                    c.priceintprev = 0;
                    c.priceintq1 = 0;
                    c.priceintq2 = 0;
                    c.priceintq3 = 0;
                    c.priceintq4 = 0;
                    c.priceintfuture = 0;

                    c.priceextprev = 0;
                    c.priceextq1 = 0;
                    c.priceextq2 = 0;
                    c.priceextq3 = 0;
                    c.priceextq4 = 0;
                    c.priceextfuture = 0;

                    // previous
                    if (depstart < q1start) {
                        timeDiff = Math.abs(depstart - Math.min(depend, q1start));
                        daysiprev = Math.round(timeDiff / (1000 * 3600 * 24));
                        c.priceintprev = Math.round(daysiprev * c.rt.intdayprice * c.quantumint / 100 * 60 / 100 / 1000); // 0,6 effective work day factor
                        c.priceextprev = Math.round(daysiprev * c.rt.extdayprice * c.quantumext / 100 * 60 / 100 / 1000);
                        //console.log("Prev - Dep: " + c.title + ", Days: " + daysiprev);
                    }
                    // this year
                    if ((depstart >= q1start && depstart < q2start) || (depend >= q1start && depend < q2start) || (depstart < q1start && depend >= q2start)) {
                        timeDiff = Math.abs(Math.max(depstart, q1start) - Math.min(depend, q2start));
                        daysinq1 = Math.round(timeDiff / (1000 * 3600 * 24));
                        c.priceintq1 = Math.round(daysinq1 * c.rt.intdayprice * c.quantumint / 100 * 60 / 100 / 1000); // 0,6 effective work day factor
                        c.priceextq1 = Math.round(daysinq1 * c.rt.extdayprice * c.quantumext / 100 * 60 / 100 / 1000);
                        //console.log("Q1 - Dep: " + c.title + ", Days: " + daysinq1);
                    }
                    if ((depstart >= q2start && depstart < q3start) || (depend >= q2start && depend < q3start) || (depstart < q2start && depend >= q3start)) {
                        timeDiff = Math.abs(Math.max(depstart, q2start) - Math.min(depend, q3start));
                        daysinq2 = Math.round(timeDiff / (1000 * 3600 * 24));
                        c.priceintq2 = Math.round(daysinq2 * c.rt.intdayprice * c.quantumint / 100 * 60 / 100 / 1000); // 0,6 effective work day factor
                        c.priceextq2 = Math.round(daysinq2 * c.rt.extdayprice * c.quantumext / 100 * 60 / 100 / 1000);
                        //console.log("Q2 - Dep: " + c.title + ", Days: " + daysinq2);
                    }
                    if ((depstart >= q3start && depstart < q4start) || (depend >= q3start && depend < q4start) || (depstart < q3start && depend >= q4start)) {
                        timeDiff = Math.abs(Math.max(depstart, q3start) - Math.min(depend, q4start));
                        daysinq3 = Math.round(timeDiff / (1000 * 3600 * 24));
                        c.priceintq3 = Math.round(daysinq3 * c.rt.intdayprice * c.quantumint / 100 * 60 / 100 / 1000); // 0,6 effective work day factor
                        c.priceextq3 = Math.round(daysinq3 * c.rt.extdayprice * c.quantumext / 100 * 60 / 100 / 1000);
                        //console.log("Q3 - Dep: " + c.title + ", Days: " + daysinq3);
                    }
                    if ((depstart >= q4start && depstart < q1startnext) || (depend >= q4start && depend < q1startnext) || (depstart < q4start && depend >= q1startnext)) {
                        timeDiff = Math.abs(Math.max(depstart, q4start) - Math.min(depend, q1startnext));
                        daysinq4 = Math.round(timeDiff / (1000 * 3600 * 24));
                        c.priceintq4 = Math.round(daysinq4 * c.rt.intdayprice * c.quantumint / 100 * 60 / 100 / 1000); // 0,6 effective work day factor
                        c.priceextq4 = Math.round(daysinq4 * c.rt.extdayprice * c.quantumext / 100 * 60 / 100 / 1000);
                        //console.log("Q4 - Dep: " + c.title + ", Days: " + daysinq4);
                    }
                    // future
                    if (depend >= q1startnext) {
                        timeDiff = Math.abs(Math.max(depstart, q1startnext) - depend);
                        daysinfuture = Math.round(timeDiff / (1000 * 3600 * 24));
                        c.priceintfuture = Math.round(daysinfuture * c.rt.intdayprice * c.quantumint / 100 * 60 / 100 / 1000); // 0,6 effective work day factor
                        c.priceextfuture = Math.round(daysinfuture * c.rt.extdayprice * c.quantumext / 100 * 60 / 100 / 1000);
                        //console.log("Future - Dep: " + c.title + ", Days: " + daysinfuture);
                    }

                    if (c.depreciationtype == "Capex") {

                        project.finance.costdepcapexinternaltprev += Number(c.priceintprev);
                        project.finance.costdepcapexexternaltprev += Number(c.priceextprev);
                        project.finance.costdepcapextotaltprev += Number(c.priceextprev) + Number(c.priceintprev);

                        project.finance.costdepcapexinternaltq1 += Number(c.priceintq1);
                        project.finance.costdepcapexinternaltq2 += Number(c.priceintq2);
                        project.finance.costdepcapexinternaltq3 += Number(c.priceintq3);
                        project.finance.costdepcapexinternaltq4 += Number(c.priceintq4);
                        project.finance.costdepcapexinternaltyear += Number(c.priceintq1) + Number(c.priceintq2) + Number(c.priceintq3) + Number(c.priceintq4);

                        project.finance.costdepcapexexternaltq1 += Number(c.priceextq1);
                        project.finance.costdepcapexexternaltq2 += Number(c.priceextq2);
                        project.finance.costdepcapexexternaltq3 += Number(c.priceextq3);
                        project.finance.costdepcapexexternaltq4 += Number(c.priceextq4);
                        project.finance.costdepcapexexternaltyear += Number(c.priceextq1) + Number(c.priceextq2) + Number(c.priceextq3) + Number(c.priceextq4);

                        project.finance.costdepcapextotaltq1 += Number(c.priceextq1) + Number(c.priceintq1);
                        project.finance.costdepcapextotaltq2 += Number(c.priceextq2) + Number(c.priceintq2);
                        project.finance.costdepcapextotaltq3 += Number(c.priceextq3) + Number(c.priceintq3);
                        project.finance.costdepcapextotaltq4 += Number(c.priceextq4) + Number(c.priceintq4);
                        project.finance.costdepcapextotaltyear +=
                            Number(c.priceextq1) + Number(c.priceintq1)
                            + Number(c.priceextq2) + Number(c.priceintq2)
                            + Number(c.priceextq3) + Number(c.priceintq3)
                            + Number(c.priceextq4) + Number(c.priceintq4);

                        project.finance.costdepcapexinternaltfuture += Number(c.priceintfuture);
                        project.finance.costdepcapexexternaltfuture += Number(c.priceextfuture);
                        project.finance.costdepcapextotaltfuture += Number(c.priceextfuture) + Number(c.priceintfuture);

                        project.finance.costdepcapexinternalttotal +=
                            Number(c.priceintprev)
                            + Number(c.priceintq1) + Number(c.priceintq2) + Number(c.priceintq3) + Number(c.priceintq4)
                            + Number(c.priceintfuture);

                        project.finance.costdepcapexexternalttotal +=
                            Number(c.priceextprev)
                            + Number(c.priceextq1) + Number(c.priceextq2) + Number(c.priceextq3) + Number(c.priceextq4)
                            + Number(c.priceextfuture);

                        project.finance.costdepcapextotalttotal +=
                            Number(c.priceextprev) + Number(c.priceintprev)
                            + Number(c.priceextq1) + Number(c.priceintq1)
                            + Number(c.priceextq2) + Number(c.priceintq2)
                            + Number(c.priceextq3) + Number(c.priceintq3)
                            + Number(c.priceextq4) + Number(c.priceintq4)
                            + Number(c.priceextfuture) + Number(c.priceintfuture);

                        project.finance.budcapintprev += Number(c.priceintprev);
                        project.finance.budcapextprev += Number(c.priceextprev);
                        project.finance.budcapintq1 += Number(c.priceintq1);
                        project.finance.budcapintq2 += Number(c.priceintq2);
                        project.finance.budcapintq3 += Number(c.priceintq3);
                        project.finance.budcapintq4 += Number(c.priceintq4);
                        project.finance.budcapextq1 += Number(c.priceextq1);
                        project.finance.budcapextq2 += Number(c.priceextq2);
                        project.finance.budcapextq3 += Number(c.priceextq3);
                        project.finance.budcapextq4 += Number(c.priceextq4);
                        project.finance.budcapintfuture += Number(c.priceintfuture);
                        project.finance.budcapextfuture += Number(c.priceextfuture);
                    } else {
                        project.finance.costdepopexinternaltprev += Number(c.priceintprev);
                        project.finance.costdepopexexternaltprev += Number(c.priceextprev);
                        project.finance.costdepopexinternaltq1 += Number(c.priceintq1);
                        project.finance.costdepopexinternaltq2 += Number(c.priceintq2);
                        project.finance.costdepopexinternaltq3 += Number(c.priceintq3);
                        project.finance.costdepopexinternaltq4 += Number(c.priceintq4);
                        project.finance.costdepopexinternaltyear += Number(c.priceintq1) + Number(c.priceintq2) + Number(c.priceintq3) + Number(c.priceintq4);

                        project.finance.costdepopexexternaltq1 += Number(c.priceextq1);
                        project.finance.costdepopexexternaltq2 += Number(c.priceextq2);
                        project.finance.costdepopexexternaltq3 += Number(c.priceextq3);
                        project.finance.costdepopexexternaltq4 += Number(c.priceextq4);
                        project.finance.costdepopexexternaltyear += Number(c.priceextq1) + Number(c.priceextq2) + Number(c.priceextq3) + Number(c.priceextq4);

                        project.finance.costdepopexinternaltfuture += Number(c.priceintfuture);
                        project.finance.costdepopexexternaltfuture += Number(c.priceextfuture);

                        project.finance.costdepopextotaltprev += Number(c.priceintprev) + Number(c.priceextprev);
                        project.finance.costdepopextotaltq1 += Number(c.priceintq1) + Number(c.priceextq1);
                        project.finance.costdepopextotaltq2 += Number(c.priceintq2) + Number(c.priceextq2);
                        project.finance.costdepopextotaltq3 += Number(c.priceintq3) + Number(c.priceextq3);
                        project.finance.costdepopextotaltq4 += Number(c.priceintq4) + Number(c.priceextq4);
                        project.finance.costdepopextotaltyear +=
                            Number(c.priceintq1) + Number(c.priceextq1)
                            + Number(c.priceintq2) + Number(c.priceextq2)
                            + Number(c.priceintq3) + Number(c.priceextq3)
                            + Number(c.priceintq4) + Number(c.priceextq4);
                        project.finance.costdepopextotaltfuture += Number(c.priceintfuture) + Number(c.priceextfuture);
                        project.finance.costdepopextotalttotal +=
                            Number(c.priceintprev) + Number(c.priceextprev)
                            + Number(c.priceintq1) + Number(c.priceextq1)
                            + Number(c.priceintq2) + Number(c.priceextq2)
                            + Number(c.priceintq3) + Number(c.priceextq3)
                            + Number(c.priceintq4) + Number(c.priceextq4)
                            + Number(c.priceintfuture) + Number(c.priceextfuture);

                        project.finance.costdepopexinternalttotal +=
                            Number(c.priceintprev)
                            + Number(c.priceintq1) + Number(c.priceintq2) + Number(c.priceintq3) + Number(c.priceintq4)
                            + Number(c.priceintfuture);

                        project.finance.costdepopexexternalttotal +=
                            Number(c.priceextprev)
                            + Number(c.priceextq1) + Number(c.priceextq2) + Number(c.priceextq3) + Number(c.priceextq4)
                            + Number(c.priceextfuture);

                        project.finance.budopintprev += Number(c.priceintprev);
                        project.finance.budopextprev += Number(c.priceextprev);
                        project.finance.budopextq1 += Number(c.priceextq1);
                        project.finance.budopextq2 += Number(c.priceextq2);
                        project.finance.budopextq3 += Number(c.priceextq3);
                        project.finance.budopextq4 += Number(c.priceextq4);
                        project.finance.budopintq1 += Number(c.priceintq1);
                        project.finance.budopintq2 += Number(c.priceintq2);
                        project.finance.budopintq3 += Number(c.priceintq3);
                        project.finance.budopintq4 += Number(c.priceintq4);
                        project.finance.budopintfuture += Number(c.priceintfuture);
                        project.finance.budopextfuture += Number(c.priceextfuture);
                    }
                    project.finance.costdeptotalinternaltprev += Number(c.priceintprev);
                    project.finance.costdeptotalexternaltprev += Number(c.priceextprev);
                    project.finance.costdeptotalinternaltq1 += Number(c.priceintq1);
                    project.finance.costdeptotalinternaltq2 += Number(c.priceintq2);
                    project.finance.costdeptotalinternaltq3 += Number(c.priceintq3);
                    project.finance.costdeptotalinternaltq4 += Number(c.priceintq4);
                    project.finance.costdeptotalinternaltyear += Number(c.priceintq1) + Number(c.priceintq2) + Number(c.priceintq3) + Number(c.priceintq4);
                    project.finance.costdeptotalexternaltq1 += Number(c.priceextq1);
                    project.finance.costdeptotalexternaltq2 += Number(c.priceextq2);
                    project.finance.costdeptotalexternaltq3 += Number(c.priceextq3);
                    project.finance.costdeptotalexternaltq4 += Number(c.priceextq4);
                    project.finance.costdeptotalexternaltyear += Number(c.priceextq1) + Number(c.priceextq2) + Number(c.priceextq3) + Number(c.priceextq4);
                    project.finance.costdeptotalinternaltfuture += Number(c.priceintfuture);
                    project.finance.costdeptotalexternaltfuture += Number(c.priceextfuture);
                    project.finance.costdeptotalinternalttotal +=
                        Number(c.priceintprev) +
                        Number(c.priceintq1) + Number(c.priceintq2) + Number(c.priceintq3) + Number(c.priceintq4) +
                        Number(c.priceintfuture);
                    project.finance.costdeptotalexternalttotal +=
                        Number(c.priceextprev) +
                        Number(c.priceextq1) + Number(c.priceextq2) + Number(c.priceextq3) + Number(c.priceextq4) +
                        Number(c.priceextfuture);

                    project.finance.costdeptotaltotaltprev += Number(c.priceintprev) + Number(c.priceextprev);
                    project.finance.costdeptotaltotaltq1 += Number(c.priceintq1) + Number(c.priceextq1);
                    project.finance.costdeptotaltotaltq2 += Number(c.priceintq2) + Number(c.priceextq2);
                    project.finance.costdeptotaltotaltq3 += Number(c.priceintq3) + Number(c.priceextq3);
                    project.finance.costdeptotaltotaltq4 += Number(c.priceintq4) + Number(c.priceextq4);
                    project.finance.costdeptotaltotaltyear +=
                        Number(c.priceintq1) + Number(c.priceextq1) +
                        Number(c.priceintq2) + Number(c.priceextq2) +
                        Number(c.priceintq3) + Number(c.priceextq3) +
                        Number(c.priceintq4) + Number(c.priceextq4);
                    project.finance.costdeptotaltotaltfuture += Number(c.priceintfuture) + Number(c.priceextfuture);
                    project.finance.costdeptotaltotalttotal +=
                        Number(c.priceintprev) + Number(c.priceextprev) +
                        Number(c.priceintq1) + Number(c.priceextq1) +
                        Number(c.priceintq2) + Number(c.priceextq2) +
                        Number(c.priceintq3) + Number(c.priceextq3) +
                        Number(c.priceintq4) + Number(c.priceextq4) +
                        Number(c.priceintfuture) + Number(c.priceextfuture);
                }
            }


            // cost items start
            function loadCostbudget(project) {
                project.finance.costcapextprev = 0;
                project.finance.costcapextq1 = 0;
                project.finance.costcapextq2 = 0;
                project.finance.costcapextq3 = 0;
                project.finance.costcapextq4 = 0;
                project.finance.costcapextyear = 0;
                project.finance.costcapextfuture = 0;
                project.finance.costcapexttotal = 0;

                project.finance.costopextprev = 0;
                project.finance.costopextq1 = 0;
                project.finance.costopextq2 = 0;
                project.finance.costopextq3 = 0;
                project.finance.costopextq4 = 0;
                project.finance.costopextyear = 0;
                project.finance.costopextfuture = 0;
                project.finance.costopexttotal = 0;

                project.finance.costtotaltprev = 0;
                project.finance.costtotaltq1 = 0;
                project.finance.costtotaltq2 = 0;
                project.finance.costtotaltq3 = 0;
                project.finance.costtotaltq4 = 0;
                project.finance.costtotaltyear = 0;
                project.finance.costtotaltfuture = 0;
                project.finance.costtotalttotal = 0;

                var thisYear = $scope.year;
                if ($scope.project.filters == undefined) $scope.project.filters = {};
                if ($scope.project.filters.showyear == undefined) {
                    $scope.project.filters.showyear = thisYear;
                } else {
                    thisYear = Number($scope.project.filters.showyear);
                }
                var cyear = thisYear;

                if (project.costitems != null) {
                    for (let i = 0; project.costitems != null && i < project.costitems.length; i++) {
                        const c = project.costitems[i];
                        cyear = Number(c.year);
                        calcCostbudget(c);

                        c.accountnumber = (c.account != undefined && c.account.number != undefined) ? c.account.number : "TBD";

                        if (cyear < thisYear) {
                            if (c.depreciationtype == "Capex") {
                                project.finance.budcapextprev += Number(c.budgettotal);
                                project.finance.costcapextprev += Number(c.budgettotal);
                                project.finance.costcapexttotal += Number(c.budgettotal);

                            } else {
                                project.finance.budopextprev += Number(c.budgettotal);
                                project.finance.costopextprev += Number(c.budgettotal);
                                project.finance.costopexttotal += Number(c.budgettotal);

                            }
                            project.finance.costtotaltprev += Number(c.budgettotal);
                            project.finance.costtotalttotal += Number(c.budgettotal);

                        } else if (cyear == thisYear) {
                            if (c.depreciationtype == "Capex") {
                                project.finance.budcapextq1 += Number(c.priceextbudq1);
                                project.finance.budcapextq2 += Number(c.priceextbudq2);
                                project.finance.budcapextq3 += Number(c.priceextbudq3);
                                project.finance.budcapextq4 += Number(c.priceextbudq4);

                                project.finance.costcapextq1 += Number(c.priceextbudq1);
                                project.finance.costcapextq2 += Number(c.priceextbudq2);
                                project.finance.costcapextq3 += Number(c.priceextbudq3);
                                project.finance.costcapextq4 += Number(c.priceextbudq4);
                                project.finance.costcapextyear += Number(c.priceextbudq1) + Number(c.priceextbudq2) + Number(c.priceextbudq3) + Number(c.priceextbudq4);

                                project.finance.costcapexttotal += Number(c.priceextbudq1) + Number(c.priceextbudq2) + Number(c.priceextbudq3) + Number(c.priceextbudq4);

                            } else {
                                project.finance.budopextq1 += Number(c.priceextbudq1);
                                project.finance.budopextq2 += Number(c.priceextbudq2);
                                project.finance.budopextq3 += Number(c.priceextbudq3);
                                project.finance.budopextq4 += Number(c.priceextbudq4);

                                project.finance.costopextq1 += Number(c.priceextbudq1);
                                project.finance.costopextq2 += Number(c.priceextbudq2);
                                project.finance.costopextq3 += Number(c.priceextbudq3);
                                project.finance.costopextq4 += Number(c.priceextbudq4);
                                project.finance.costopextyear += Number(c.priceextbudq1) + Number(c.priceextbudq2) + Number(c.priceextbudq3) + Number(c.priceextbudq4);

                                project.finance.costopexttotal += Number(c.priceextbudq1) + Number(c.priceextbudq2) + Number(c.priceextbudq3) + Number(c.priceextbudq4);

                            }

                            project.finance.costtotaltq1 += Number(c.priceextbudq1);
                            project.finance.costtotaltq2 += Number(c.priceextbudq2);
                            project.finance.costtotaltq3 += Number(c.priceextbudq3);
                            project.finance.costtotaltq4 += Number(c.priceextbudq4);
                            project.finance.costtotaltyear += Number(c.priceextbudq1) + Number(c.priceextbudq2) + Number(c.priceextbudq3) + Number(c.priceextbudq4);
                            project.finance.costtotalttotal += Number(c.budgettotal);

                        } else if (cyear > thisYear) {
                            if (c.depreciationtype == "Capex") {
                                project.finance.budcapextfuture += Number(c.budgettotal);
                                project.finance.costcapextfuture += Number(c.budgettotal);
                                project.finance.costcapexttotal += Number(c.budgettotal);
                            } else {
                                project.finance.budopextfuture += Number(c.budgettotal);
                                project.finance.costopextfuture += Number(c.budgettotal);
                                project.finance.costopexttotal += Number(c.budgettotal);
                            }
                            project.finance.costtotaltfuture += Number(c.budgettotal);
                            project.finance.costtotalttotal += Number(c.budgettotal);
                        }
                    }
                }
            }

            function calcCostbudget(c) {
                c.priceextbudq1 = Number(c.budq1);
                c.priceextbudq2 = Number(c.budq2);
                c.priceextbudq3 = Number(c.budq3);
                c.priceextbudq4 = Number(c.budq4);
                c.budgettotal = c.priceextbudq1 + c.priceextbudq2 + c.priceextbudq3 + c.priceextbudq4;
            }

//COST ITEMS

            $scope.saveCostitem = function (c) {
                calcCostbudget(c);
                companyService.saveProjectName($scope.project, $scope.user, true);
                $scope.hasChanged = false;
                $scope.newcostitem = {};
                $scope.editcostitem = {};
                $('.popup').removeClass('active');
                cleanbudget($scope.project);
                loadCostbudget($scope.project);
                loadCostdepend($scope.project);
                loadposted($scope.project);
                $scope.deleteThis = false;
            }

            $scope.closecostitem = function () {
                $scope.hasChanged = false;
                $scope.newcostitem = {};
                $scope.editcostitem = {};
                $('.popup').removeClass('active');
                $scope.deleteThis = false;
            };

            $scope.addCostitem = function () {
                newtype = {};
                if ($scope.project.costitems == null) $scope.project.costitems = [];
                newtype.title = "NEW COST ITEM";
                newtype._id = util.uuid();
                newtype.depreciationtype = "Capex";
                newtype.budq1 = 0;
                newtype.budq2 = 0;
                newtype.budq3 = 0;
                newtype.budq4 = 0;
                calcCostbudget(newtype);
                $scope.project.costitems.push(newtype);
                companyService.saveProjectName($scope.project, $scope.user, true);
                $scope.newcostitem = {};
                $scope.editcostitem = newtype;
                $('.popup').addClass('active');
                $scope.deleteThis = false;
            }

            $scope.newCloneCostItem = function (c) {
                if ($scope.user.changeContent) {
                    $scope.editcostitem = angular.copy(c);
                    $scope.editcostitem._id = util.uuid();
                    $scope.editcostitem.title = "NEW CLONE";
                    $scope.project.costitems.push($scope.editcostitem);
                    companyService.saveProjectName($scope.project, $scope.user, true);
                    $scope.deleteThis = false;
                }
            };

            $scope.editCostitem = function (type) {
                $scope.editcostitem = type;
                $scope.newcostitem = {};
                $scope.deleteThis = false;
                $('.popup').addClass('active');
            }

            
            $scope.deleteCostitem = function () {
                $scope.deleteThis = true;
            }

            $scope.delCostitem = function (type) {
                $scope.project.costitems.splice($scope.project.costitems.indexOf(type), 1);
                companyService.saveProjectName($scope.project, $scope.user, true);
                $scope.newcostitem = {};
                $scope.editcostitem = {};
                $scope.deleteThis = false;
                $('.popup').removeClass('active');
                cleanbudget($scope.project);
                loadCostbudget($scope.project);
                loadCostdepend($scope.project);
                loadposted($scope.project);
            }
            //cost items end



            // posted items start
            function loadposted(project) {
                var thisYear = Number(project.filters.showyear);
                var cyear = thisYear;

                if (project.posteditems != null) {
                    for (let i = 0; project.posteditems != null && i < project.posteditems.length; i++) {
                        const c = project.posteditems[i];
                        cyear = Number(c.year);

                        if (cyear < thisYear) {
                            if (c.extint == "External") {
                                if (c.depreciationtype == "Capex") {
                                    project.finance.postcapextprev += Number(c.postedtotal);
                                } else {
                                    project.finance.postopextprev += Number(c.postedtotal);
                                }
                            } else {
                                if (c.depreciationtype == "Capex") {
                                    project.finance.postcapintprev += Number(c.postedtotal);
                                } else {
                                    project.finance.postopintprev += Number(c.postedtotal);
                                }
                            }

                        } else if (cyear == thisYear) {
                            if (c.extint == "External") {
                                if (c.depreciationtype == "Capex") {
                                    project.finance.postcapextq1 += Number(c.pricepostq1);
                                    project.finance.postcapextq2 += Number(c.pricepostq2);
                                    project.finance.postcapextq3 += Number(c.pricepostq3);
                                    project.finance.postcapextq4 += Number(c.pricepostq4);
                                } else {
                                    project.finance.postopextq1 += Number(c.pricepostq1);
                                    project.finance.postopextq2 += Number(c.pricepostq2);
                                    project.finance.postopextq3 += Number(c.pricepostq3);
                                    project.finance.postopextq4 += Number(c.pricepostq4);
                                }
                            } else {
                                if (c.depreciationtype == "Capex") {
                                    project.finance.postcapintq1 += Number(c.pricepostq1);
                                    project.finance.postcapintq2 += Number(c.pricepostq2);
                                    project.finance.postcapintq3 += Number(c.pricepostq3);
                                    project.finance.postcapintq4 += Number(c.pricepostq4);
                                } else {
                                    project.finance.postopintq1 += Number(c.pricepostq1);
                                    project.finance.postopintq2 += Number(c.pricepostq2);
                                    project.finance.postopintq3 += Number(c.pricepostq3);
                                    project.finance.postopintq4 += Number(c.pricepostq4);
                                }
                            }

                        } else if (cyear > thisYear) {
                            if (c.extint == "External") {
                                if (c.depreciationtype == "Capex") {
                                    project.finance.postcapextfuture += Number(c.postedtotal);
                                } else {
                                    project.finance.postopintfuture += Number(c.postedtotal);
                                }
                            } else {
                                if (c.depreciationtype == "Capex") {
                                    project.finance.postcapintfuture += Number(c.postedtotal);
                                } else {
                                    project.finance.postopintfuture += Number(c.postedtotal);
                                }
                            }

                        }
                    }
                }
            }

            function calcposted(c) {
                c.pricepostq1 = Number(c.postq1);
                c.pricepostq2 = Number(c.postq2);
                c.pricepostq3 = Number(c.postq3);
                c.pricepostq4 = Number(c.postq4);
                c.postedtotal = c.pricepostq1 + c.pricepostq2 + c.pricepostq3 + c.pricepostq4;
            }


            $scope.saveposteditem = function (c) {
                calcposted(c);
                companyService.saveProjectName($scope.project, $scope.user, true);
                $scope.hasChanged = false;
                $scope.newposteditem = {};
                $scope.editposteditem = {};
                $('.popupposted').removeClass('active');
                cleanbudget($scope.project);
                loadCostbudget($scope.project);
                loadCostdepend($scope.project);
                loadposted($scope.project);
            }

            $scope.closeposted = function () {
                $scope.hasChanged = false;
                $scope.newposteditem = {};
                $scope.editposteditem = {};
                $('.popupposted').removeClass('active');
            };


            $scope.addposteditem = function () {
                newtype = {};
                if ($scope.project.posteditems == null) $scope.project.posteditems = [];
                newtype.title = "NEW POSTED ITEM";
                newtype._id = util.uuid();
                newtype.ledgercode = "";
                newtype.depreciationtype = "Capex";
                newtype.postq1 = 0;
                newtype.postq2 = 0;
                newtype.postq3 = 0;
                newtype.postq4 = 0;

                calcposted(newtype);
                $scope.project.posteditems.push(newtype);
                companyService.saveProjectName($scope.project, $scope.user, true);
                $scope.newposteditem = {};
                $scope.editposteditem = newtype;
                $('.popupposted').addClass('active');
            }
            $scope.editPosteditem = function (type) {
                $scope.editposteditem = type;
                $scope.newposteditem = {};
                $('.popupposted').addClass('active');
            }
            $scope.delposteditem = function (type) {
                $scope.project.posteditems.splice($scope.project.posteditems.indexOf(type), 1);
                companyService.saveProjectName($scope.project, $scope.user, true);
                $scope.newposteditem = {};
                $scope.editposteditem = {};
                $('.popupposted').removeClass('active');
                cleanbudget($scope.project);
                loadCostbudget($scope.project);
                loadCostdepend($scope.project);
                loadposted($scope.project);
            }
            //post dependencies items end




            $scope.saveProject = function (project) {
                companyService.saveProjectName(project, $scope.user, true);
                $scope.hasChanged = false;
                cleanbudget($scope.project);
                loadCostbudget($scope.project);
                loadCostdepend($scope.project);
                loadposted($scope.project);
            }


            $scope.saveNow = function () {
                var depd = new Date($("#depriciationdate")[0].value);
                if (depd instanceof Date && !isNaN(depd.valueOf())) { $scope.project.depriciationdate = depd.toISOString(); }

                $scope.hasChanged = true;
                cleanbudget($scope.project);
                loadCostbudget($scope.project);
                loadCostdepend($scope.project);
                loadposted($scope.project);
            }

            function listenForViewChanges() {

                $scope.$watch(function () {

                    calculateForBudgetThisYear();
                    calculateForPosted();
                    calculateForDeviation();
                });
            }

            function calculateForDeviation() {
                $scope.project.finance.devcapextprev = ($scope.project.finance.budcapextprev - $scope.project.finance.postcapextprev);
                $scope.project.finance.devcapextq1 = ($scope.project.finance.budcapextq1 - $scope.project.finance.postcapextq1);
                $scope.project.finance.devcapextq2 = ($scope.project.finance.budcapextq2 - $scope.project.finance.postcapextq2);
                $scope.project.finance.devcapextq3 = ($scope.project.finance.budcapextq3 - $scope.project.finance.postcapextq3);
                $scope.project.finance.devcapextq4 = ($scope.project.finance.budcapextq4 - $scope.project.finance.postcapextq4);
                $scope.project.finance.devcapexExternal = ($scope.project.finance.budcapexExternal - $scope.project.finance.postcapexExternal);
                $scope.project.finance.devcapexExternalfuture = ($scope.project.finance.budcapextfuture - $scope.project.finance.postcapextfuture);
                $scope.project.finance.devcapexExternalgrand = ($scope.project.finance.budcapexExternalgrand - $scope.project.finance.postcapexExternalgrand);

                $scope.project.finance.devcapintprev = ($scope.project.finance.budcapintprev - $scope.project.finance.postcapintprev);
                $scope.project.finance.devcapintq1 = ($scope.project.finance.budcapintq1 - $scope.project.finance.postcapintq1);
                $scope.project.finance.devcapintq2 = ($scope.project.finance.budcapintq2 - $scope.project.finance.postcapintq2);
                $scope.project.finance.devcapintq3 = ($scope.project.finance.budcapintq3 - $scope.project.finance.postcapintq3);
                $scope.project.finance.devcapintq4 = ($scope.project.finance.budcapintq4 - $scope.project.finance.postcapintq4);
                $scope.project.finance.devcapexInternal = ($scope.project.finance.budcapexInternal - $scope.project.finance.postcapexInternal);
                $scope.project.finance.devcapexInternalfuture = ($scope.project.finance.budcapintfuture - $scope.project.finance.postcapintfuture);
                $scope.project.finance.devcapexInternalgrand = ($scope.project.finance.budcapexInternalgrand - $scope.project.finance.postcapexInternalgrand);

                $scope.project.finance.devcapexprevSum = ($scope.project.finance.budcapexprevSum - $scope.project.finance.postcapexprevSum);
                $scope.project.finance.devcapexq1Sum = ($scope.project.finance.budcapexq1Sum - $scope.project.finance.postcapexq1Sum);
                $scope.project.finance.devcapexq2Sum = ($scope.project.finance.budcapexq2Sum - $scope.project.finance.postcapexq2Sum);
                $scope.project.finance.devcapexq3Sum = ($scope.project.finance.budcapexq3Sum - $scope.project.finance.postcapexq3Sum);
                $scope.project.finance.devcapexq4Sum = ($scope.project.finance.budcapexq4Sum - $scope.project.finance.postcapexq4Sum);
                $scope.project.finance.devcapexTotal = ($scope.project.finance.budcapexTotal - $scope.project.finance.postcapexTotal);
                $scope.project.finance.devcapexTotalfuture = ($scope.project.finance.budcapexfutureSum - $scope.project.finance.postcapexfutureSum);
                $scope.project.finance.devcapexTotalgrand = ($scope.project.finance.budcapexTotalgrand - $scope.project.finance.postcapexTotalgrand);

                $scope.project.finance.devopextprev = ($scope.project.finance.budopextprev - $scope.project.finance.postopextprev);
                $scope.project.finance.devopextq1 = ($scope.project.finance.budopextq1 - $scope.project.finance.postopextq1);
                $scope.project.finance.devopextq2 = ($scope.project.finance.budopextq2 - $scope.project.finance.postopextq2);
                $scope.project.finance.devopextq3 = ($scope.project.finance.budopextq3 - $scope.project.finance.postopextq3);
                $scope.project.finance.devopextq4 = ($scope.project.finance.budopextq4 - $scope.project.finance.postopextq4);
                $scope.project.finance.devopexExternal = ($scope.project.finance.budopexExternal - $scope.project.finance.postopexExternal);
                $scope.project.finance.devopexExternalfuture = ($scope.project.finance.budopextfuture - $scope.project.finance.postopextfuture);
                $scope.project.finance.devopexExternalgrand = ($scope.project.finance.budopexExternalgrand - $scope.project.finance.postopexExternalgrand);

                $scope.project.finance.devopintprev = ($scope.project.finance.budopintprev - $scope.project.finance.postopintprev);
                $scope.project.finance.devopintq1 = ($scope.project.finance.budopintq1 - $scope.project.finance.postopintq1);
                $scope.project.finance.devopintq2 = ($scope.project.finance.budopintq2 - $scope.project.finance.postopintq2);
                $scope.project.finance.devopintq3 = ($scope.project.finance.budopintq3 - $scope.project.finance.postopintq3);
                $scope.project.finance.devopintq4 = ($scope.project.finance.budopintq4 - $scope.project.finance.postopintq4);
                $scope.project.finance.devopexInternal = ($scope.project.finance.budopexInternal - $scope.project.finance.postopexInternal);
                $scope.project.finance.devopexInternalfuture = ($scope.project.finance.budopintfuture - $scope.project.finance.postopintfuture);
                $scope.project.finance.devopexInternalgrand = ($scope.project.finance.budopexInternalgrand - $scope.project.finance.postopexInternalgrand);

                $scope.project.finance.devopexprevSum = ($scope.project.finance.budopexprevSum - $scope.project.finance.postopexprevSum);
                $scope.project.finance.devopexq1Sum = ($scope.project.finance.budopexq1Sum - $scope.project.finance.postopexq1Sum);
                $scope.project.finance.devopexq2Sum = ($scope.project.finance.budopexq2Sum - $scope.project.finance.postopexq2Sum);
                $scope.project.finance.devopexq3Sum = ($scope.project.finance.budopexq3Sum - $scope.project.finance.postopexq3Sum);
                $scope.project.finance.devopexq4Sum = ($scope.project.finance.budopexq4Sum - $scope.project.finance.postopexq4Sum);
                $scope.project.finance.devopexTotal = ($scope.project.finance.budopexTotal - $scope.project.finance.postopexTotal);
                $scope.project.finance.devopexTotalfuture = ($scope.project.finance.budopexfutureSum - $scope.project.finance.postopexfutureSum);
                $scope.project.finance.devopexTotalgrand = ($scope.project.finance.budopexTotalgrand - $scope.project.finance.postopexTotalgrand);

                $scope.project.finance.devExternalprevTotal = ($scope.project.finance.budExternalprevTotal - $scope.project.finance.postExternalprevTotal);
                $scope.project.finance.devExternalq1Total = ($scope.project.finance.budExternalq1Total - $scope.project.finance.postExternalq1Total);
                $scope.project.finance.devExternalq2Total = ($scope.project.finance.budExternalq2Total - $scope.project.finance.postExternalq2Total);
                $scope.project.finance.devExternalq3Total = ($scope.project.finance.budExternalq3Total - $scope.project.finance.postExternalq3Total);
                $scope.project.finance.devExternalq4Total = ($scope.project.finance.budExternalq4Total - $scope.project.finance.postExternalq4Total);
                $scope.project.finance.devExternalTotalSum = ($scope.project.finance.budExternalTotalSum - $scope.project.finance.postExternalTotalSum);
                $scope.project.finance.devExternalTotalfutureSum = ($scope.project.finance.budExternalTotalfutureSum - $scope.project.finance.postExternalTotalfutureSum);
                $scope.project.finance.devExternalTotalgrandSum = ($scope.project.finance.budExternalTotalgrandSum - $scope.project.finance.postExternalTotalgrandSum);

                $scope.project.finance.devInternalprevTotal = ($scope.project.finance.budInternalprevTotal - $scope.project.finance.postInternalprevTotal);
                $scope.project.finance.devInternalq1Total = ($scope.project.finance.budInternalq1Total - $scope.project.finance.postInternalq1Total);
                $scope.project.finance.devInternalq2Total = ($scope.project.finance.budInternalq2Total - $scope.project.finance.postInternalq2Total);
                $scope.project.finance.devInternalq3Total = ($scope.project.finance.budInternalq3Total - $scope.project.finance.postInternalq3Total);
                $scope.project.finance.devInternalq4Total = ($scope.project.finance.budInternalq4Total - $scope.project.finance.postInternalq4Total);
                $scope.project.finance.devInternalTotalSum = ($scope.project.finance.budInternalTotalSum - $scope.project.finance.postInternalTotalSum);
                $scope.project.finance.devInternalTotalfutureSum = ($scope.project.finance.budInternalTotalfutureSum - $scope.project.finance.postInternalTotalfutureSum);
                $scope.project.finance.devInternalTotalgrandSum = ($scope.project.finance.budInternalTotalgrandSum - $scope.project.finance.postInternalTotalgrandSum);

                $scope.project.finance.devTotalprev = ($scope.project.finance.budTotalprev - $scope.project.finance.postTotalprev);
                $scope.project.finance.devTotalq1 = ($scope.project.finance.budTotalq1 - $scope.project.finance.postTotalq1);
                $scope.project.finance.devTotalq2 = ($scope.project.finance.budTotalq2 - $scope.project.finance.postTotalq2);
                $scope.project.finance.devTotalq3 = ($scope.project.finance.budTotalq3 - $scope.project.finance.postTotalq3);
                $scope.project.finance.devTotalq4 = ($scope.project.finance.budTotalq4 - $scope.project.finance.postTotalq4);
                $scope.project.finance.devTotalSum = ($scope.project.finance.budTotalSum - $scope.project.finance.postTotalSum);
                $scope.project.finance.devTotalfutureSum = ($scope.project.finance.budTotalfutureSum - $scope.project.finance.postTotalfutureSum);
                $scope.project.finance.devTotalgrandSum = ($scope.project.finance.budTotalgrandSum - $scope.project.finance.postTotalgrandSum);

                $scope.project.finance.devAccq1 = ($scope.project.finance.budAccq1 - $scope.project.finance.postAccq1);
                $scope.project.finance.devAccq2 = ($scope.project.finance.budAccq2 - $scope.project.finance.postAccq2);
                $scope.project.finance.devAccq3 = ($scope.project.finance.budAccq3 - $scope.project.finance.postAccq3);
                $scope.project.finance.devAccq4 = ($scope.project.finance.budAccq4 - $scope.project.finance.postAccq4);

            }

            function calculateForPosted() {

                // Capex
                $scope.project.finance.postcapexprevSum = Number($scope.project.finance.postcapextprev) + Number($scope.project.finance.postcapintprev);
                $scope.project.finance.postcapexq1Sum = Number($scope.project.finance.postcapextq1) + Number($scope.project.finance.postcapintq1);
                $scope.project.finance.postcapexq2Sum = Number($scope.project.finance.postcapextq2) + Number($scope.project.finance.postcapintq2);
                $scope.project.finance.postcapexq3Sum = Number($scope.project.finance.postcapextq3) + Number($scope.project.finance.postcapintq3);
                $scope.project.finance.postcapexq4Sum = Number($scope.project.finance.postcapextq4) + Number($scope.project.finance.postcapintq4);
                $scope.project.finance.postcapexfutureSum = Number($scope.project.finance.postcapextfuture) + Number($scope.project.finance.postcapintfuture);

                $scope.project.finance.postcapexExternal = Number($scope.project.finance.postcapextq1) + Number($scope.project.finance.postcapextq2) + Number($scope.project.finance.postcapextq3) + Number($scope.project.finance.postcapextq4);
                $scope.project.finance.postcapexExternalgrand = Number($scope.project.finance.postcapextfuture) + Number($scope.project.finance.postcapexExternal) + Number($scope.project.finance.postcapextprev);
                $scope.project.finance.postcapexInternal = Number($scope.project.finance.postcapintq1) + Number($scope.project.finance.postcapintq2) + Number($scope.project.finance.postcapintq3) + Number($scope.project.finance.postcapintq4);
                $scope.project.finance.postcapexInternalgrand = Number($scope.project.finance.postcapintfuture) + Number($scope.project.finance.postcapexInternal) + Number($scope.project.finance.postcapintprev);

                $scope.project.finance.postcapexTotal = ($scope.project.finance.postcapexExternal + $scope.project.finance.postcapexInternal);
                $scope.project.finance.postcapexTotalgrand = ($scope.project.finance.postcapexfutureSum + $scope.project.finance.postcapexTotal + $scope.project.finance.postcapexprevSum);

                // Opex
                $scope.project.finance.postopexprevSum = Number($scope.project.finance.postopextprev) + Number($scope.project.finance.postopintprev);
                $scope.project.finance.postopexq1Sum = Number($scope.project.finance.postopextq1) + Number($scope.project.finance.postopintq1);
                $scope.project.finance.postopexq2Sum = Number($scope.project.finance.postopextq2) + Number($scope.project.finance.postopintq2);
                $scope.project.finance.postopexq3Sum = Number($scope.project.finance.postopextq3) + Number($scope.project.finance.postopintq3);
                $scope.project.finance.postopexq4Sum = Number($scope.project.finance.postopextq4) + Number($scope.project.finance.postopintq4);
                $scope.project.finance.postopexfutureSum = Number($scope.project.finance.postopextfuture) + Number($scope.project.finance.postopintfuture);

                $scope.project.finance.postopexExternal = Number($scope.project.finance.postopextq1) + Number($scope.project.finance.postopextq2) + Number($scope.project.finance.postopextq3) + Number($scope.project.finance.postopextq4);
                $scope.project.finance.postopexExternalgrand = Number($scope.project.finance.postopextfuture) + Number($scope.project.finance.postopexExternal) + Number($scope.project.finance.postopextprev);
                $scope.project.finance.postopexInternal = Number($scope.project.finance.postopintq1) + Number($scope.project.finance.postopintq2) + Number($scope.project.finance.postopintq3) + Number($scope.project.finance.postopintq4);
                $scope.project.finance.postopexInternalgrand = Number($scope.project.finance.postopintfuture) + Number($scope.project.finance.postopexInternal) + Number($scope.project.finance.postopintprev);

                $scope.project.finance.postopexTotal = ($scope.project.finance.postopexExternal + $scope.project.finance.postopexInternal);
                $scope.project.finance.postopexTotalgrand = ($scope.project.finance.postopexfutureSum + $scope.project.finance.postopexTotal + $scope.project.finance.postopexprevSum);



                // Totals
                $scope.project.finance.postExternalprevTotal = Number($scope.project.finance.postcapextprev) + Number($scope.project.finance.postopextprev);
                $scope.project.finance.postExternalq1Total = Number($scope.project.finance.postcapextq1) + Number($scope.project.finance.postopextq1);
                $scope.project.finance.postExternalq2Total = Number($scope.project.finance.postcapextq2) + Number($scope.project.finance.postopextq2);
                $scope.project.finance.postExternalq3Total = Number($scope.project.finance.postcapextq3) + Number($scope.project.finance.postopextq3);
                $scope.project.finance.postExternalq4Total = Number($scope.project.finance.postcapextq4) + Number($scope.project.finance.postopextq4);

                $scope.project.finance.postExternalTotalSum = $scope.project.finance.postExternalq1Total + $scope.project.finance.postExternalq2Total + $scope.project.finance.postExternalq3Total + $scope.project.finance.postExternalq4Total;
                $scope.project.finance.postExternalTotalfutureSum = $scope.project.finance.postopextfuture + $scope.project.finance.postcapextfuture;
                $scope.project.finance.postExternalTotalgrandSum = $scope.project.finance.postExternalTotalfutureSum + $scope.project.finance.postExternalTotalSum + $scope.project.finance.postExternalprevTotal;

                $scope.project.finance.postInternalprevTotal = Number($scope.project.finance.postopintprev) + Number($scope.project.finance.postcapintprev);
                $scope.project.finance.postInternalq1Total = Number($scope.project.finance.postcapintq1) + Number($scope.project.finance.postopintq1);
                $scope.project.finance.postInternalq2Total = Number($scope.project.finance.postcapintq2) + Number($scope.project.finance.postopintq2);
                $scope.project.finance.postInternalq3Total = Number($scope.project.finance.postcapintq3) + Number($scope.project.finance.postopintq3);
                $scope.project.finance.postInternalq4Total = Number($scope.project.finance.postcapintq4) + Number($scope.project.finance.postopintq4);

                $scope.project.finance.postInternalTotalSum = $scope.project.finance.postInternalq1Total + $scope.project.finance.postInternalq2Total + $scope.project.finance.postInternalq3Total + $scope.project.finance.postInternalq4Total;
                $scope.project.finance.postInternalTotalfutureSum = $scope.project.finance.postopintfuture + $scope.project.finance.postcapintfuture;
                $scope.project.finance.postInternalTotalgrandSum = $scope.project.finance.postInternalTotalfutureSum + $scope.project.finance.postInternalTotalSum + $scope.project.finance.postInternalprevTotal;

                $scope.project.finance.postTotalprev = $scope.project.finance.postExternalprevTotal + $scope.project.finance.postInternalprevTotal;
                $scope.project.finance.postTotalq1 = $scope.project.finance.postExternalq1Total + $scope.project.finance.postInternalq1Total;
                $scope.project.finance.postTotalq2 = $scope.project.finance.postExternalq2Total + $scope.project.finance.postInternalq2Total;
                $scope.project.finance.postTotalq3 = $scope.project.finance.postExternalq3Total + $scope.project.finance.postInternalq3Total;
                $scope.project.finance.postTotalq4 = $scope.project.finance.postExternalq4Total + $scope.project.finance.postInternalq4Total;

                $scope.project.finance.postTotalSum = $scope.project.finance.postTotalq1 + $scope.project.finance.postTotalq2 + $scope.project.finance.postTotalq3 + $scope.project.finance.postTotalq4;

                $scope.project.finance.postTotalfutureSum = $scope.project.finance.postInternalTotalfutureSum + $scope.project.finance.postExternalTotalfutureSum;
                $scope.project.finance.postTotalgrandSum = $scope.project.finance.postTotalfutureSum + $scope.project.finance.postTotalSum + $scope.project.finance.postTotalprev;

                $scope.project.finance.postAccq1 = $scope.project.finance.postTotalq1;
                $scope.project.finance.postAccq2 = $scope.project.finance.postTotalq1 + $scope.project.finance.postTotalq2;
                $scope.project.finance.postAccq3 = $scope.project.finance.postTotalq1 + $scope.project.finance.postTotalq2 + $scope.project.finance.postTotalq3;
                $scope.project.finance.postAccq4 = $scope.project.finance.postTotalq1 + $scope.project.finance.postTotalq2 + $scope.project.finance.postTotalq3 + $scope.project.finance.postTotalq4;
            }

            function calculateForBudgetThisYear() {

                // Capex
                $scope.project.finance.budcapexprevSum = Number($scope.project.finance.budcapextprev) + Number($scope.project.finance.budcapintprev);
                $scope.project.finance.budcapexq1Sum = Number($scope.project.finance.budcapextq1) + Number($scope.project.finance.budcapintq1);
                $scope.project.finance.budcapexq2Sum = Number($scope.project.finance.budcapextq2) + Number($scope.project.finance.budcapintq2);
                $scope.project.finance.budcapexq3Sum = Number($scope.project.finance.budcapextq3) + Number($scope.project.finance.budcapintq3);
                $scope.project.finance.budcapexq4Sum = Number($scope.project.finance.budcapextq4) + Number($scope.project.finance.budcapintq4);
                $scope.project.finance.budcapexfutureSum = Number($scope.project.finance.budcapextfuture) + Number($scope.project.finance.budcapintfuture);

                $scope.project.finance.budcapexExternal = Number($scope.project.finance.budcapextq1) + Number($scope.project.finance.budcapextq2) + Number($scope.project.finance.budcapextq3) + Number($scope.project.finance.budcapextq4);
                $scope.project.finance.budcapexExternalgrand = Number($scope.project.finance.budcapextfuture) + Number($scope.project.finance.budcapexExternal) + Number($scope.project.finance.budcapextprev);
                $scope.project.finance.budcapexInternal = Number($scope.project.finance.budcapintq1) + Number($scope.project.finance.budcapintq2) + Number($scope.project.finance.budcapintq3) + Number($scope.project.finance.budcapintq4);
                $scope.project.finance.budcapexInternalgrand = Number($scope.project.finance.budcapintfuture) + Number($scope.project.finance.budcapexInternal) + Number($scope.project.finance.budcapintprev);

                $scope.project.finance.budcapexTotal = ($scope.project.finance.budcapexExternal + $scope.project.finance.budcapexInternal);
                $scope.project.finance.budcapexTotalgrand = ($scope.project.finance.budcapexfutureSum + $scope.project.finance.budcapexTotal + $scope.project.finance.budcapexprevSum);

                // Opex
                $scope.project.finance.budopexprevSum = Number($scope.project.finance.budopextprev) + Number($scope.project.finance.budopintprev);
                $scope.project.finance.budopexq1Sum = Number($scope.project.finance.budopextq1) + Number($scope.project.finance.budopintq1);
                $scope.project.finance.budopexq2Sum = Number($scope.project.finance.budopextq2) + Number($scope.project.finance.budopintq2);
                $scope.project.finance.budopexq3Sum = Number($scope.project.finance.budopextq3) + Number($scope.project.finance.budopintq3);
                $scope.project.finance.budopexq4Sum = Number($scope.project.finance.budopextq4) + Number($scope.project.finance.budopintq4);
                $scope.project.finance.budopexfutureSum = Number($scope.project.finance.budopextfuture) + Number($scope.project.finance.budopintfuture);

                $scope.project.finance.budopexExternal = Number($scope.project.finance.budopextq1) + Number($scope.project.finance.budopextq2) + Number($scope.project.finance.budopextq3) + Number($scope.project.finance.budopextq4);
                $scope.project.finance.budopexExternalgrand = Number($scope.project.finance.budopextfuture) + Number($scope.project.finance.budopexExternal) + Number($scope.project.finance.budopextprev);
                $scope.project.finance.budopexInternal = Number($scope.project.finance.budopintq1) + Number($scope.project.finance.budopintq2) + Number($scope.project.finance.budopintq3) + Number($scope.project.finance.budopintq4);
                $scope.project.finance.budopexInternalgrand = Number($scope.project.finance.budopintfuture) + Number($scope.project.finance.budopexInternal) + Number($scope.project.finance.budopintprev);

                $scope.project.finance.budopexTotal = ($scope.project.finance.budopexExternal + $scope.project.finance.budopexInternal);
                $scope.project.finance.budopexTotalgrand = ($scope.project.finance.budopexfutureSum + $scope.project.finance.budopexTotal + $scope.project.finance.budopexprevSum);



                // Totals
                $scope.project.finance.budExternalprevTotal = Number($scope.project.finance.budcapextprev) + Number($scope.project.finance.budopextprev);
                $scope.project.finance.budExternalq1Total = Number($scope.project.finance.budcapextq1) + Number($scope.project.finance.budopextq1);
                $scope.project.finance.budExternalq2Total = Number($scope.project.finance.budcapextq2) + Number($scope.project.finance.budopextq2);
                $scope.project.finance.budExternalq3Total = Number($scope.project.finance.budcapextq3) + Number($scope.project.finance.budopextq3);
                $scope.project.finance.budExternalq4Total = Number($scope.project.finance.budcapextq4) + Number($scope.project.finance.budopextq4);

                $scope.project.finance.budExternalTotalSum = $scope.project.finance.budExternalq1Total + $scope.project.finance.budExternalq2Total + $scope.project.finance.budExternalq3Total + $scope.project.finance.budExternalq4Total;
                $scope.project.finance.budExternalTotalfutureSum = $scope.project.finance.budopextfuture + $scope.project.finance.budcapextfuture;
                $scope.project.finance.budExternalTotalgrandSum = $scope.project.finance.budExternalTotalfutureSum + $scope.project.finance.budExternalTotalSum + $scope.project.finance.budExternalprevTotal;

                $scope.project.finance.budInternalprevTotal = Number($scope.project.finance.budopintprev) + Number($scope.project.finance.budcapintprev);
                $scope.project.finance.budInternalq1Total = Number($scope.project.finance.budcapintq1) + Number($scope.project.finance.budopintq1);
                $scope.project.finance.budInternalq2Total = Number($scope.project.finance.budcapintq2) + Number($scope.project.finance.budopintq2);
                $scope.project.finance.budInternalq3Total = Number($scope.project.finance.budcapintq3) + Number($scope.project.finance.budopintq3);
                $scope.project.finance.budInternalq4Total = Number($scope.project.finance.budcapintq4) + Number($scope.project.finance.budopintq4);

                $scope.project.finance.budInternalTotalSum = $scope.project.finance.budInternalq1Total + $scope.project.finance.budInternalq2Total + $scope.project.finance.budInternalq3Total + $scope.project.finance.budInternalq4Total;
                $scope.project.finance.budInternalTotalfutureSum = $scope.project.finance.budopintfuture + $scope.project.finance.budcapintfuture;
                $scope.project.finance.budInternalTotalgrandSum = $scope.project.finance.budInternalTotalfutureSum + $scope.project.finance.budInternalTotalSum + $scope.project.finance.budInternalprevTotal;

                $scope.project.finance.budTotalprev = $scope.project.finance.budExternalprevTotal + $scope.project.finance.budInternalprevTotal;
                $scope.project.finance.budTotalq1 = $scope.project.finance.budExternalq1Total + $scope.project.finance.budInternalq1Total;
                $scope.project.finance.budTotalq2 = $scope.project.finance.budExternalq2Total + $scope.project.finance.budInternalq2Total;
                $scope.project.finance.budTotalq3 = $scope.project.finance.budExternalq3Total + $scope.project.finance.budInternalq3Total;
                $scope.project.finance.budTotalq4 = $scope.project.finance.budExternalq4Total + $scope.project.finance.budInternalq4Total;

                $scope.project.finance.budTotalSum = $scope.project.finance.budTotalq1 + $scope.project.finance.budTotalq2 + $scope.project.finance.budTotalq3 + $scope.project.finance.budTotalq4;

                $scope.project.finance.budTotalfutureSum = $scope.project.finance.budInternalTotalfutureSum + $scope.project.finance.budExternalTotalfutureSum;
                $scope.project.finance.budTotalgrandSum = $scope.project.finance.budTotalfutureSum + $scope.project.finance.budTotalSum + $scope.project.finance.budTotalprev;

                $scope.project.finance.budAccq1 = $scope.project.finance.budTotalq1;
                $scope.project.finance.budAccq2 = $scope.project.finance.budTotalq1 + $scope.project.finance.budTotalq2;
                $scope.project.finance.budAccq3 = $scope.project.finance.budTotalq1 + $scope.project.finance.budTotalq2 + $scope.project.finance.budTotalq3;
                $scope.project.finance.budAccq4 = $scope.project.finance.budTotalq1 + $scope.project.finance.budTotalq2 + $scope.project.finance.budTotalq3 + $scope.project.finance.budTotalq4;
            }
        }
    ]);
