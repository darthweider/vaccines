d3.csv("./data/mmr_only.csv", function(d) {
var mmrData = cleanData(d);
//console.log(mmrData);


/** Make a dictionary for a dataset.
The key is something like 'Alabama 2008',
and the value is an object containing vaccination rate. **/
var makeLookup = function(dataset) {
	return d3.map(dataset, function(d) { return d.Region + ' ' + d.Year; });
}
var mmrLookup = makeLookup(mmrData);
//console.log(mmrLookup);


var data = {'MMR': {array: mmrData, lookup: mmrLookup}
	}

var years = ['2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013'];









/*************************FUNCTIONS FOR ANALYZING DATA***************************/

/**returns a single number corresponding to the vaccination rate
in the given region, year, and dictionary for the given vaccine.
Returns empty string '' if no data available or not found. **/
var findVaxRate = function(region, year, vaccine) {
	try { 
		var lookup = data[vaccine]['lookup'];
		return lookup.get(region + ' ' + year).VaccinationRate;
	}
	catch(err)
		{ 	//console.log('couldnt find vax rate for ' + region) 
			return '';
	}
}

/** Returns the region and % of the lowest vaccination rate in a given year.
Returns an array containing the region with the lowest vaccination rate and the rate.
Note that both a dataset and its corresponding dictionary must be inputted. **/
var findMinVaxRate = function(year, vaccine) {
	var dataset = data[vaccine]['array'];

	return dataset.reduce(function(prev, curr, i, a) {
		var currRegion = curr.Region;
		var currVaxRate = findVaxRate(currRegion, year, vaccine);

		if (currVaxRate < prev[1] && currVaxRate != '') {
			return [currRegion, currVaxRate];
		}
		else { return prev; }
	}, ['', 100]);
}

/** Returns an array containing the region with the highest vaccination rate and the rate.
Note that both a dataset and its corresponding dictionary must be inputted. **/
var findMaxVaxRate = function(year, vaccine) {
	var dataset = data[vaccine]['array'];

	return dataset.reduce(function(prev, curr, i, a) {
		var currRegion = curr.Region;
		var currVaxRate = findVaxRate(currRegion, year, vaccine);

		if (currVaxRate > prev[1] && currVaxRate != '') {
			return [currRegion, currVaxRate];
		}
		else { return prev; }
	}, ['', 0]);
}


/** Summarized statistics for each year. 
Each item in the array corresponds to a year. **/
var nationalVaxRatesByYear = function(vaccine) {
	return years.map(function(year) {
		return findVaxRate('US National', year, vaccine);
	})
}

var minVaxRatesByYear = function(vaccine) {
	return years.map(function(year) {
		return findMinVaxRate(year, vaccine);
	})
}

var maxVaxRatesByYear = function(vaccine) {
	return years.map(function(year) {
		return findMaxVaxRate(year, vaccine);
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
/**************************************************************************************/




var SVG_WIDTH = 1000,
	PADDING = 50,
	LEFT_PADDING = 50, //between svg edge and y-axis line
	LABEL_PADDING = 25; //between axis labels and axis line

var GRAPH_HEIGHT = 200,
	graph_width = SVG_WIDTH - PADDING*2,
    MAP_HEIGHT = 300,
	svg_height = GRAPH_HEIGHT + PADDING*4 + MAP_HEIGHT;

var originX = LEFT_PADDING,
	originY = PADDING + GRAPH_HEIGHT,
	endX = PADDING + graph_width,
	endY = PADDING;

var mapYStart = GRAPH_HEIGHT + PADDING*2 - 70;

var mapCenterY = svg_height - (MAP_HEIGHT/2) - PADDING,
	mapCenterX = SVG_WIDTH/2;

var selectedYear = '2013',
	selectedVaccine = 'MMR';


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
var projection = d3.geo.albersUsa().translate([mapCenterX, mapCenterY]).scale(800);
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


	d3.json("./data/us-10m.json", function(error, shapes) {
		var states = topojson.feature(shapes, shapes.objects.states).features;	

		map.selectAll("path.map").remove();
		map.selectAll("path").data(states).enter()
		.append("path")
		.attr("d", path).attr("class", "map")
//		.attr("transform", "translate(-50," + mapYStart + ")")
		.style("fill", function (state) {
			var stateFips = state.id;
			var stateName = findName(stateFips);
			var stateVaxRate = findVaxRate(stateName, year, vaccine);


			if (stateVaxRate != '') {
				return colorScale(stateVaxRate);
			}
				//if data unavailable			
				else { return "gray"; }
		})
		.style("stroke", "#fff");


	var radiusScale = d3.scale.sqrt()
		.domain([minVaxEver(vaccine), maxVaxEver(vaccine)])
		.range([1, 20]);

		map.selectAll("circle.bubble").remove();
		var bubbles = map.selectAll("circle").data(states).enter()
			.append("circle")
			.each(function(state) {
				var stateFips = state.id;
				var stateName = findName(stateFips);
				var stateVaxRate = findVaxRate(stateName, year, vaccine);
				
				//set radius
				if (stateVaxRate != '') {
					state.properties.r = radiusScale(parseInt(stateVaxRate));
				}
				//if data unavailable			
				else { state.properties.r = 0; }
				//set centroid				
				if (findName(state.id) == '') { 
					state.properties.c = [0,0];}
				else { state.properties.c = path.centroid(state) };
				state.properties.x = mapCenterX;
				state.properties.y = mapCenterY;
				})
			.attr("r", function(state) { return state.properties.r; })
			.attr("cx", function(state) { return state.properties.c[0] })
			.attr("cy", function(state) { return state.properties.c[1] })
			.attr("class", "bubble")
			.attr("fill", 'white')
			.attr("stroke", 'gray');

		// prepare data for force layout
		forceNodes = [];
		for(i = 0 ; i < states.length ; i++ ) {
			forceNodes.push(states[i].properties);
		}
		// force layout, makes circles closer.
		// This is useful when circle radius changes.
		force = d3.layout.force().size([SVG_WIDTH,svg_height]).nodes(forceNodes)
			.charge(-1)
			.gravity(0.5)
			.friction(0.1);

		// collision detection, prevents circles from overlapping each other
		force.on("tick", function() {
			for(i = 0 ; i < states.length ; i++) {
				for(j = 0 ; j < states.length ; j++) { 
					it = states[i].properties; 
				  	jt = states[j].properties; if(i==j) continue; // not collide with self
				  	r = it.r + jt.r; // it.c is the centroid of each county and initial position of circle 
				  	itx = it.x + it.c[0]; ity = it.y + it.c[1]; 
				  	jtx = jt.x + jt.c[0]; jty = jt.y + jt.c[1]; 
				  	// distance between centroid of two circles 
				  	d = Math.sqrt( (itx - jtx) * (itx - jtx) + (ity - jty) * (ity - jty) ); 
				  	if(r > d) { 
					  	// there's a collision if distance is smaller than radius
						dr = ( r - d ) / ( d * 1 );
						it.x = it.x + ( itx - jtx ) * dr;
						it.y = it.y + ( ity - jty ) * dr;
					}
				}
			}
		bubbles
			.attr("cx",function(state) { 
				return state.properties.x + state.properties.c[0] - mapCenterX; })
			.attr("cy",function(state) { 
				return state.properties.y + state.properties.c[1] - mapCenterY + 150; });
		});

		force.start()


	d3.select('#min')
		.text('The lowest vaccination rate in ' + year + ' for ' + vaccine + ' was ' + minVaxRate[1] + ' in ' + minVaxRate[0]);
	d3.select('#max')
	.text('The highest vaccination rate in ' + year + ' for ' + vaccine + ' was ' + maxVaxRate[1] + ' in ' + maxVaxRate[0]);

	})
}





var drawNationalNow = function () { drawNational(selectedYear, selectedVaccine); }

drawNationalNow();


/**
d3.selectAll('select').on('change', function() {
	selectedVaccine = this.value;
	drawNationalNow();
})
**/

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
	
})