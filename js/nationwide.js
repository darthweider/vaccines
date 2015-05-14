var data = {};
var years = ['2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013'];

var canInit = false;


var selectedYear = '2013',
	selectedVaccine = 'MMR',
	selectedFips = '36';


/** Make a dictionary for a dataset.
The key is something like 'Alabama 2008',
and the value is an object containing vaccination rate. **/
var makeLookup = function(dataset) {
//	return d3.map(dataset, function(d) { return d.Region + ' ' + d.Year; });
	return d3.nest()
		.key(function(d) { return d.Region })
		.key(function(d) { return d.Year })
		.map(dataset)

}

d3.csv("./data/mmr_only.csv", function(d) {
	var mmrData = cleanData(d);
//	console.log(mmrData);
	data['MMR'] = {array: mmrData, lookup: makeLookup(mmrData) }
	if (canInit) { init(); }	
	else { canInit = true; }
})

d3.tsv("./data/us-pop.tsv", function(d) {
	var popData = cleanData(d);
	data['Population'] = {array: popData, lookup: makeLookup(popData)}
	if (canInit) { init() }
	else { canInit = true }
})


/**************SVG CONSTANTS********************/
var SVG_WIDTH = 900,
	SVG_HEIGHT = 700,
	LEFT_PADDING = 70, //between svg edge and y-axis line
	RIGHT_PADDING = 50,
	LABEL_PADDING = 25, //between axis labels and axis line
	TOP_PADDING = 15,
	BOTTOM_PADDING = 40;

var GRAPH_HEIGHT = 0.4 * SVG_HEIGHT,
	graph_width = SVG_WIDTH - LEFT_PADDING - RIGHT_PADDING,
    MAP_HEIGHT = SVG_HEIGHT - GRAPH_HEIGHT;

var originX = LEFT_PADDING,
	originY = GRAPH_HEIGHT - BOTTOM_PADDING,
	endX = LEFT_PADDING + graph_width,
	endY = TOP_PADDING;

var mapCenterY = MAP_HEIGHT/2,
	mapCenterX = SVG_WIDTH/2;




var vaxSvg = d3.select("#vaccinations");

var map = vaxSvg.append("svg")
	.attr("width", SVG_WIDTH)
	.attr("height", MAP_HEIGHT)
	.attr("id", 'map');

var graph = vaxSvg.append("svg")
	.attr("width", SVG_WIDTH)
	.attr("height", GRAPH_HEIGHT)
	.attr("id", 'graph');



/*********************GRAPH COMPONENTS*******************/
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
	.classed("xlabel", true)
	.attr("x", function(year) { return xScale(year); })
	.attr("y", originY + LABEL_PADDING)
	.classed("active", function(year) { return year == selectedYear })
	.text(function(year) { return year; });

/*************************FUNCTIONS FOR ANALYZING DATA***************************/

/**returns a single number corresponding to the vaccination rate
in the given region, year, and dictionary for the given vaccine.
Returns empty string '' if no data available or not found. **/
var findVaxRate = function(region, year, vaccine) {
	try { 
		var lookup = data[vaccine]['lookup'];
		return lookup[region][year][0]['VaccinationRate'];
	}
	catch(err) { return ''; }
}

/** Summarized statistics for each year. 
Each item in the array corresponds to a year. **/

var vaxRatesByYear = function(region, vaccine) {
	return years.map(function(year) {
		return findVaxRate(region, year, vaccine);
	})
}

/**Returns a number, 
corresponding to the minimum vaccination rate in any year, for any region, for this vaccine.**/
var minVaxEver = function(vaccine) {
	var min = 100;
	for (var region in data[vaccine]['lookup']) {
		years.forEach(function(year) {
			var rate = findVaxRate(region, year, vaccine)
			if (rate < min && rate != '') {
				min = rate;
			}
		})	
	}
	return min;	
}

/**Returns a number**/
var maxVaxEver = function(vaccine) {
	var max = 0;
	for (var region in data[vaccine]['lookup']) {
		years.forEach(function(year) {
			var rate = findVaxRate(region, year, vaccine)
			if (rate > max && rate != '') {
				max = rate;
			}
		})	
	}
	return max;	
}
/**************************************************************************************/
var init = function() {
	var min = minVaxEver(selectedVaccine),
		max = maxVaxEver(selectedVaccine);

	var yScale = d3.scale.linear()
		.domain([min, max])
		.range([originY, endY])
		.nice();

	var colorScale = d3.scale.linear()
		.domain([min, max])
		.range(['maroon', 'white']);

	var colorForFips = function(fips, year) {
		var stateVaxRate = findVaxRate(fipsToName(fips), year, selectedVaccine);
		if (stateVaxRate != '') {
			return colorScale(parseFloat(stateVaxRate));
		}
		//if data unavailable			
		else { return 'gray'; } 
	}

	var yAxisLabels = graph.selectAll("g.ylabel")
		.data(yScale.ticks(5)).enter()
	yAxisLabels.append("circle")
		.classed("ylabel", true)
		.attr("r", 5)
		.attr("cx", originX - LABEL_PADDING - 28)
		.attr("cy", function(rate) { return yScale(rate) - 2 })
		.attr("fill", function(rate) { return colorScale(rate) })
	yAxisLabels.append("text")
		.classed("ylabel", true)
		.attr("x", originX - LABEL_PADDING)
		.attr("y", function(rate) { return yScale(rate) })
		.text(function(rate) { return rate + "%"; })





			var updateBubbles = function(selection) {
				selection
					.classed('active', function(state) { return state.id == selectedFips})
					.transition()
					.attr("r", function(state) { return state.properties.r })
					.attr("fill", function(state) { 
						if (state.id == selectedFips) {
							return 'black'
						}
						return colorForFips(state.id, selectedYear) })
			}

			var updateAllBubbles = function() {
				updateBubbles(map.selectAll('.bubble'))
			}

		 	var updateBubbleLabels = function(selection) {
		 		selection
					.classed('active', function(state) { return state.id == selectedFips})		 			
					.transition()
					.attr("fill", function(state) {
						if (state.id == selectedFips) { return 'white' }
						return 'black'
					})
		 	}

 	var updateStateLines = function(selection) {
 		selection		 			
			.transition()
			.style("opacity", function() {
				if (abbrToFips(this.id) == selectedFips) { 
					return 1 }
				return 0.05						
			})
		selection
			.classed('active', function() { return abbrToFips(this.id) == selectedFips})
 	}

			//change the active state to abbr
			var updateActive = function(abbr) {
				var fips = abbrToFips(abbr);

				if (fips != selectedFips) {
					selectedFips = fips;
					//de-activate previously active and activate currently active
					updateBubbles(d3.selectAll('.bubble.active, .bubble#' + abbr))
					updateBubbleLabels(d3.selectAll('.bubble-label.active, .bubble-label#' + abbr))				
					updateStateLines(d3.selectAll('.state-line.active, .state-line#' + abbr))



					graph.selectAll(".state-line-label").remove()
					label(fipsToName(fips));
				}
			}





	// albersUsa projection
	var projection = d3.geo.albersUsa().translate([mapCenterX, mapCenterY]).scale(2*MAP_HEIGHT);
	var geoPath = d3.geo.path().projection(projection);


	var drawMap = function(year) {

		d3.json("./data/us-10m.json", function(error, shapes) {
			var states = topojson.feature(shapes, shapes.objects.states).features;	
			var nonContinentalStates = states.filter(function(state) {
				return state.id == 2 || state.id == 15;
			})


			/** Radius scale based on population **/
			var radiusScale = d3.scale.sqrt()
				.domain([minVaxEver('Population'), maxVaxEver('Population')])
				.range([8, 30]);

			var radiusForFips = function(fips, year) {
				var population = findVaxRate(fipsToName(fips), year, 'Population');
				if (population != '') {
					return radiusScale(parseFloat(population));
				}
				//if data unavailable			
				else { return 0; } 
			}

			var centroid = function(state) {			
					if (fipsToName(state.id) == '') { return [0,0] }
					else { return geoPath.centroid(state) };
			}

			map.selectAll(".node, .bubble, .bubble-label").remove()
			// force layout, makes circles closer.
			// This is useful when circle radius changes.
			var force = d3.layout.force().size([SVG_WIDTH,MAP_HEIGHT]).nodes(states)
				.charge(-0.5)
				.gravity(0.2)
				.friction(0.5)
				.start();

			var node = map.selectAll(".node")
				.data(force.nodes()).enter()
				.append("g")
				.classed('node', true)



			var bubble = node.append("circle")
				.attr('id', function(state) { return fipsToAbbr(state.id) })
				.classed("bubble", true)
				//save information into topojson feature properties
		 		.each(function(state) {
					state.properties.r = radiusForFips(state.id, year);				
					state.properties.c = centroid(state);
					state.properties.x = mapCenterX;
					state.properties.y = mapCenterY;
					})

			var bubbleLabel = node.append("text")
				.attr('id', function(state) { return fipsToAbbr(state.id) })
				.classed("bubble-label", true)
				.text(function(state) { return nameToAbbr(fipsToName(state.id)); })


			map.selectAll('.HI, .AK')
				.attr("transform", "translate(-100, -10)")

			//draw boxes for Hawaii and Alaska	
			map.selectAll('rect.non-continental').remove();
			var BOX_RADIUS = 30;
			nonContinentalStates.forEach(function(state) {
				map.append("rect")
					.classed('non-continental', true)
					.attr("x", centroid(state)[0] - BOX_RADIUS )
					.attr("y", centroid(state)[1] - BOX_RADIUS )
					.attr("width", BOX_RADIUS*2).attr("height", BOX_RADIUS*2)
			})

			var positionBubbles = function() {
				// collision detection, prevents circles from overlapping each other

				force.on("start", function() {
					bubble.each(function(state) {
						state.properties.r = radiusForFips(state.id, selectedYear);				
						})
				})
				force.on("tick", function() {
					//calculate distances for each node to move
					for(i = 0 ; i < states.length ; i++) {
						for(j = 0 ; j < states.length ; j++) { 
							it = states[i].properties; 
						  	jt = states[j].properties; if(i==j) continue; // not collide with self
						  	r = it.r + jt.r; 
						  	// it.c is the centroid of each county and initial position of circle 
						  	itx = it.x + it.c[0]; ity = it.y + it.c[1]; 
						  	jtx = jt.x + jt.c[0]; jty = jt.y + jt.c[1]; 
						  	// distance between centroid of two circles 
						  	d = Math.sqrt( (itx - jtx) * (itx - jtx) + (ity - jty) * (ity - jty) ); 
						  	if(r > d) { 
							  	// there's a collision if distance is smaller than radius
								dr = ( r - d ) / ( d * 0.85 );
								it.x = it.x + ( itx - jtx ) * dr;
								it.y = it.y + ( ity - jty ) * dr;
							}
						}
					}	

					bubble
						.attr("cx",function(state) { 
							return state.properties.x + state.properties.c[0] - mapCenterX; })
						.attr("cy",function(state) { 
							return state.properties.y + state.properties.c[1] - mapCenterY; })

					bubbleLabel
						.attr("x",function(state) { 
							return state.properties.x + state.properties.c[0] - mapCenterX; })
						.attr("y",function(state) { 
							return state.properties.y + state.properties.c[1] - mapCenterY; })					
				})
				force.alpha(0.1);
			}
			positionBubbles();





		 	updateAllBubbles()
		 	updateBubbleLabels(map.selectAll('.bubble-label'))




			//listener: check if bubbles have been clicked
			map.selectAll('.node').on('click', function(state) {
				updateActive(fipsToAbbr(state.id));
			})

			//listener: check if state lines have been clicked
			graph.selectAll('.state-line').on('click', function() {
				updateActive(this.id);
			})

				//Listener for x axis labels. Change selected year when label clicked.
			d3.selectAll('text.xlabel').on('click', function() {
				//do nothing if same year
				var thisYear = this.innerHTML;
				if (thisYear != selectedYear) {
					d3.selectAll('text.xlabel.active')
						.classed("active", false);
					d3.select(this)
						.classed('active', true);

					selectedYear = thisYear;
					updateAllBubbles(thisYear);
				}
			})




		})
	}
	drawMap(selectedYear);

	/** Add to map of line functions **/
	var makeLineFunctions = function() {
		var lineFunctions = d3.map();

		var lineFunction = d3.svg.line()
			.defined(function(d) {  return d >= min && d <= max })
			.x(function(d, i) { return xScale(years[i]) })
			.y(function(d) { return yScale(d) })
			.interpolate("linear");


		statesAbbr.forEach(function(regionArray) {
			var region = regionArray[0];
			var vaxRates = vaxRatesByYear(region, selectedVaccine);

			lineFunctions.set(region, lineFunction(vaxRates)); 
		})

		return lineFunctions;
	}
	var lineFunctions = makeLineFunctions();

	//plot a single line for a given region
	var plotLine = function(region) {
		var abbr = nameToAbbr(region);
		var isNational = region == 'US National';
		var isSelectedFips = nameToFips(region) == selectedFips;
		var className = 'state';
		if (isNational) { className = 'us' }

		d3.selectAll('path.' + abbr).remove();

		var lineFunction = lineFunctions.get(region);

		var line = graph.append("path")
			.attr("d", lineFunction)
			.attr("id", function(d) { if (!isNational) return nameToAbbr(region) })
			.classed('us-line', isNational)
			.classed('state-line', !isNational)



/** Show points on the graph
		if (isNational || isSelectedFips) {
			var firstLastYears = [years[0], years[years.length-1]]
			var firstLastRates = [findVaxRate(region, firstLastYears[0], selectedVaccine),
								  findVaxRate(region, firstLastYears[1], selectedVaccine)] 

			graph.selectAll("circle." + className + "-point").remove()
			var points = graph.selectAll("circle." + className + "-point")
				.data(firstLastRates).enter()
				.append("circle")
				.attr("cx", function(d,i) { return xScale(firstLastYears[i]) })
				.attr("cy", function(d) { return yScale(d) })
				.attr("values", function(d,i) { return firstLastYears[i] })
				.attr("r", 2)
				.classed(className + "-point", true)
		}
**/	}




	var plotAllLines = function() {
		statesAbbr.forEach(function(regionArray) {

			var isNational = regionArray[1] == 'US';
			var isSelectedFips = regionArray[3] == selectedFips && !isNational;	

			plotLine(regionArray[0]);

			if (isNational) { label(regionArray[0]) }
			if (isSelectedFips) { label(regionArray[0]) }
		})
		updateStateLines(d3.selectAll('.state-line'));
	}


	/** Add a text label for a given line drawn on the graph.
	className may be 'us-line-label' or 'state-line-label' **/
	var label = function(region) {
		var isNational = region == 'US National';
		
		var lineLabel = graph.append("text")
			.classed('us-line-label', isNational)
			.classed('state-line-label', !isNational)
			.transition()
			.attr('x', xScale('2013') + 10)
			.attr('y', function(d) {
				//avoid text collision with label for US National
				var rate2013 = findVaxRate(region, '2013', selectedVaccine),
					nationalRate2013 = findVaxRate('US National', '2013', selectedVaccine),
					rateDifference = rate2013 - nationalRate2013;
				if (region != 'US National' && rateDifference < 1 && rateDifference > 0) {
					//if rate slightly higher than national, push up a little
					return yScale(rate2013) - 10
				}
				if (region != 'US National' && rateDifference > -1 && rateDifference < 0) {
					//if slightly lower, then push down a little
					return yScale(rate2013) + 13
				}
				else {
					return yScale(rate2013)
				}
			})
			.text(region)
	}

		
	plotAllLines();




}