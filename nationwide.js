d3.csv("tab02_antigen_iap_reduced.csv", function(d) {
var overallData = cleanData(d);
d3.csv("tab10_wic_iap_reduced.csv", function(d) {
var wicData = cleanData(d);
d3.csv("tab11_nowic_iap_reduced.csv", function(d) {
var noWicData = cleanData(d);
//console.log(overallData);
var overallDict = makeDict(overallData);



/** Summarized statistics for each year. 
Each item in the array corresponds to a year. **/

/**array of numbers**/
var nationalVaxRatesByYear = function(vaccine) {
	return years.map(function(year) {
		return findVaxRate('US National', year, vaccine, overallDict);
	})
}
/**array of style [region, rate] **/
var minVaxRatesByYear = function(vaccine) {
	return years.map(function(year) {
		return findMinVaxRate(year, vaccine, overallData, overallDict);
	})
}
var maxVaxRatesByYear = function(vaccine) {
	return years.map(function(year) {
		return findMaxVaxRate(year, vaccine, overallData, overallDict);
	})
}
/**Returns a number, 
corresponding to the minimum vaccination rate in any year, for any region, for this vaccine.**/
var minVaxEver = function(vaccine) {
	return d3.min(minVaxRatesByYear(vaccine), function(d) {
		return d[1];
	})
}
/**Returns a number**/
var maxVaxEver = function(vaccine) {
	return d3.min(maxVaxRatesByYear(vaccine), function(d) {
		return d[1];
	})
}




var SVG_WIDTH = 1000,
	PADDING = 50,
	LEFT_PADDING = 100, //between svg edge and y-axis line
	LABEL_PADDING = 25; //between axis labels and axis line

var GRAPH_HEIGHT = 200,
	graph_width = SVG_WIDTH - PADDING*2,
    MAP_HEIGHT = 300,
	svg_height = GRAPH_HEIGHT + PADDING*2 + MAP_HEIGHT;

var originX = LEFT_PADDING,
	originY = PADDING + GRAPH_HEIGHT,
	endX = PADDING + graph_width,
	endY = PADDING;

var mapYStart = GRAPH_HEIGHT + PADDING*2;


var selectedYear = '2013';
var selectedVaccine = '1+MMR';


var nationalSvg = d3.select("#national")
	.append("svg")
	.attr("width", SVG_WIDTH)
	.attr("height", svg_height);

var graph = nationalSvg.append("g");
var xAxis = graph.append("line")
	.attr('x1', originX).attr('y1', originY)
	.attr('x2', endX).attr('y2', originY)
	.attr('class', 'axis')
var yAxis = graph.append("line")
	.attr('x1', originX).attr('y1', originY)
	.attr('x2', originX).attr('y2', endY)
	.attr('class', 'axis');


var years = ['2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013'];

var xScale = d3.scale.ordinal()
	.domain(years).rangeBands([originX, endX], 0.3)

var xAxisLabels = graph.selectAll("text.xlabel")
	.data(years).enter()
	.append("text")
	.attr("x", function(year) { return xScale(year); })
	.attr("y", originY + LABEL_PADDING)
	.classed("xlabel", true)
	.classed("active", function(year) { return year == 2013; })
	.text(function(year) { return year; });


var map = nationalSvg.append("g");
// albersUsa projection
var projection = d3.geo.albersUsa();
var path = d3.geo.path().projection(projection);



var drawNational = function(year, vaccine) {
	var minVaxRate = minVaxRatesByYear(vaccine)[years.indexOf(year)];
	var maxVaxRate = maxVaxRatesByYear(vaccine)[years.indexOf(year)];

	//Scales
	var yScale = d3.scale.linear()
		.domain([minVaxEver(vaccine), maxVaxEver(vaccine)])
		.range([originY, endY])
		.nice();
	var colorScale = d3.scale.linear()
		.domain([minVaxEver(vaccine), maxVaxEver(vaccine)])
		.range(['red', '#91bfdb']);


	var yAxisLabels = graph.selectAll("text.ylabel")
		.data(yScale.ticks(5)).enter()
		.append("text")
		.attr("x", originX - LABEL_PADDING)
		.attr("y", function(rate) { return yScale(rate); })
		.classed("ylabel", true)
		.text(function(rate) { return rate + "%"; });

	var yAxisNameXPos = originX - LABEL_PADDING*2,
		yAxisNameYPos = originY - endY;
	var yAxisName = graph.append("text")
		.attr("transform", "translate(" + yAxisNameXPos + ", " + yAxisNameYPos + ") rotate(-90)")
		.attr("class", 'y-axis-name')
		.text('vaccination rate');


	var nationalPts = graph.selectAll("circle.us-point")
		.data(nationalVaxRatesByYear(vaccine)).enter()
		.append("circle")
		.attr("cx", function(d,i) { return xScale(years[i]) })
		.attr("cy", function(d) { return yScale(d) })
		.attr("values", function(d,i) { return years[i] })
		.attr("r", 3)
		.classed("us-point", true)
		.classed("active", function(d,i) { return year[i] == '2013'; })
		.attr("innerHTML", function(d, i) { return '' + year[i] });

	var lineFunction = d3.svg.line()
		.x(function(d, i) { return xScale(years[i]) })
		.y(function(d) { return yScale(d) })
		.interpolate("linear");

	var nationalLine = graph.append("path")
		.attr("d", lineFunction(nationalVaxRatesByYear(vaccine)))
		.classed("graph-line", true)


	d3.json("us-10m.json", function(error, shapes) {
		var states = topojson.feature(shapes, shapes.objects.states).features;	

		map.selectAll("path.map").remove();
		map.selectAll("path").data(states).enter()
		.append("path").attr("d", path).attr("class", "map")
		.attr("transform", "scale(0.5)")
		.attr("transform", "translate(-50," + mapYStart + ")")
		.style("fill", function (state) {
			var stateFips = state.id;
			var stateName = findName(stateFips);

			var stateVaxRate = findVaxRate(stateName, year, vaccine, overallDict);

			//data unavailable
			if (stateVaxRate != '') {
				return colorScale(stateVaxRate);
			}
				else { return "gray"; }
		})
		.style("stroke", "#fff");

	d3.select('#min')
		.text('The lowest vaccination rate in ' + year + ' for ' + vaccine + ' was ' + minVaxRate[1] + ' in ' + minVaxRate[0]);
	d3.select('#max')
	.text('The highest vaccination rate in ' + year + ' for ' + vaccine + ' was ' + maxVaxRate[1] + ' in ' + maxVaxRate[0]);

	})
}





var drawNationalNow = function () { drawNational(selectedYear, selectedVaccine); }

drawNationalNow();

d3.selectAll('select').on('change', function() {
	selectedVaccine = this.value;
	drawNationalNow();
})


var setActiveLabel = function(label) {
	var prevActive = d3.select('text.xlabel.active')
		.classed("active", false);
	d3.select(label).classed('active', true);
}



//Listener for x axis labels. Change selected year when label clicked.
d3.selectAll('text.xlabel').on('click', function() {
	setActiveLabel(this);
	selectedYear = this.innerHTML;
	drawNationalNow();
})
	
}) }) })