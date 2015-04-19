/** Make a dictionary for a dataset.
The key is something like 'Alabama 2008',
and the value is an object corresponding to the various vaccination rates. **/
var makeDict = function(dataset) {
	return d3.map(dataset, function(d) { return d.Region + ' ' + d.Year; });
}

/**returns a single number corresponding to the vaccination rate
in the given region, year, and dictionary for the given vaccine.
Returns empty string '' if no data available or not found. **/
var findVaxRate = function(region, year, vaccine, dict) {
	try { 
		var line = dict.get(region + ' ' + year);
		return line[vaccine];
	}
	catch(err)
		{ 	//console.log('couldnt find vax rate for ' + region) 
			return '';
	}
}

/** Returns an array containing the region with the lowest vaccination rate and the rate.
Note that both a dataset and its corresponding dictionary must be inputted. **/
var findMinVaxRate = function(year, vaccine, dataset, dict) {
	return dataset.reduce(function(prev, curr, i, a) {
		var currRegion = curr.Region;
		var currVaxRate = findVaxRate(currRegion, year, vaccine, dict);

		if (currVaxRate < prev[1] && currVaxRate != '') {
			return [currRegion, currVaxRate];
		}
		else { return prev; }
	}, ['', 100]);
}

/** Returns an array containing the region with the highest vaccination rate and the rate.
Note that both a dataset and its corresponding dictionary must be inputted. **/
var findMaxVaxRate = function(year, vaccine, dataset, dict) {
	return dataset.reduce(function(prev, curr, i, a) {
		var currRegion = curr.Region;
		var currVaxRate = findVaxRate(currRegion, year, vaccine, dict);

		if (currVaxRate > prev[1] && currVaxRate != '') {
			return [currRegion, currVaxRate];
		}
		else { return prev; }
	}, ['', 0]);
}