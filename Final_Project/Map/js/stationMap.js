
/*
 *  StationMap - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with all stations of the bike-sharing network
 */

StationMap = function(_parentElement, _data, _mapPosition) {

	this.parentElement = _parentElement;
	this.data = _data;
	this.mapPosition = _mapPosition;
	console.log(this.data)
	this.initVis();
}


/*
 *  Initialize station map
 */

StationMap.prototype.initVis = function() {
	var vis = this;
	var lineData = [];
	$.getJSON("mbta-lines.json", function(data) {
		lineData = data;
		console.log(lineData);
		var lines = L.geoJson(lineData, {
		  style: style,
		  weight: 5,
		  fillOpacity: 0.7
		}).addTo(map);
	});
	var map = L.map('ny-map').setView([42.360081, -71.058884], 13);
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	   attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

	L.Icon.Default.imagePath = 'img/';
	var harvard = L.layerGroup().addTo(map);
	var marker = L.marker([42.378774, -71.117303]).bindPopup("Harvard");
	harvard.addLayer(marker);

	var blueBike = L.layerGroup().addTo(map);
	for(var i = 0; i < this.data.length; i++){
		var bike = L.marker([this.data[i].lat, this.data[i].long]).bindPopup(this.data[i].name);
		blueBike.addLayer(bike);
	}



	function style(feature) {
		console.log("hello");
		switch (feature.properties.LINE) {
		  case 'GREEN':
		  	return { color: "green" };
		  case 'RED':
		  	return { color: "red" };
		  case 'ORANGE':
		  	return { color: "orange" };
		  case 'SILVER':
		  	return { color: "gray" };
		  case 'BLUE':
		  	return { color: "blue" };
		}
	}
	//
	// // Add empty layer groups for the markers / map objects
	// var nySights = L.layerGroup().addTo(map);
	// var subwayStations = L.layerGroup().addTo(map);
	//
	// // Create marker
	// var centralPark = L.marker([40.771133,-73.974187]).bindPopup("Central Park");
	//
	// // Add marker to layer group
	// nySights.addLayer(centralPark);

	vis.wrangleData();
}


/*
 *  Data wrangling
 */

StationMap.prototype.wrangleData = function() {
	var vis = this;

	// Currently no data wrangling/filtering needed
	// vis.displayData = vis.data;

	// Update the visualization
	vis.updateVis();

}


/*
 *  The drawing function
 */

StationMap.prototype.updateVis = function() {

}
