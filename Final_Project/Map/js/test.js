

GameOfThronesMap = function(_parentElement){
	this.parentElement = _parentElement
	this.initVis();
}


GameOfThronesMap.prototype.initVis = function(){
	var vis = this;
	var map = L.map('outer', {
	  center: [ 5, 20 ],
	  zoom: 4,
	  maxZoom: 8,
	  minZoom: 4,
	  maxBounds: [ [ 50, -30 ], [ -45, 100 ] ]
  });

  	// Render Carto GoT tile baselayer
	L.tileLayer(
	  'https://cartocdn-gusc.global.ssl.fastly.net/ramirocartodb/api/v1/map/named/tpl_756aec63_3adb_48b6_9d14_331c6cbc47cf/all/{z}/{x}/{y}.png',
	  { crs: L.CRS.EPSG4326 }).addTo(map);


}
