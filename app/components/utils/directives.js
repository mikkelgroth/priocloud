angular
    .module('riskApp')

    .directive('prioClass', [function () {

        function linkFunction(scope, element, attrs) {

            var classList = {
                base: attrs['class']
            };

            scope.$watch(attrs['saveThis'], function (newVal) {
                if(document.getElementById("saveButton")!=null){
                    if (newVal) document.getElementById("saveButton").className = "Red";
                    else document.getElementById("saveButton").className = "Green";
                }
                if(document.getElementById("saveButtonQ")!=null){
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
                else if (newVal == '10') classList['prioKpiSizeRender'] = "rad1";
                else if (newVal == '20') classList['prioKpiSizeRender'] = "rad2";
                else if (newVal == '40') classList['prioKpiSizeRender'] = "rad3";
                else if (newVal == '50') classList['prioKpiSizeRender'] = "rad4";
                else if (newVal == '70') classList['prioKpiSizeRender'] = "rad5";
                else if (newVal == '80') classList['prioKpiSizeRender'] = "rad6";
                else if (newVal == '99') classList['prioKpiSizeRender'] = "rad7";
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




    .directive('prioMiniPie', [function () {

        function linkFunction(scope, element, attrs) {
            
            scope.$watch(attrs['prioVal'], function (newVal) {

                if (newVal) {
                    
                    var uniqueId = '_' + Math.random().toString(36).substr(2, 9);

                    element.attr('id', uniqueId);
                    element.empty();

                    var le = 100 - newVal;
                    var dataset = {
                        priokpiset: [newVal, le],
                    };

                    var width = 50,
                        height = 50,
                        radius = Math.min(width, height) / 2;

                    var color = ['#00f','#ddf'];

                    var pie = d3.layout.pie()
                        .sort(null);

                    var arc = d3.svg.arc()
                        .innerRadius(radius - 10)
                        .outerRadius(radius - 20);

                    var svg = d3.select('#' + uniqueId).append("svg")
                        .attr("width", width)
                        .attr("height", height)
                        .append("g")
                        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

                    var path = svg.selectAll("path")
                        .data(pie(dataset.priokpiset))
                        .enter()
                        .append("path")
                        .attr("fill", function(d, i) { return color[i]; })
                        .attr("d", arc);
                }

            }, true);
        }

        return {
            restrict: 'E',
            link: linkFunction
        };
    }])
.directive('datepicker', function() {
  return {
    require: 'ngModel',
    link: function(scope, el, attr, ngModel) {
      $(el).datepicker({
        onSelect: function(dateText) {
            scope.$apply(function() {
                ngModel.$setViewValue(dateText);
                // console.log("dateText = " + dateText);
              
            });
        }
      });
    }
  };
});
