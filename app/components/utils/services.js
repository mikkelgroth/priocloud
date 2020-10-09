angular
    .module('riskApp')
    .service('util', function () {
        var _this = this;
        _this.uuid = function () {
            let u = Date.now().toString(16) + Math.random().toString(16) + '0'.repeat(16);
            return [u.substr(0, 8), u.substr(8, 4), '4000-8' + u.substr(13, 3), u.substr(16, 12)].join('-');
        }

        _this.setmileflags = function (mile) {
            mile.wsjf = Math.floor((mile.bena * mile.sena * mile.cena * mile.mena) /
                (mile.effort * mile.risklevel) * 100 / (4 * 4 * 4 * 4));
            mile.enablerlable = "XS";
            mile.enablervalue = 0;
            mile.enablervaluetotal = mile.bena * mile.sena * mile.cena * mile.mena;
            if (mile.enablervaluetotal > 3) { mile.enablervalue = 1; mile.enablerlable = "S"; }
            if (mile.enablervaluetotal > 9) { mile.enablervalue = 2; mile.enablerlable = "M"; }
            if (mile.enablervaluetotal > 50) { mile.enablervalue = 3; mile.enablerlable = "L"; }
            if (mile.enablervaluetotal > 100) { mile.enablervalue = 4; mile.enablerlable = "XL"; }

            mile.limiterlable = "XS";
            mile.limitervalue = 0;
            mile.limitervaluetotal = mile.effort * mile.risklevel;
            if (mile.limitervaluetotal > 1) { mile.limitervalue = 1; mile.limiterlable = "S"; }
            if (mile.limitervaluetotal > 2) { mile.limitervalue = 2; mile.limiterlable = "M"; }
            if (mile.limitervaluetotal > 4) { mile.limitervalue = 3; mile.limiterlable = "L"; }
            if (mile.limitervaluetotal > 9) { mile.limitervalue = 4; mile.limiterlable = "XL"; }
        }
        _this.calcestimate = function (mile, project, company) {
            mile.effort = '4';
            if (Number(mile.estimate) > 0) mile.effort = '1';
            if (Number(mile.estimate) >= Number(company.estimatelevelyellow)) mile.effort = '2';
            if (Number(mile.estimate) >= Number(company.estimatelevelorange)) mile.effort = '3';

            project.milestonestotalproject = 0;
            project.milestonestotalroadmap = 0;
            project.milestonestotalactivity = 0;

            for (let i = 0; i < project.milestones.length; i++) {
                const e = project.milestones[i];
                if (e.type == "Roadmap item") {
                    project.milestonestotalroadmap += Number(e.estimate);
                } else if (e.type == "Activity") {
                    project.milestonestotalactivity += Number(e.estimate);
                } else {
                    project.milestonestotalproject += Number(e.estimate);
                }
            }
        }

        _this.getObjectByID = function (objID, list) {
            if (objID != undefined) {
                let p = list.find(x => x._id === objID);
                if (p != undefined) {
                    return p;
                }
            }
        }
        _this.getObjectByOID = function (objID, list) {
            if (objID != undefined) {
                let p = list.find(x => x._id.$oid === objID);
                if (p != undefined) {
                    return p;
                }
            }
        }
        //depBarRender START
        _this.depbarRender = function (dep) {

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
        //BarRender START
        _this.barRender = function (mi) {

            var s = new Date(Date.parse(mi.date));
            var e = new Date(Date.parse(mi.enddate));
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
            var colorlevel = "rgba(243,54,49)";

            if (mi.risklevel != null && mi.risklevel != "" && mi.effort != null && mi.effort != "") {
                var val = mi.risklevel * mi.effort;
                if (val <= 12) colorlevel = "rgba(245,160,47)";
                if (val <= 6) colorlevel = "rgb(254,236,2)";
                if (val <= 3) colorlevel = "rgb(95,185,59)";
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
                    if ((mi.state == "Progress" || mi.state == "Target" || mi.state == "Qualified")) color = "red";
                    ret = "linear-gradient(to right, " + colorbackground + " " + start + "%, " + colorlevel + " " + start + "%, " + colorlevel + " " + end + "%, " + colorbackground + " " + end + "%, " + colorbackground + " " + today + "%, " + color + " " + today + "%, " + color + " " + oneday + "%, " + colorbackground + " " + oneday + "%)";
                }
                if ((thisyear.getFullYear() - 1) > s.getFullYear() && (thisyear.getFullYear() - 1) > e.getFullYear()) {
                    var dist = Math.round(today / 4);
                    if ((mi.state == "Progress" || mi.state == "Target" || mi.state == "Qualified")) color = "red";
                    ret = "linear-gradient(to right, " + colorlevel + " 0%, " + colorbackground + " " + dist + "%, " + colorbackground + " " + today + "%, " + color + " " + today + "%, " + color + " " + oneday + "%, " + colorbackground + " " + oneday + "%)";
                }
                if ((thisyear.getFullYear() + 1) < s.getFullYear() && (thisyear.getFullYear() + 1) < e.getFullYear()) {
                    var dist = 100 - Math.round((100 - today) / 4);
                    ret = "linear-gradient(to right, " + colorbackground + " " + today + "%, " + color + " " + today + "%, " + color + " " + oneday + "%, " + colorbackground + " " + oneday + "%, " + colorbackground + " " + dist + "%, " + colorlevel + " 100%)";
                }
            }

            return { background: ret }
        }
        //BarRender END

    })
    .service('restService', ['$http', 'userService', function ($http, userService) {

        var _this = this;
        var _SERVER = DBSERVER

        userService.user.subscribe(function (user) {

            _this.auid = user.auid;
            _this.uuid = user.uuid;
        });

        _this.getData = function (collection, oid) {
            if (_this.uuid != undefined && _this.auid != undefined) {
                if (oid) {

                    return $http.get(_SERVER + '/' + _this.auid + '/' + _this.uuid + '/' + collection + '/' + oid + '?rnd=' + (Math.random()));

                } else {

                    return $http.get(_SERVER + '/' + _this.auid + '/' + _this.uuid + '/' + collection + '?rnd=' + (Math.random()));
                }
            } else {
                console.log("No UUID and or AUID in getData() in util.service.js");
                return;
            }
        };

        _this.updateData = function (collection, data) {
            if (_this.uuid != undefined && _this.auid != undefined) {

                return $http.put(_SERVER + '/' + _this.auid + '/' + _this.uuid + '/' + collection + '/' + data._id.$oid, data);
            } else {
                console.log("No UUID and or AUID in updateData() in util.service.js");
                return;
            }
        };

        _this.saveData = function (collection, data) {
            if (_this.uuid != undefined && _this.auid != undefined) {

                return $http.post(_SERVER + '/' + _this.auid + '/' + _this.uuid + '/' + collection + '', data);
            } else {
                console.log("No UUID and or AUID in saveData() in util.service.js");
                return;
            }
        };

        _this.deleteData = function (collection, data) {
            if (_this.uuid != undefined && _this.auid != undefined) {

                return $http.delete(_SERVER + '/' + _this.auid + '/' + _this.uuid + '/' + collection + '/' + data._id.$oid);
            } else {
                console.log("No UUID and or AUID in deleteData() in util.service.js");
                return;
            }
        };
    }]);