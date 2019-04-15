/**
 * Constructor for the Game of Thrones Map
 * @param parentElement
 * @param battles battle information
 * @param deaths info about character deather
 * @param predictions predicitons about characters
 */
function GameOfThronesMap(parentElement, battles, deaths, predictions, menuPanel, houses){
	var vis = this;
	vis.parentElement = parentElement;
	vis.battles = battles;
	vis.deaths = deaths;
	vis.predictions = predictions;
	vis.menuPanel = menuPanel;
	vis.houses = houses;
	vis.colorScheme = {
		"None": "#c15c1e",
		"The Westerlands": "#87090a",
		"Crownsland": "#a9171f",
		"The Iron Islands": "#372e11",
		"Stormlands": "#fecf03",
		"Gift": "#383838",
		"The Vale":"#111a29",
		"The North": "#747474",
		"The Reach": "#8da17e",
		"Dorne": "#f08639",
		"Wilding": "#baedf8",
		"Riverlands": "#21224e"
	};
	vis.init();
};

/*
 *  Initialize Game of Thrones map
 */

GameOfThronesMap.prototype.init = function() {
	var vis = this;
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
		color: '#494949',
		weight: 0.7,
		opacity: 0.65,
		onEachFeature: vis.onEachKingdom.bind(vis)
	}).addTo(vis.map);
};

GameOfThronesMap.prototype.setHighlightedRegion = function(layer) {
	var vis = this;
	console.log(vis);
	// console.log("layer: " + layer);
	if (vis.selected) { // if there is a highlighed region, unhighlight it
		vis.layers.kingdom.resetStyle(vis.selected);
	}
	vis.selected = layer;

	if(vis.prevKingdom == layer){ // If you click on the same region
		vis.layers.kingdom.resetStyle(vis.prevKingdom);
		vis.selected = null;
	}

	vis.prevKingdom = layer;
	var currentKingdom = vis.selected.feature.properties.kingdom;
	if (vis.selected) {
		vis.selected.bringToFront();
		vis.selected.setStyle({color: vis.colorScheme[currentKingdom], weight: 2, opacity: 1});
	}
};

GameOfThronesMap.prototype.onEachKingdom = function(feature, layer) {
	var vis = this;
	// console.log("layer: " +layer);
	// console.log(feature);
	//bind click
	// layer.on({
	// 	// click: whenClicked
	// 	click: (e) => {
	// 		const kingdom = feature.properties.kingdom;
	// 		// console.log(kingdom);
	// 		// vis.setHighlightedRegion(layer);
	// 		// toggleMenuFromMap(kingdom);
	// 		// FIXME: Then I need to update what's on the menu screen(?)
	// 		vis.menuPanel = new MenuPanel("menuPanelId", vis.houses, kingdom);
	// 	}
	// });
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
