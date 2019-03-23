
/*
 *  GameOfThronesMap - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with all stations of the bike-sharing network
 */

GameOfThronesMap = function(_parentElement, _battles, _deaths, _predictions) {

	this.parentElement = _parentElement;
	this.battles = _battles;
	this.deaths = _deaths;
	this.predictions = _predictions;
	this.initVis();
}


/*
 *  Initialize Game of Thrones map
 */

GameOfThronesMap.prototype.initVis = function() {
	var vis = this;
	console.log(vis);
	var map = L.map('GoT-map', {
	  center: [ 5, 20 ],
	  zoom: 5,
	  maxZoom: 8,
	  minZoom: 4,
	  maxBounds: [ [ 50, -30 ], [ -45, 100 ] ]
  });

	// Render Carto GoT tile baselayer
	L.tileLayer(
	  'https://cartocdn-gusc.global.ssl.fastly.net/ramirocartodb/api/v1/map/named/tpl_756aec63_3adb_48b6_9d14_331c6cbc47cf/all/{z}/{x}/{y}.png',
	  { crs: L.CRS.EPSG4326 }).addTo(map);


	vis.wrangleData();
}


/*
 *  Data wrangling
 */

GameOfThronesMap.prototype.wrangleData = function() {
	var vis = this;

	// Currently no data wrangling/filtering needed
	// vis.displayData = vis.data;

	// Update the visualization
	vis.updateVis();

}


/*
 *  The drawing function
 */

GameOfThronesMap.prototype.updateVis = function() {

}
