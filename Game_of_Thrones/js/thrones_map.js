/**
 * Constructor for the Game of Thrones Map
 * @param parentElement
 * @param battles battle information
 * @param deaths info about character deather
 * @param predictions predicitons about characters
 */
function GameOfThronesMap(parentElement, battles, deaths, predictions){
	var vis = this;
	vis.parentElement = parentElement;
	vis.battles = battles;
	vis.deaths = deaths;
	vis.predictions = predictions;
	vis.init();
};

/*
 *  Initialize Game of Thrones map
 */

GameOfThronesMap.prototype.init = function() {
	var vis = this;
	console.log(vis);
	vis.layers = {} // Map layer dictionary (key/value = title/layer)
	vis.selectedRegion = null;
	vis.map = L.map('GoT-map', {
		center: [5, 20],
		zoom: 5,
		maxZoom: 8,
		minZoom: 4,
		maxBounds: [
			[50, -30],
			[-45, 100]
		]
	});
	// Render Carto GoT tile baselayer
	L.tileLayer(
		'https://cartocdn-gusc.global.ssl.fastly.net/ramirocartodb/api/v1/map/named/tpl_756aec63_3adb_48b6_9d14_331c6cbc47cf/all/{z}/{x}/{y}.png', {
			crs: L.CRS.EPSG4326
		}).addTo(vis.map);
	vis.wrangleData();
};

GameOfThronesMap.prototype.addKingdoms = function(geojson) {
	// Initialize new geojson layer
	var vis = this;
	vis.layers.kingdom = L.geoJSON(geojson, {
		// Set layer style
		color: '#222',
		weight: 1,
		opacity: 0.65,
		onEachFeature: vis.onEachKingdom.bind(vis)
	}).addTo(vis.map);
};

GameOfThronesMap.prototype.setHighlightedRegion = function(layer) { //FIXME: PROTOTYPE NOT WORKING, THIS FUNCTION IT NOT DEFINED(?)
	var vis = this;
	if (vis.selected) { // if there is a highlighed region, unhighlight it
		vis.layers.kingdom.resetStyle(vis.selected);
	}

	vis.selected = layer;
	if (vis.selected) {
		vis.selected.bringToFront();
		vis.selected.setStyle({color: 'blue'});
	}
};

GameOfThronesMap.prototype.onEachKingdom = function(feature, layer) {
	var vis = this;
	//bind click
	layer.on({
		// click: whenClicked
		click: (e) => {
			const kingdom = feature.properties.kingdom;
			console.log(kingdom);
			vis.setHighlightedRegion(layer);
		}
	});
};


/*
 *  Data wrangling
 */

GameOfThronesMap.prototype.wrangleData = function() {
	var vis = this;

	// Currently no data wrangling/filtering needed
	// vis.displayData = vis.data;

	// Update the visualization
	vis.updateVis();

};


/*
 *  The drawing function
 */

GameOfThronesMap.prototype.updateVis = function() {

};
