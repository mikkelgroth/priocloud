angular
    .module('riskApp')

    .directive('prioClass', [function () {

        function linkFunction(scope, element, attrs) {

            var classList = {
                base: attrs['class']
            };

            scope.$watch(attrs['saveThis'], function (newVal) {
                if (document.getElementById("saveButton") != null) {
                    if (newVal) document.getElementById("saveButton").className = "Red";
                    else document.getElementById("saveButton").className = "Green";
                }
                if (document.getElementById("saveButton1") != null) {
                    if (newVal) document.getElementById("saveButton1").className = "Red";
                    else document.getElementById("saveButton1").className = "Green";
                }
                if (document.getElementById("saveButton2") != null) {
                    if (newVal) document.getElementById("saveButton2").className = "Red";
                    else document.getElementById("saveButton2").className = "Green";
                }
                if (document.getElementById("saveButton3") != null) {
                    if (newVal) document.getElementById("saveButton3").className = "Red";
                    else document.getElementById("saveButton3").className = "Green";
                }
                if (document.getElementById("saveButton4") != null) {
                    if (newVal) document.getElementById("saveButton4").className = "Red";
                    else document.getElementById("saveButton4").className = "Green";
                }
                if (document.getElementById("saveButton5") != null) {
                    if (newVal) document.getElementById("saveButton5").className = "Red";
                    else document.getElementById("saveButton5").className = "Green";
                }
                if (document.getElementById("saveButtonQ") != null) {
                    if (newVal) document.getElementById("saveButtonQ").className = "Red";
                    else document.getElementById("saveButtonQ").className = "Green";
                }
            }, true);


            scope.$watch(attrs['prioSizeRender'], function (newVal) {

                if (newVal == 'No dependency') classList['prioSizeRender'] = "rad1";
                else if (newVal == 'Minor dependency') classList['prioSizeRender'] = "rad2";
                else if (newVal == 'Major dependency') classList['prioSizeRender'] = "rad4";
                else if (newVal) classList['prioSizeRender'] = "rad7";

                repaintClasses();

            }, true);

            scope.$watch(attrs['prioSkillRender'], function (newVal) {

                if (newVal == 'Ok') classList['prioSkillRender'] = "Green";
                else if (newVal == 'Minor issue') classList['prioSkillRender'] = "Yellow";
                else if (newVal == 'Major issue') classList['prioSkillRender'] = "Orange";
                else if (newVal) classList['prioSkillRender'] = "Red";

                repaintClasses();

            }, true);

            scope.$watch(attrs['prioResRender'], function (newVal) {

                if (newVal == 'Committed') classList['prioResRender'] = "ResGreen";
                else if (newVal == 'Backlog') classList['prioResRender'] = "ResYellow";
                else if (newVal == 'Tentative') classList['prioResRender'] = "ResOrange";
                else if (newVal) classList['prioResRender'] = "ResRed";

                repaintClasses();

            }, true);



            scope.$watch(attrs['prioKpiSizeRender'], function (newVal) {

                if (newVal == '0') classList['prioKpiSizeRender'] = "rad0";
                else if (newVal == '25') classList['prioKpiSizeRender'] = "rad1";
                else if (newVal == '50') classList['prioKpiSizeRender'] = "rad2";
                else if (newVal == '75') classList['prioKpiSizeRender'] = "rad3";
                else if (newVal == '100') classList['prioKpiSizeRender'] = "rad4";
                else if (newVal) classList['prioKpiSizeRender'] = "rad0";

                repaintClasses();

            }, true);

            scope.$watch(attrs['prioValueBarRender'], function (newVal) {

                if (newVal == 1) classList['prioValueBarRender'] = "Red";
                else if (newVal == 2) classList['prioValueBarRender'] = "Orange";
                else if (newVal == 3) classList['prioValueBarRender'] = "Yellow";
                else if (newVal) classList['prioValueBarRender'] = "Green";

                repaintClasses();

            }, true);

            scope.$watch(attrs['prioValueBarRenderNeg'], function (newVal) {

                if (newVal == 1) classList['prioValueBarRenderNeg'] = "Green";
                else if (newVal == 2) classList['prioValueBarRenderNeg'] = "Yellow";
                else if (newVal == 3) classList['prioValueBarRenderNeg'] = "Orange";
                else if (newVal) classList['prioValueBarRenderNeg'] = "Red";

                repaintClasses();

            }, true);

            scope.$watch(attrs['prioRiskBarRender'], function (newVal) {

                if (newVal == 1) classList['prioRiskBarRender'] = "Green";
                else if (newVal == 2) classList['prioRiskBarRender'] = "Yellow";
                else if (newVal == 3) classList['prioRiskBarRender'] = "Orange";
                else if (newVal) classList['prioRiskBarRender'] = "Red";

                repaintClasses();

            }, true);

            scope.$watch(attrs['prioCsRender'], function (newVal) {

                if (newVal == 8 || newVal == 7 || newVal == 6) classList['prioCsRender'] = "Green";
                else if (newVal == 5 || newVal == 4) classList['prioCsRender'] = "Yellow";
                else if (newVal == 3 || newVal == 2) classList['prioCsRender'] = "Orange";
                else if (newVal) classList['prioCsRender'] = "Red";

                repaintClasses();

            }, true);


            function repaintClasses() {

                element.attr('class', '');
                for (var key in classList) {
                    element.addClass(classList[key]);
                }
            }
        }

        return {
            restrict: 'A',
            link: linkFunction
        };
    }])



    .directive('datepicker', function () {
        return {
            require: 'ngModel',
            link: function (scope, el, attr, ngModel) {
                $(el).datepicker({
                    onSelect: function (dateText) {
                        scope.$apply(function () {
                            ngModel.$setViewValue(dateText);
                            // console.log("dateText = " + dateText);

                        });
                    }
                });
            }
        };
    });

$(function () {

    function autosize() {
        var el = this;
        setTimeout(function () {
            el.style.cssText = 'height:auto; padding:0';
            // for box-sizing other than "content-box" use:
            // el.style.cssText = '-moz-box-sizing:content-box';
            el.style.cssText = 'height:' + (parseInt(el.scrollHeight) + 20) + 'px';
        }, 0);
    }



    $('body').on('keydown', 'textarea', autosize);
    $('body').on('click', function () {

        $('textarea').each(function () {
            var thetextarea = this;
            thetextarea.style.cssText = 'height:auto; padding:0; ';
            // for box-sizing other than "content-box" use:
            // thetextarea.style.cssText = '-moz-box-sizing:content-box';
            thetextarea.style.cssText = 'height:' + (parseInt(thetextarea.scrollHeight) + 20) + 'px';
        });
    });


});


