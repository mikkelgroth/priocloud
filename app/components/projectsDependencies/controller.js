angular
    .module('riskApp')
    .controller('ProjectsDependenciesController', [
        '$scope',
        '$rootScope',
        '$location',
        'userService',
        'companyService',
        function (
            $scope,
            $rootScope,
            $location,
            userService,
            companyService
        ) {

            companyService.company.subscribe(function (company) {
                $scope.company = company;
            });

            companyService.projects.subscribe(function (projects) {
                for (let i = 0; i < projects.length; i++) {
                    const e = projects[i];
                    e.hasdeps = (e.deps != undefined && e.deps.length > 0);
                }
                $scope.projects = projects;

            });

            companyService.businessUnits.subscribe(function (units) {
                $scope.bus = units;
            });

            userService.user.subscribe(function (user) {
                $scope.user = user;
            });

            userService.users.subscribe(function (users) {
                $scope.users = users;
            });
            // copy objects
            //const target = qcopy(source);
            function qcopy(src) {
                return Object.assign({}, src);
            }

            $scope.depList = setDepList($scope.projects, "");
            $scope.rtfromprojectlist = [];
            $scope.rtfrombu = "";
            $scope.rtfromproject = "";
            $scope.onlydepList = [];
            $scope.year = (new Date()).getFullYear();
            $scope.showmepmbutton = true;
            $scope.showmereqbutton = true;
            $scope.showmeownbutton = true;
            $scope.showall = false;
            $scope.showagreed = false;

            if ($scope.depsearch == null) {
                $scope.depsearch = {};
                //console.log("depsearch null");
            }
            setFilterForQlist();
            $scope.views = 'cat';
            $scope.ressums = [];

            calcRes();

            //clear all filters
            $scope.clearall = function () {
                $scope.depsearch = {};
                $scope.rtfrombu = "";
                $scope.rtfromproject = "";
                calcRes();
            }

            //use same as onuserchange
            $scope.saveSearch = function () {
                $scope.rtfrombu = "";
                $scope.rtfromproject = "";
                $rootScope.rootfiltersDependencies = qcopy($scope.depsearch);
                $scope.ressums = [];
                calcRes();
            }




            $scope.goToDepInProject = function (depId, projectId) {

                $location.path('/project/' + projectId + '/dependencies/' + depId);
            };

            $scope.showmepm = function () {
                $scope.depsearch.ppm = [$scope.user.name];
                $scope.showmepmbutton = false;
                $scope.rtfrombu = "";
                $scope.rtfromproject = "";
                $scope.ressums = [];
                calcRes();
            };
            $scope.clearmepm = function () {
                $scope.depsearch.ppm = [];
                $scope.showmepmbutton = true;
                $scope.rtfrombu = "";
                $scope.rtfromproject = "";
                $scope.ressums = [];
                calcRes();
            };
            $scope.showmereq = function () {
                $scope.depsearch.requester = [$scope.user.name];
                $scope.showmereqbutton = false;
                $scope.rtfrombu = "";
                $scope.rtfromproject = "";
                $scope.ressums = [];
                calcRes();
            };
            $scope.clearmereq = function () {
                $scope.depsearch.requester = [];
                $scope.showmereqbutton = true;
                $scope.rtfrombu = "";
                $scope.rtfromproject = "";
                $scope.ressums = [];
                calcRes();
            };
            $scope.showmeown = function () {
                $scope.depsearch.deprtowner = [$scope.user.name];
                $scope.showmeownbutton = false;
                $scope.rtfrombu = "";
                $scope.rtfromproject = "";
                $scope.ressums = [];
                calcRes();
            };
            $scope.clearmeown = function () {
                $scope.depsearch.deprtowner = [];
                $scope.showmeownbutton = true;
                $scope.rtfrombu = "";
                $scope.rtfromproject = "";
                $scope.ressums = [];
                calcRes();
            };
            $scope.sellectRT = function (showlist, r, quarter, year) {
                $scope.depsearch.deprtname = [r.name];
                if (showlist) {
                    $scope.ressums = [];
                    onlydeps($scope.depList, r, quarter, year);
                    calcRes();
                    $scope.views = 'list';
                } else {
                    setFilterForQlist();
                    $scope.ressums = [];
                    onlydeps($scope.depList, r, quarter, year);
                    calcRes();
                    $scope.views = 'qlist';
                }
            };
            $scope.clearRT = function () {
                $scope.depsearch.deprtname = [];
                $scope.rtfrombu = "";
                $scope.rtfromproject = "";
                $scope.rtfromprojectlist = [];
                $scope.ressums = [];
                setFilterForQlist()
                setDepList($scope.projects, "");

                calcRes();
            };
            $scope.sellectCat = function (name) {
                $scope.depsearch.deprtcatagory = [name];
                $scope.ressums = [];
                calcRes();
                $scope.views = 'res';
            };

            $scope.allocated = function () {
                $scope.showagreed = true;
                $scope.depsearch.state = ["Allocated"];
                $scope.ressums = [];
                calcRes();
            };

            $scope.clearAlloc = function () {
                $scope.showagreed = false;
                $scope.depsearch.state = [];
                $scope.rtfromproject = "";
                $scope.ressums = [];
                calcRes();
            };

            function flatten(arr) {
                return arr.reduce(function (flat, toFlatten) {
                    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
                }, []);
            }

            function onlydeps(deplist, r, quarter, year) {
                var capcounter = 0;

                $scope.onlydepList = [];
                var unsorted = [];
                var sorted = [];
                showtypequarter(r, quarter, year);

                var datestart;
                var dateend;
                var depstart;
                var depend;

                for (let i = 0; i < deplist.length; i++) {
                    const e = deplist[i];
                    if (e.rt.name == r.name) {
                        $scope.dispowner = e.rt.resown;
                        depstart = new Date(e.rawdepdate);
                        depend = new Date(e.rawdepdeaddate);

                        if (quarter == "Q1") {
                            datestart = new Date(year, 0, 1);
                            dateend = new Date(year, 3, 1);
                        } else if (quarter == "Q2") {
                            datestart = new Date(year, 3, 1);
                            dateend = new Date(year, 6, 1);
                        } else if (quarter == "Q3") {
                            datestart = new Date(year, 6, 1);
                            dateend = new Date(year, 9, 1);
                        } else {
                            datestart = new Date(year, 9, 1);
                            dateend = new Date(year, 11, 31);
                        }

                        if ((depstart >= datestart && depstart < dateend) || (depstart < datestart && depend >= datestart)) {
                            e.isfreeset = false;
                            unsorted.push(qcopy(e));
                        }
                    }
                }
                //console.log("unsorted:" + unsorted.length);

                var bucketsorted = [[[], [], [], [], []], [[], [], [], [], []], [[], [], [], [], []], [[], [], [], [], []], [[], [], [], [], []], [[], [], [], [], []]];
                for (let s = 0; s < unsorted.length; s++) {
                    const uns = unsorted[s];
                    if ((uns.ppriority.charAt(0) == '1' ||
                        uns.ppriority.charAt(0) == '2' ||
                        uns.ppriority.charAt(0) == '3' ||
                        uns.ppriority.charAt(0) == '4' ||
                        uns.ppriority.charAt(0) == '5') && (
                            uns.penablervalue == '0' ||
                            uns.penablervalue == '1' ||
                            uns.penablervalue == '2' ||
                            uns.penablervalue == '3' ||
                            uns.penablervalue == '4')
                    ) {
                        bucketsorted[uns.ppriority.charAt(0) - 1][4 - uns.penablervalue].push(qcopy(uns));
                    } else {
                        bucketsorted[5][0].push(qcopy(uns));
                    }
                }
                sorted = flatten(bucketsorted);
                var percentage = 0;
                var difference = 0;
                for (let p = 0; p < sorted.length; p++) {
                    const e = sorted[p];
                    e.freestring = "Red";
                    difference = $scope.dispcapacity - capcounter;
                    if (difference > 0) {
                        if (difference >= Number(e.quantum)) {
                            e.freestring = "Green";
                        } else {
                            percentage = difference * 100 / Number(e.quantum)
                            if (percentage > 33) {
                                e.freestring = "Yellow";
                            } else {
                                e.freestring = "Orange";
                            }
                        }
                    }
                    capcounter += Number(e.quantum);
                }
                $scope.onlydepList = sorted;
            };

            function setFilterForQlist() {
                $scope.depsearch.state = ["Allocated", "Requested"];
                $scope.depsearch.pstate = ["Portfolio Approved", "Company Approved", "Progress"];
                $scope.depsearch.deprtcatagory = [];
                $scope.depsearch.deprtname = [];
            };


            function showtypequarter(rt, quarter, year) {
                $scope.disptype = rt.name;
                $scope.disparea = rt.buname;
                $scope.dispcapacity = rt.cap;
                $scope.dispquarter = quarter;
                $scope.dispyear = year;
            };


            $scope.onlyProject = function () {
                if ($scope.onlyfromproject) {
                    $scope.depsearch.projecttitle = [$scope.rtfromproject];
                } else {
                    $scope.depsearch.projecttitle = [];
                }
                $scope.ressums = [];
                calcRes();
                getRTfromProjectfunction();
            };

            $scope.getRTfromBu = function () {
                $scope.rtfromprojectlist = [];
                $scope.rtfromproject = "";
                if ($scope.rtfrombu == "") {
                    $scope.depsearch.deprtname = [];
                    $scope.ressums = [];
                    calcRes();
                    $scope.views = 'cat';
                } else {
                    var rfoundmap = [];
                    for (let i = 0; i < $scope.projects.length; i++) {
                        const e = $scope.projects[i];
                        if (e.bu.name == $scope.rtfrombu && e.deps != undefined && e.deps.length > 0) {
                            $scope.rtfromprojectlist.push(e.title);
                            setDepList($scope.projects, e.title);
                            for (let d = 0; d < e.deps.length; d++) {
                                if (!rfoundmap.includes(e.deps[d].rt.name)) {
                                    rfoundmap.push(e.deps[d].rt.name);
                                }
                            }
                        }
                        if (rfoundmap.length == 0) {
                            $scope.depsearch.deprtname = ['EMPTY'];
                        } else {
                            $scope.depsearch.deprtname = rfoundmap;
                        }
                        $scope.ressums = [];
                        calcRes();
                        $scope.views = 'res';
                    }
                }
            };

            $scope.isRTinFilter = function (filterRT, rt) {
                if (filterRT == undefined) {
                    return false;
                }
                return (filterRT.includes(rt));
            }
            $scope.isCatinFilter = function (filterCat, cat) {
                if (filterCat == undefined) {
                    return false;
                }
                return (filterCat.includes(cat));
            }
            $scope.isResowninFilter = function (filterResown, resown) {
                //console.log("resown filter equal resown type: " + filterResown + " -> " + resown);
                if (filterResown == undefined) {
                    return false;
                }
                return (filterResown.includes(resown));
            }

            $scope.getRTfromProject = function () {
                $scope.rtfromprojectlist = [];
                $scope.rtfrombu = "";
                if ($scope.rtfromproject == "") {
                    $scope.depsearch.deprtname = [];
                    $scope.rtfromprojectlist = [];
                    $scope.ressums = [];
                    calcRes();
                    $scope.views = 'cat';
                } else {
                    var rfoundmap = [];
                    let o = $scope.projects.find(x => x.title === $scope.rtfromproject);
                    if (o != undefined && o.deps != undefined && o.deps.length > 0) {
                        $scope.rtfromprojectlist.push(o.title);
                        setDepList($scope.projects, o.title);
                        for (let d = 0; d < o.deps.length; d++) {
                            if (!rfoundmap.includes(o.deps[d].rt.name)) {
                                rfoundmap.push(o.deps[d].rt.name);
                            }
                        }
                        $scope.depsearch.deprtname = rfoundmap;
                        //console.log(JSON.stringify($scope.depsearch.deprtname));
                    }
                    $scope.ressums = [];
                    calcRes();
                    $scope.views = 'res';
                }
            };

            $scope.getRTfromProject = function () {
                getRTfromProjectfunction();
            };

            function getRTfromProjectfunction() {
                $scope.rtfromprojectlist = [];
                $scope.rtfrombu = "";
                if ($scope.rtfromproject == "") {
                    $scope.depsearch.deprtname = [];
                    $scope.rtfromprojectlist = [];
                    $scope.ressums = [];
                    calcRes();
                    $scope.views = 'cat';
                } else {
                    var rfoundmap = [];
                    let o = $scope.projects.find(x => x.title === $scope.rtfromproject);
                    if (o != undefined && o.deps != undefined && o.deps.length > 0) {
                        $scope.rtfromprojectlist.push(o.title);
                        setDepList($scope.projects, o.title);
                        for (let d = 0; d < o.deps.length; d++) {
                            if (!rfoundmap.includes(o.deps[d].rt.name)) {
                                rfoundmap.push(o.deps[d].rt.name);
                            }
                        }
                        $scope.depsearch.deprtname = rfoundmap;
                        //console.log(JSON.stringify($scope.depsearch.deprtname));
                    }
                    $scope.ressums = [];
                    calcRes();
                    $scope.views = 'res';
                }
            };

            function filterlist(items, filterData) {

                if (filterData == undefined)
                    return items;

                var keys = Object.keys(filterData);
                var filtered = [];
                var populate = true;

                for (var i = 0; i < items.length; i++) {

                    var item = items[i];
                    populate = true;

                    for (var j = 0; j < keys.length; j++) {

                        if (filterData[keys[j]] != undefined) {
                            if (keys[j] === "connect") {

                                if (filterData[keys[j]].length == 0 || doesListContain(filterData[keys[j]], item["connect"])) {

                                    populate = true;

                                } else {

                                    populate = false;
                                    break;
                                }

                            } else {

                                if (filterData[keys[j]].length == 0 || doesListContain(filterData[keys[j]], item[keys[j]])) {

                                    populate = true;

                                } else {

                                    populate = false;
                                    break;
                                }
                            }

                        }
                    }

                    if (populate) {
                        filtered.push(item);
                    }
                }

                function doesListContain(list, obj) {

                    var i = list.length;

                    while (i--) {
                        if (Array.isArray(obj)) {
                            var j = obj.length;
                            while (j--) {
                                if (list[i] === obj[j]) {
                                    return true;
                                }
                            }
                        } else {
                            if (list[i] === obj) {
                                return true;
                            }
                        }
                    }

                    return false;
                }

                return filtered;
            };

            function calcRes() {
                var catmap = new Object();
                catmap["total"] = [0, 0, 0, 0, 0, 0, 0];
                for (let i = 0; i < $scope.company.categories.length; i++) {
                    var qs = [0, 0, 0, 0, 0, 0, 0];
                    catmap[$scope.company.categories[i].name] = qs;
                }

                var rtcountedmap = new Object();
                for (let i = 0; i < $scope.company.resourceTypes.length; i++) {
                    rtcountedmap[$scope.company.resourceTypes[i].name] = true;
                }


                var depfiltered = filterlist($scope.depList, $scope.depsearch);
                var thisYear = (new Date()).getFullYear();
                var nextyear = thisYear + 1;
                var q1start = (new Date(thisYear, 0, 1)).getTime();
                var q2start = (new Date(thisYear, 3, 1)).getTime();
                var q3start = (new Date(thisYear, 6, 1)).getTime();
                var q4start = (new Date(thisYear, 9, 1)).getTime();
                var q4end = (new Date(thisYear + 1, 0, 1)).getTime();
                var q1nextstart = (new Date(nextyear, 0, 1)).getTime();
                var q2nextstart = (new Date(nextyear, 3, 1)).getTime();
                var q3nextstart = (new Date(nextyear, 6, 1)).getTime();

                var depstart;
                var depend;
                $scope.totalreqq1 = 0;
                $scope.totalreqq2 = 0;
                $scope.totalreqq3 = 0;
                $scope.totalreqq4 = 0;
                $scope.totalreqq1next = 0;
                $scope.totalreqq2next = 0;
                $scope.totalcap = 0;
                for (let i = 0; $scope.company.resourceTypes != undefined && i < $scope.company.resourceTypes.length; i++) {
                    const element = $scope.company.resourceTypes[i];

                    var type = {};
                    type.name = element.name;
                    type.names = element.names;
                    type.buname = element.buname;
                    type.catagory = element.catagory;
                    type.cap = parseInt(element.capacity);
                    type.requestedq1 = 0;
                    type.requestedq2 = 0;
                    type.requestedq3 = 0;
                    type.requestedq4 = 0;
                    type.requestedq1next = 0;
                    type.requestedq2next = 0;
                    type.showtype = false;


                    type.backgroundq1 = "";
                    type.backgroundq2 = "";
                    type.backgroundq3 = "";
                    type.backgroundq4 = "";
                    type.backgroundq1next = "";
                    type.backgroundq2next = "";

                    for (let i = 0; depfiltered != undefined && i < depfiltered.length; i++) {
                        const element = depfiltered[i];
                        depstart = Date.parse(element.depdate);
                        depend = Date.parse(element.depdeaddate);
                        if (element.rt != undefined && type.name == element.rt.name) {
                            type.showtype = true;
                            var a = catmap[type.catagory];
                            var t = catmap["total"];
                            if ((depstart >= q1start && depstart < q2start) || (depend >= q1start && depend < q2start) || (depstart <= q1start && depend > q2start)) {
                                type.requestedq1 += parseInt(element.quantum);
                                $scope.totalreqq1 += parseInt(element.quantum);
                                a[0] += parseInt(element.quantum);
                                t[0] += parseInt(element.quantum);
                                if ($scope.rtfromprojectlist != undefined && $scope.rtfromprojectlist.includes(element.projecttitle)) {
                                    type.backgroundq1 = "greybackground";
                                }
                            }
                            if ((depstart >= q2start && depstart < q3start) || (depend >= q2start && depend < q3start) || (depstart <= q2start && depend > q3start)) {
                                type.requestedq2 += parseInt(element.quantum);
                                $scope.totalreqq2 += parseInt(element.quantum);
                                a[1] += parseInt(element.quantum);
                                t[1] += parseInt(element.quantum);
                                if ($scope.rtfromprojectlist != undefined && $scope.rtfromprojectlist.includes(element.projecttitle)) {
                                    type.backgroundq2 = "greybackground";
                                }
                            }
                            if ((depstart >= q3start && depstart < q4start) || (depend >= q3start && depend < q4start) || (depstart <= q3start && depend > q4start)) {
                                type.requestedq3 += parseInt(element.quantum);
                                $scope.totalreqq3 += parseInt(element.quantum);
                                a[2] += parseInt(element.quantum);
                                t[2] += parseInt(element.quantum);
                                if ($scope.rtfromprojectlist != undefined && $scope.rtfromprojectlist.includes(element.projecttitle)) {
                                    type.backgroundq3 = "greybackground";
                                }
                            }
                            if ((depstart >= q4start && depstart < q4end) || (depend >= q4start && depend < q4end) || (depstart <= q4start && depend > q4end)) {
                                type.requestedq4 += parseInt(element.quantum);
                                $scope.totalreqq4 += parseInt(element.quantum);
                                a[3] += parseInt(element.quantum);
                                t[3] += parseInt(element.quantum);
                                if ($scope.rtfromprojectlist != undefined && $scope.rtfromprojectlist.includes(element.projecttitle)) {
                                    type.backgroundq4 = "greybackground";
                                }
                            }
                            if ((depstart >= q1nextstart && depstart < q2nextstart) || (depend >= q1nextstart && depend < q2nextstart) || (depstart <= q1nextstart && depend > q2nextstart)) {
                                type.requestedq1next += parseInt(element.quantum);
                                $scope.totalreqq1next += parseInt(element.quantum);
                                a[4] += parseInt(element.quantum);
                                t[4] += parseInt(element.quantum);
                                if ($scope.rtfromprojectlist != undefined && $scope.rtfromprojectlist.includes(element.projecttitle)) {
                                    type.backgroundq1next = "greybackground";
                                }
                            }
                            if ((depstart >= q2nextstart && depstart < q3nextstart) || (depend >= q2nextstart && depend < q3nextstart) || (depstart <= q2nextstart && depend > q3nextstart)) {
                                type.requestedq2next += parseInt(element.quantum);
                                $scope.totalreqq2next += parseInt(element.quantum);
                                a[5] += parseInt(element.quantum);
                                t[5] += parseInt(element.quantum);
                                if ($scope.rtfromprojectlist != undefined && $scope.rtfromprojectlist.includes(element.projecttitle)) {
                                    type.backgroundq2next = "greybackground";
                                }
                            }

                            if (rtcountedmap[type.name]) {
                                a[6] += type.cap;
                                rtcountedmap[type.name] = false;
                            }

                            catmap[type.catagory] = a;
                        }

                    }
                    type.status = 'Green';
                    type.q1status = 'Green';
                    type.q2status = 'Green';
                    type.q3status = 'Green';
                    type.q4status = 'Green';
                    type.q1nextstatus = 'Green';
                    type.q2nextstatus = 'Green';
                    type.q1diff = type.cap - type.requestedq1;
                    type.q2diff = type.cap - type.requestedq2;
                    type.q3diff = type.cap - type.requestedq3;
                    type.q4diff = type.cap - type.requestedq4;
                    type.q1nextdiff = type.cap - type.requestedq1next;
                    type.q2nextdiff = type.cap - type.requestedq2next;
                    if (type.q1diff < 0) { type.q1status = 'Red'; type.status = 'Red'; }
                    if (type.q2diff < 0) { type.q2status = 'Red'; type.status = 'Red'; }
                    if (type.q3diff < 0) { type.q3status = 'Red'; type.status = 'Red'; }
                    if (type.q4diff < 0) { type.q4status = 'Red'; type.status = 'Red'; }
                    if (type.q1nextdiff < 0) { type.q1nextstatus = 'Red'; type.status = 'Red'; }
                    if (type.q2nextdiff < 0) { type.q2nextstatus = 'Red'; type.status = 'Red'; }
                    if (type.showtype) { $scope.totalcap += parseInt(type.cap); }

                    $scope.ressums.push(type);
                }
                var csa = [];
                var tot = {};
                tot.name = "total";
                tot.q1 = catmap["total"][0];
                tot.q2 = catmap["total"][1];
                tot.q3 = catmap["total"][2];
                tot.q4 = catmap["total"][3];
                tot.q1next = catmap["total"][4];
                tot.q2next = catmap["total"][5];
                tot.t = catmap["total"][6];
                csa.push(tot);
                for (let i = 0; i < $scope.company.categories.length; i++) {
                    var cs = {};
                    cs.name = $scope.company.categories[i].name;
                    cs.q1 = catmap[cs.name][0];
                    cs.q2 = catmap[cs.name][1];
                    cs.q3 = catmap[cs.name][2];
                    cs.q4 = catmap[cs.name][3];
                    cs.q1next = catmap[cs.name][4];
                    cs.q2next = catmap[cs.name][5];
                    cs.t = catmap[cs.name][6];

                    cs.status = 'Green';
                    cs.q1status = 'Green';
                    cs.q2status = 'Green';
                    cs.q3status = 'Green';
                    cs.q4status = 'Green';
                    cs.q1nextstatus = 'Green';
                    cs.q2nextstatus = 'Green';
                    cs.q1diff = cs.t - cs.q1;
                    cs.q2diff = cs.t - cs.q2;
                    cs.q3diff = cs.t - cs.q3;
                    cs.q4diff = cs.t - cs.q4;
                    cs.q1nextdiff = cs.t - cs.q1next;
                    cs.q2nextdiff = cs.t - cs.q2next;

                    var q1s = 0, q2s = 0, q3s = 0, q4s = 0, q1ns = 0, q2ns = 0;

                    for (let k = 0; k < $scope.ressums.length; k++) {
                        const e = $scope.ressums[k];
                        if (e.catagory == cs.name) {
                            if (e.q1status == 'Red') q1s++;
                            if (e.q2status == 'Red') q2s++;
                            if (e.q3status == 'Red') q3s++;
                            if (e.q4status == 'Red') q4s++;
                            if (e.q1nextstatus == 'Red') q1ns++;
                            if (e.q2nextstatus == 'Red') q2ns++;
                        }
                    }

                    if (q1s > 0 && q1s < 3) { cs.q1status = 'Yellow'; cs.status = 'Yellow'; }
                    if (q2s > 0 && q2s < 3) { cs.q2status = 'Yellow'; cs.status = 'Yellow'; }
                    if (q3s > 0 && q3s < 3) { cs.q3status = 'Yellow'; cs.status = 'Yellow'; }
                    if (q4s > 0 && q4s < 3) { cs.q4status = 'Yellow'; cs.status = 'Yellow'; }
                    if (q1ns > 0 && q1ns < 3) { cs.q1nextstatus = 'Yellow'; cs.status = 'Yellow'; }
                    if (q2ns > 0 && q2ns < 3) { cs.q2nextstatus = 'Yellow'; cs.status = 'Yellow'; }

                    if (q1s > 2) { cs.q1status = 'Orange'; cs.status = 'Orange'; }
                    if (q2s > 2) { cs.q2status = 'Orange'; cs.status = 'Orange'; }
                    if (q3s > 2) { cs.q3status = 'Orange'; cs.status = 'Orange'; }
                    if (q4s > 2) { cs.q4status = 'Orange'; cs.status = 'Orange'; }
                    if (q1ns > 2) { cs.q1nextstatus = 'Orange'; cs.status = 'Orange'; }
                    if (q2ns > 2) { cs.q2nextstatus = 'Orange'; cs.status = 'Orange'; }

                    if (cs.q1diff < 0) { cs.q1status = 'Red'; cs.status = 'Red'; }
                    if (cs.q2diff < 0) { cs.q2status = 'Red'; cs.status = 'Red'; }
                    if (cs.q3diff < 0) { cs.q3status = 'Red'; cs.status = 'Red'; }
                    if (cs.q4diff < 0) { cs.q4status = 'Red'; cs.status = 'Red'; }
                    if (cs.q1nextdiff < 0) { cs.q1nextstatus = 'Red'; cs.status = 'Red'; }
                    if (cs.q2nextdiff < 0) { cs.q2nextstatus = 'Red'; cs.status = 'Red'; }

                    csa.push(cs);
                }

                $scope.catsums = csa;
            };


            $scope.depbarRender = function (dep) {
                return depbarRender(dep);
            }

            //depBarRender START
            function depbarRender(dep) {

                var s = new Date(Date.parse(dep.depdate));
                var e = new Date(Date.parse(dep.depdeaddate));
                var start = 0;
                var end = 100;

                var thisyear = new Date();
                var base = new Date();
                var startbase = new Date();
                base.setFullYear(thisyear.getFullYear(), 0, 1);
                startbase.setFullYear(thisyear.getFullYear() - 1, 0, 1);

                var today = Math.round((((thisyear.getTime() - base.getTime()) / 86400000) * 33 / 365) + 33);
                var oneday = today + 1;

                //console.log("thisyear-1 = " + (thisyear.getFullYear()-1));

                if ((thisyear.getFullYear() - 1) == s.getFullYear() || thisyear.getFullYear() == s.getFullYear() || (thisyear.getFullYear() + 1) == s.getFullYear()) start = Math.round(((s.getTime() - startbase.getTime()) / 86400000) * 100 / (3 * 365));
                if ((thisyear.getFullYear() - 1) == e.getFullYear() || thisyear.getFullYear() == e.getFullYear() || (thisyear.getFullYear() + 1) == e.getFullYear()) end = Math.round(((e.getTime() - startbase.getTime()) / 86400000) * 100 / (3 * 365));
                if (start == end && end != 100) end = end + 1;
                if (start == 100) start--;
                //console.log("Start = " + start);
                //console.log("End = " + end);

                var colorbackground = "#f7f8f9";
                var color = "rgb(38,38,38)";
                var colorlevel = "rgb(0,176,240)";

                if (dep.state != undefined && dep.state != "") {
                    if (dep.state == "On hold") colorlevel = "rgba(243,54,49)";
                    if (dep.state == "Requested") colorlevel = "rgb(254,236,2)";
                    if (dep.state == "Allocated") colorlevel = "rgb(95,185,59)";
                }

                var ret = "#f6f1d3";
                if (start < end) {
                    if (today <= start) {
                        ret = "linear-gradient(to right, " + colorbackground + " " + today + "%, " + color + " " + today + "%, " + color + " " + oneday + "%, " + colorbackground + " " + oneday + "%, " + colorbackground + " " + start + "%, " + colorlevel + " " + start + "%, " + colorlevel + " " + end + "%, " + colorbackground + " " + end + "%)";
                    }
                    if (today > start && today <= end) {
                        ret = "linear-gradient(to right, " + colorbackground + " " + start + "%, " + colorlevel + " " + start + "%, " + colorlevel + " " + today + "%, " + color + " " + today + "%, " + color + " " + oneday + "%, " + colorlevel + " " + oneday + "%," + colorlevel + " " + end + "%, " + colorbackground + " " + end + "%)";
                    }
                    if (today > end) {
                        if (dep.state == "Open") color = "red";
                        ret = "linear-gradient(to right, " + colorbackground + " " + start + "%, " + colorlevel + " " + start + "%, " + colorlevel + " " + end + "%, " + colorbackground + " " + end + "%, " + colorbackground + " " + today + "%, " + color + " " + today + "%, " + color + " " + oneday + "%, " + colorbackground + " " + oneday + "%)";
                    }
                    if ((thisyear.getFullYear() - 1) > s.getFullYear() && (thisyear.getFullYear() - 1) > e.getFullYear()) {
                        var dist = Math.round(today / 4);
                        if (dep.state == "Open") color = "red";
                        ret = "linear-gradient(to right, " + colorlevel + " 0%, " + colorbackground + " " + dist + "%, " + colorbackground + " " + today + "%, " + color + " " + today + "%, " + color + " " + oneday + "%, " + colorbackground + " " + oneday + "%)";
                    }
                    if ((thisyear.getFullYear() + 1) < s.getFullYear() && (thisyear.getFullYear() + 1) < e.getFullYear()) {
                        var dist = 100 - Math.round((100 - today) / 4);
                        ret = "linear-gradient(to right, " + colorbackground + " " + today + "%, " + color + " " + today + "%, " + color + " " + oneday + "%, " + colorbackground + " " + oneday + "%, " + colorbackground + " " + dist + "%, " + colorlevel + " 100%)";
                    }
                }

                return { background: ret }
            }
            //depBarRender END


            function setDepList(projects, tempprojecttitle) {

                var deps = [];
                deps = deps.concat.apply([], projects.map(function (project) {

                    if (!project.deps) {
                        return [];
                    }

                    return project.deps.map(function (dep) {
                        project.portname = '';
                        if (project.support != undefined) dep['pportname'] = project.support.name;

                        dep['projectid'] = project._id.$oid;
                        dep['projectoid'] = project._id.$oid;
                        dep['projecttitle'] = project.title;
                        dep['pbuname'] = project.bu.name;
                        dep['deprtname'] = (dep != undefined && dep.rt != undefined) ? dep.rt.name : "UNKNOWN";
                        dep['deprtbuname'] = (dep != undefined && dep.rt != undefined) ? dep.rt.buname : "UNKNOWN";
                        dep['deprtowner'] = (dep != undefined && dep.rt != undefined) ? dep.rt.resown : "UNKNOWN";
                        dep['deprtcatagory'] = (dep != undefined && dep.rt != undefined) ? dep.rt.catagory : "UNKNOWN";
                        dep['support'] = project.support;
                        dep['pstate'] = project.state;
                        if (project.title == tempprojecttitle) {
                            dep['pstate'] = "Progress";
                        }
                        dep['ppm'] = project.pm.name;
                        dep['pconnect'] = project.connect;
                        dep['ppriority'] = project.priority;
                        dep['penabler'] = project.milestones[0].enablerlable;
                        dep['penablervalue'] = project.milestones[0].enablervalue;

                        return dep;
                    });
                }));

                return deps;
            }


        }
    ]);
