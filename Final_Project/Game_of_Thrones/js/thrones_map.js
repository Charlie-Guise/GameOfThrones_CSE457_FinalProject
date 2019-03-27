/**
 * Constructor for the Game of Thrones Map
 * @param parentElement
 * @param battles battle information
 * @param deaths info about character deather
 * @param predictions predicitons about characters
 */
function GameOfThronesMap(parentElement, battles, deaths, predictions, menuPanel){
	var vis = this;
	vis.parentElement = parentElement;
	vis.battles = battles;
	vis.deaths = deaths;
	vis.predictions = predictions;
	vis.menuPanel = menuPanel;
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
	// vis.map.on('click', function(e) {
	//     console.log("Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng)
	// });
	// var testPath = [[15.105019491084093, 15.737881181582281],[12.026022106442833, 15.825810117505634],[8.476463154162138, 16.133561393237514], [5.156804702874525, 16.441312668969353], [1.4238883384953338, 16.74906394470119], [-2.3150809659051137, 17.100779688394727]];
	//
	// var marker2 = L.Marker.movingMarker(testPath,
    // 	[3000, 9000, 9000, 4000], {autostart: true}).addTo(vis.map);
	//
	// L.polyline(testPath, {color: 'red'}).addTo(vis.map);

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

GameOfThronesMap.prototype.setHighlightedRegion = function(layer) {
	var vis = this;
	if (vis.selected) { // if there is a highlighed region, unhighlight it
		vis.layers.kingdom.resetStyle(vis.selected);
	}
	vis.selected = layer;

	if(vis.prevKingdom == layer){ // If you click on the same region
		vis.layers.kingdom.resetStyle(vis.prevKingdom);
		vis.selected = null;
	}

	vis.prevKingdom = layer;
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
			toggleMenuFromMap(kingdom);
			// FIXME: Then I need to update what's on the menu screen(?)
			vis.menuPanel = new MenuPanel("menuPanelId", createHouses(vis.deaths), kingdom);
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
