angular
    .module('riskApp')
    .controller('AdminResourceTypesController', [
        '$scope',
        'userService',
        'companyService',
        'util',
        function (
            $scope,
            userService,
            companyService,
            util
        ) {
            $scope.newtype = {};
            userService
                .user
                .subscribe(function (user) {

                    $scope.user = user;
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
                .businessUnits
                .subscribe(function (units) {

                    $scope.bus = units;
                });

            companyService
                .projects
                .subscribe(function (projects) {

                    $scope.projects = projects;

                });
            userService
                .users
                .subscribe(function (users) {
                    $scope.sessionsusers = JSON.parse(JSON.stringify(users));
                    for (let i = 0; i < $scope.sessionsusers.length; i++) {
                        const e = $scope.sessionsusers[i];
                        e.bu = {};
                    }
                });


            $scope.saveCompany = function (company) {
                company.lastsaved = new Date();
                company.lastsavedby = $scope.user.name;
                companyService.saveCompany(company);
            };
            // LOCK
            $scope.companyedit = false;
            if ($scope.company.locked && $scope.company.lockedby != undefined && $scope.company.lockedby != {} && $scope.company.lockedby.name == $scope.user.name) {
                $scope.companyedit = true;
            }

            function calcrestype(type) {
                type.capacity = Number(type.capacityint) + Number(type.capacityext);
                type.intdayprice = Number(type.inthourprice) * 7;
                type.extdayprice = Number(type.exthourprice) * 7;
                if (type.capacity == 0) {
                    type.capacityintpercent = 0;
                    type.capacityextpercent = 0;
                } else if (Number(type.capacityint) == 0) {
                    type.capacityextpercent = 100;
                } else {
                    type.capacityintpercent = Math.ceil(100 * Number(type.capacityint) / type.capacity);
                    type.capacityextpercent = 100 - type.capacityintpercent;
                }
                type.dayprice = 0;
                var intperprice = 0;
                var extperprice = 0;
                if (type.capacityintpercent != 0) {
                    intperprice = Math.ceil(type.intdayprice * type.capacityintpercent / 100)
                }
                if (type.capacityextpercent != 0) {
                    extperprice = Math.ceil(type.extdayprice * type.capacityextpercent / 100)
                }

                type.dayprice = intperprice + extperprice;
            }

            $scope.close = function () {
                $('.popup').removeClass('active');
                $('.popupcat').removeClass('active');
                $('.popupacc').removeClass('active');
            };

            // RESOURCE TYPES
            $scope.saveNowCat = function (type) {
                let o = $scope.company.categories.find(x => x.name === type.catagory);
                if (o != undefined) {
                    type.catGUID = o.catuid;
                }
            };
            $scope.saveNowType = function (type) {
                calcrestype(type);
            };

            $scope.saveType = function (type) {
                let projectchanged = false;
                for (let pindex = 0; pindex < $scope.projects.length; pindex++) {
                    projectchanged = false;
                    const p = $scope.projects[pindex];
                    for (let dindex = 0; p.deps != undefined && dindex < p.deps.length; dindex++) {
                        const d = p.deps[dindex];
                        if (d.rt.name == type.name) {
                            $scope.projects[pindex].deps[dindex].rt = type;
                            projectchanged = true;
                        }
                        if (d.rt.rtuid != undefined && d.rt.rtuid == type.rtuid) {
                            $scope.projects[pindex].deps[dindex].rt = type;
                            projectchanged = true;
                        }
                    }
                    if (projectchanged) {
                        //console.log("Project auto saved new Resourcetype - Project: " + p.title);
                        companyService.saveProject(p, $scope.user);
                    }
                }
                type.lastsaved = new Date();
                type.lastsavedby = $scope.user.name;
                companyService.saveCompany($scope.company);
                $scope.edittype = {};
                $('.popup').removeClass('active');
            };


            $scope.addType = function () {
                if ($scope.company.resourceTypes == null) $scope.company.resourceTypes = [];
                var nt = {};
                nt.rtuid = util.uuid();
                nt.name = "NEW TYPE";
                nt.inthourprice = "150";
                nt.exthourprice = "150";
                nt.intdayprice = 0;
                nt.extdayprice = 0;
                nt.dayprice = 0;
                nt.buname = $scope.bus[0].name;
                nt.resown = "N/A";
                if ($scope.company.categories != null && $scope.company.categories.length > 0) nt.catagory = $scope.company.categories[0].name;
                if ($scope.company.categories != null && $scope.company.categories.length > 0) nt.catGUID = $scope.company.categories[0].catuid;
                nt.capacityint = "0";
                nt.capacityext = "0";
                nt.capacity = 0;
                nt.capacityintpercent = 0;
                nt.capacityextpercent = 0;
                calcrestype(nt);

                $scope.company.resourceTypes.push(nt);
                companyService.saveCompany($scope.company);

                $scope.edittype = nt;
                $('.popup').addClass('active');
            };

            $scope.editType = function (type) {
                if (type.rtuid == undefined) {
                    type.rtuid = util.uuid();
                }
                if (type.catGUID == undefined && type.catagory != undefined && $scope.company.categories != undefined && $scope.company.categories.length > 0) {
                    let o = $scope.company.categories.find(x => x.name === type.catagory);
                    if (o != undefined) {
                        type.catGUID = o.catuid;
                        type.catagory = o.name;
                    }
                }
                else if ($scope.company.categories != undefined && $scope.company.categories.length > 0) {
                    let c = $scope.company.categories.find(x => x.catuid === type.catGUID);
                    if (c != undefined) {

                        type.catGUID = c.catuid;
                        type.catagory = c.name;

                    }
                }
                $scope.edittype = type;
                $('.popup').addClass('active');
            };

            $scope.delType = function (type) {
                $scope.company.resourceTypes.splice($scope.company.resourceTypes.indexOf(type), 1);
                companyService.saveCompany($scope.company);
                $scope.edittype = {};
                $('.popupcat').removeClass('active');

            };

            // Categories

            $scope.saveCat = function () {
                companyService.saveCompany($scope.company);
                $scope.editcat = {};
                $('.popupcat').removeClass('active');
            };



            $scope.addCat = function () {
                if ($scope.company.categories == null) $scope.company.categories = [];
                var n = {};
                n.catuid = util.uuid();
                n.name = "NEW Category";

                $scope.company.categories.push(n);
                companyService.saveCompany($scope.company);

                $scope.editcat = n;
                $('.popupcat').addClass('active');
            };

            $scope.editCat = function (c) {
                if (c.catuid == undefined) {
                    c.catuid = util.uuid();
                }
                $scope.editcat = c;
                $('.popupcat').addClass('active');

            };

            $scope.delCat = function (c) {
                $scope.company.categories.splice($scope.company.categories.indexOf(c), 1);
                companyService.saveCompany($scope.company);
                $scope.editcat = {};
                $('.popupacc').removeClass('active');

            };
            // Accounts

            $scope.saveAcc = function () {
                companyService.saveCompany($scope.company);
                $scope.editacc = {};
                $('.popupacc').removeClass('active');
            };


            $scope.addAcc = function () {
                if ($scope.company.accounts == null) $scope.company.accounts = [];
                var n = {};
                n.accuid = util.uuid();
                n.name = "NEW Account";

                $scope.company.accounts.push(n);
                companyService.saveCompany($scope.company);

                $scope.editacc = n;
                $('.popupacc').addClass('active');
            };

            $scope.editAcc = function (c) {
                if (c.accuid == undefined) {
                    c.accuid = util.uuid();
                }
                $scope.editacc = c;
                $('.popupacc').addClass('active');
            };

            $scope.delAcc = function (c) {
                $scope.company.accounts.splice($scope.company.accounts.indexOf(c), 1);
                companyService.saveCompany($scope.company);
                $scope.editacc = {};
                $('.popupacc').removeClass('active');

            };

        }
    ]);
