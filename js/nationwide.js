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
	return d3.map(dataset, function(d) { return d.Region + ' ' + d.Year; });
}

d3.csv("./data/mmr_only.csv", function(d) {
	var mmrData = cleanData(d);
	data['MMR'] = {array: mmrData, lookup: makeLookup(mmrData)}
	if (canInit) { init(); }	
	else { canInit = true; }
})

d3.tsv("./data/us-pop.tsv", function(d) {
	var popData = cleanData(d);
	data['Population'] = {array: popData, lookup: makeLookup(popData)}
	if (canInit) { init() }
	else { canInit = true }
})


var SVG_WIDTH = 800,
	SVG_HEIGHT = 500,
	LEFT_PADDING = 70, //between svg edge and y-axis line
	RIGHT_PADDING = 50,
	LABEL_PADDING = 25, //between axis labels and axis line
	TOP_PADDING = 15,
	BETWEEN_PADDING = 30;

var GRAPH_HEIGHT = 0.2 * SVG_HEIGHT,
	graph_width = SVG_WIDTH - LEFT_PADDING - RIGHT_PADDING,
    MAP_HEIGHT = SVG_HEIGHT - GRAPH_HEIGHT - BETWEEN_PADDING - TOP_PADDING;

var originX = LEFT_PADDING,
	originY = TOP_PADDING + GRAPH_HEIGHT,
	endX = LEFT_PADDING + graph_width,
	endY = TOP_PADDING;

var mapCenterY = SVG_HEIGHT - (MAP_HEIGHT/2),
	mapCenterX = SVG_WIDTH/2;




var nationalSvg = d3.select("#national")
	.append("svg")
	.attr("width", SVG_WIDTH)
	.attr("height", SVG_HEIGHT);

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
	.classed("xlabel", true)
	.attr("x", function(year) { return xScale(year); })
	.attr("y", originY + LABEL_PADDING)
	.classed("active", function(year) { return year == selectedYear })
	.text(function(year) { return year; });





	var init = function() {
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
	var vaxRatesByYear = function(region, vaccine) {
		return years.map(function(year) {
			return findVaxRate(region, year, vaccine);
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
		return d3.max(maxVaxRatesByYear(vaccine), function(d) {
			return d[1];
		})
	}
	/**************************************************************************************/

	var yScale = d3.scale.linear()
		.domain([minVaxEver(selectedVaccine), maxVaxEver(selectedVaccine)])
		.range([originY, endY])
		.nice();
	var colorScale = d3.scale.linear()
		.domain([minVaxEver(selectedVaccine), maxVaxEver(selectedVaccine)])
		.range(['maroon', 'white']);


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






	var map = nationalSvg.append("g");
	// albersUsa projection
	var projection = d3.geo.albersUsa().translate([mapCenterX, mapCenterY]).scale(2*MAP_HEIGHT);
	var path = d3.geo.path().projection(projection);



	/** Add to map of line functions **/
	var makeLineFunction = function() {
		
		var lineFunctions = d3.map();

		var lineFunction = d3.svg.line()
			.x(function(d) { return xScale(d[0]) })
			.y(function(d) { return yScale(d[1]) })
			.interpolate("linear");

		statesAbbr.forEach(function(region) {
			var vaxRates = vaxRatesByYear(region, selectedVaccine);


			//only use rates for which there is existing data
			var knownRates = function(region) {
				var rates = [];
				vaxRates.forEach(function(rate, i) {
					if (rate >= minVaxEver(selectedVaccine) && rate <= maxVaxEver(selectedVaccine)) {
						rates.push([years[i], rate]);
					}
				})
				return rates;
			}
			lineFunctions.set(region, lineFunction(knownRates(region)));
		})

		return lineFunctions;
	}

	var plotLine = function(region) {
		var abbr = nameToAbbr(region);
		var isNational = region == 'US National';

		d3.selectAll('path.' + abbr).remove();

		var lineFunction = lineFunctions.get(region);

		var line = graph.append("path")
			.attr("d", lineFunction)
			.attr("class", function(d) { if (!isNational) return nameToAbbr(region) })
			.classed('us-line', isNational)
			.classed('state-line', !isNational)
			.classed('active', nameToFips(region) == selectedFips && !isNational)
	}


	var plotAllLines = function() {
		statesAbbr.forEach(function(regionArray) {

			var isNational = regionArray[1] == 'US';
			var isSelectedFips = regionArray[3] == selectedFips && !isNational;	

			plotLine(regionArray[0]);

			if (isNational) { label(regionArray[0], 'us-line-label') }
			if (isSelectedFips) { label(regionArray[0], 'state-line-label') }
		})
	}


	/** className may be 'us-line-label' or 'state-line-label' **/
	var label = function(region, className) {

		graph.selectAll("." + className).remove()
		
		var lineLabel = graph.append("text")
			.classed(className, true)
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




/**
		graph.selectAll("circle." + className + "-point").remove()
		var points = graph.selectAll("circle." + className + "-point")
			.data(vaxRates).enter()
			.append("circle")
			.attr("cx", function(d,i) { return xScale(years[i]) })
			.attr("cy", function(d) { return yScale(d) })
			.attr("values", function(d,i) { return years[i] })
			.attr("r", 3)
			.classed(className + "-point", true)
**/


/**

**/	



	var drawMap = function(year) {
		var minVaxRate = minVaxRatesByYear(selectedVaccine)[years.indexOf(year)];
		var maxVaxRate = maxVaxRatesByYear(selectedVaccine)[years.indexOf(year)];
		


		d3.json("./data/us-10m.json", function(error, shapes) {
			var states = topojson.feature(shapes, shapes.objects.states).features;	
			var nonContinentalStates = states.filter(function(state) {
				return state.id == 2 || state.id == 15;
			})


			/** Radius scale based on population **/
			var radiusScale = d3.scale.sqrt()
				.domain([minVaxEver('Population'), maxVaxEver('Population')])
				.range([8, 20]);

			var radiusForFips = function(fips, year) {
				var population = findVaxRate(fipsToName(fips), year, 'Population');
				if (population != '') {
					return radiusScale(parseFloat(population));
				}
				//if data unavailable			
				else { return 0; } 
			}
			var colorForFips = function(fips, year) {
				var stateVaxRate = findVaxRate(fipsToName(fips), year, selectedVaccine);
				if (stateVaxRate != '') {
					return colorScale(parseFloat(stateVaxRate));
				}
				//if data unavailable			
				else { return 'gray'; } 
			}

			var centroid = function(state) {			
					if (fipsToName(state.id) == '') { return [0,0] }
					else { return path.centroid(state) };
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
				.attr('class', function(state) { return fipsToAbbr(state.id) })
				.classed("bubble", true)
				.classed("active", function(state) { return state.id == selectedFips })
				//save information into topojson feature properties
				.attr("r", function(state) { return radiusForFips(state.id, year) })			
				.attr("fill", function(state) { return colorForFips(state.id, year) })
		 		.each(function(state) {
					state.properties.r = radiusForFips(state.id, year);				
					state.properties.c = centroid(state);
					state.properties.x = mapCenterX;
					state.properties.y = mapCenterY;
					})


			var bubbleLabel = node.append("text")
				.attr('class', function(state) { return fipsToAbbr(state.id) })
				.classed("bubble-label", true)
				.classed("active", function(state) { return state.id == selectedFips })
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

			var makeBubbles = function(yr) {
				// collision detection, prevents circles from overlapping each other

				force.on("start", function() {
					bubble.each(function(state) {
						state.properties.r = radiusForFips(state.id, yr);				
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
			//				console.log(state.properties.x)
			//				console.log(state.properties.c[0])
			//				console.log(state.properties.x + state.properties.c[0] - mapCenterX)
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

			var updateBubbles = function(yr) {
				bubble
					.transition()
					.attr("r", function(state) { return state.properties.r })			
					.attr("fill", function(state) { return colorForFips(state.id, yr) })
			}


			makeBubbles(year);




			//listener: check if bubbles have been clicked
			map.selectAll('.node').on('click', function(state) {
				d3.selectAll('.bubble.active, .bubble-label.active, .state-line.active')
					.classed("active", false);
				
				d3.selectAll('.' + fipsToAbbr(state.id))
					.classed("active", true);

	//			console.log(svg.selectAll('.' + fipsToAbbr(state.id)));

				selectedFips = state.id;

				label(fipsToName(state.id), 'state-line-label');
				plotLine(fipsToName(state.id));

				console.log(d3.selectAll('path.active'))

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
					updateBubbles(thisYear);
				}
			})

		})
	}



	drawMap(selectedYear);




	/**
	d3.selectAll('select').on('change', function() {
		selectedVaccine = this.value;
		drawNationalNow();
	})
	**/
	
}