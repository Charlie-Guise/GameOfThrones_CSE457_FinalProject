

//
// GameOfThronesMap = function(_data1, _data2, _data3){
// 		var self = this;
// 		self.data1 = _data1;
// 		self.data2 = _data2;
// 		self.data3 = _data3;
// 		self.init();
// }

GameOfThronesMap = function(_parent){
		var self = this;
		self.parent = _parent
		self.init();
}


GameOfThronesMap.prototype.init = function() {
	var self = this;
	console.log(self);
	// self.margin = {top:10, right:10, left:10, bottom:10};

	// var mapDiv = d3.select("#map-container");

	//Gets access to the div element created for this chart from HTML
	// self.svgBounds = mapDiv.node().getBoundingClientRect();
	// self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
	// self.svgHeight = '100%';
	//
	// //creates svg element within the div
	// self.svg = mapDiv.append("svg")
	// .attr("width",self.svgWidth)
	// .attr("height",self.svgHeight)

	// Initialize our map
	self.map = L.map(self.parent.children[0], {
		center: [ 5, 20 ],
		zoom: 4,
		maxZoom: 8,
		minZoom: 4,
		maxBounds: [ [ 50, -30 ], [ -45, 100 ] ]
	})
	self.map.zoomControl.setPosition('bottomright');
	self.selectedRegion = null; // Store the currently selected region

	// Render Carto GoT tile baselayer
	L.tileLayer(
	  'https://cartocdn-gusc.global.ssl.fastly.net/ramirocartodb/api/v1/map/named/tpl_756aec63_3adb_48b6_9d14_331c6cbc47cf/all/{z}/{x}/{y}.png',
	  { crs: L.CRS.EPSG4326 }).addTo(self.map)




}


GameOfThronesMap.prototype.update = function() {

	// Update stuff
}
