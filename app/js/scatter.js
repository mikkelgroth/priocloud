var Scatter = function (id, data, labels, xvalue, yvalue, size, $scope){
    $(id).empty();

// Scattergraph
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 768 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

//Project,EtC,ab,proj1kpi,proj2kpi,proj3kpi,Compliance,PM,Status

/* 
 * value accessor - returns the value to encode for a given data object.
 * scale - maps value to a visual display encoding, such as a pixel position.
 * map function - maps from data value to display value
 * axis - sets up axis
 */ 

// setup x 
var xValue = function(d) { return d[xvalue];}, // data -> value
    xScale = d3.scale.linear().range([0, width]), // value -> display
    xMap = function(d) { return xScale(xValue(d));}, // data -> display
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

// setup y
var yValue = function(d) { return d[yvalue];}, // data -> value
    yScale = d3.scale.linear().range([height, 0]), // value -> display
    yMap = function(d) { return yScale(yValue(d));}, // data -> display
    yAxis = d3.svg.axis().scale(yScale).orient("left");

// setup fill color
var cValue = function(d) { return d.Status;};

    // setup stroke color
var sValue = function(d) { return d.Laststatus;};


var max=1;
for(var i=0;i<data.length;i++){
	if(data[i][size]>max){
		max=data[i][size];
	}
}

// setup dotsize
var dotValue = function(d) { 
	return 25*d[size]/max+5;
};


// add the graph canvas to the body of the webpage
var svg = d3.select(id).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// add the tooltip area to the webpage
var tooltip = d3.select(id).append("div")
    .attr("class", "tooltip")
    .style("display", "none");

// load data

var ldata = "Project,EtC,proj1kpi,proj2kpi,proj3kpi,Compliance,PM,Status\n"
+ "P1,10,7,4,1,6,MGA,Green\n"
+ "P2,20,4,5,8,1,MGA,Green\n"
+ "P3,12,1,6,7,8,MGA,Yellow\n"
+ "P4,5,2,1,6,2,MGA,Green\n"
+ "P5,7,3,2,2,7,MGA,Yellow\n"
+ "P6,30,5,8,3,3,MGA,Green\n"
+ "P7,15,6,7,4,4,MGA,Green\n"
+ "P8,35,8,3,5,5,MGA,Red\n"


  // change string (from CSV) into number format
  data.forEach(function(d) {
    d[xvalue] = +d[xvalue];
    d[yvalue] = +d[yvalue];
      
//    console.log(d);
  });

  // don't want dots overlapping axis, so add in buffer to data domain
  xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
  yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

  // x-axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text(labels[xvalue]);

  // y-axis
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(labels[yvalue]);

  // draw dots
  var h= svg.selectAll(".dot")
      .data(data);
  var elemEnter = h.enter();
  var circle = elemEnter.append("circle")
      .attr("class", "dot")
      //.attr("r", 20)
      .attr("r", function(d) { return dotValue(d);}) 
      .attr("cx", xMap)
      .attr("cy", yMap)
        .style("stroke", function(d) { return sValue(d);})
        .style("stroke-width", 3)
      .style("fill", function(d) { return cValue(d);}) 
        .style("opacity", .6)
      .on("click", function(d) {
    	  $scope.directProject(d["poid"]);
      })
      .on("mouseenter", function(d) {
          var circleElement = $(this);
          var diameter = Number(circleElement.attr("r")) * 2;
          
          var leftPos = circleElement.offset().left - $(id).offset().left + diameter;
          var topPos = (circleElement.offset().top - $(id).offset().top) + diameter;
          
          $('.tooltip').stop().fadeIn();
          $('.tooltip').html(d["Project"]);
          $('.tooltip').css({
            "left": leftPos,
            "top": topPos
          });
      })
      .on("mouseleave", function(d) {
          $('.tooltip').stop().fadeOut();
      })
      ;
  elemEnter.append("text")
      .attr("dx", xMap)
      .attr("dy", yMap)
  .text(function(d){return d["title"]})
}