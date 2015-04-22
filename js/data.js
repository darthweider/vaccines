/** Make a dictionary for a dataset.
The key is something like 'Alabama 2008',
and the value is an object containing vaccination rate. **/
var makeLookup = function(dataset) {
	return d3.map(dataset, function(d) { return d.Region + ' ' + d.Year; });
}

/**returns a single number corresponding to the vaccination rate
in the given region, year, and dictionary for the given vaccine.
Returns empty string '' if no data available or not found. **/
var findVaxRate = function(region, year, lookup) {
	try { 
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
var findMinVaxRate = function(year, dataset, lookup) {
	return dataset.reduce(function(prev, curr, i, a) {
		var currRegion = curr.Region;
		var currVaxRate = findVaxRate(currRegion, year, lookup);

		if (currVaxRate < prev[1] && currVaxRate != '') {
			return [currRegion, currVaxRate];
		}
		else { return prev; }
	}, ['', 100]);
}

/** Returns an array containing the region with the highest vaccination rate and the rate.
Note that both a dataset and its corresponding dictionary must be inputted. **/
var findMaxVaxRate = function(year, dataset, lookup) {
	return dataset.reduce(function(prev, curr, i, a) {
		var currRegion = curr.Region;
		var currVaxRate = findVaxRate(currRegion, year, lookup);

		if (currVaxRate > prev[1] && currVaxRate != '') {
			return [currRegion, currVaxRate];
		}
		else { return prev; }
	}, ['', 0]);
}


/** Summarized statistics for each year. 
Each item in the array corresponds to a year. **/
var nationalVaxRatesByYear = function(lookup) {
	years.map(function(year) {
		return findVaxRate('US National', year, lookup);
	})
}
var minVaxRatesByYear = function(lookup) {
	return years.map(function(year) {
		return findMinVaxRate(year, vaccine, lookup);
	})
}
var maxVaxRatesByYear = function(lookup) {
	return years.map(function(year) {
		return findMaxVaxRate(year, vaccine, lookup);
	})
}

/**Returns a number, 
corresponding to the minimum vaccination rate in any year, for any region, for this vaccine.**/
var minVaxEver = function(lookup) {
	return d3.min(minVaxRatesByYear(lookup), function(d) {
		return d[1];
	})
}
/**Returns a number**/
var maxVaxEver = function(lookup) {
	return d3.min(maxVaxRatesByYear(lookup), function(d) {
		return d[1];
	})
}