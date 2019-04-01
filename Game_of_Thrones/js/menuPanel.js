/**
 * Constructor for the Game of Thrones Map

 */
function MenuPanel(parentElement, houses, houseBattles, currentHouse, map){
	var vis = this;
	vis.parentElement = parentElement;
	vis.houses = houses;
	vis.houseBattles = houseBattles;
	vis.currentHouse = currentHouse;
	vis.map = map;
	vis.init();
};

/*
 *  Initialize Game of Thrones map
 */

MenuPanel.prototype.init = function() {
	var vis = this;

	vis.svgHeight = 850;
	vis.svg = d3.select("#menuPanelId").append("svg")
					.attr("id", "svg-menu-main")
					.attr("height", vis.svgHeight)
					.attr("width", "100%");


	vis.update()
};


/*
 *  Data wrangling
 */

MenuPanel.prototype.wrangleData = function() {
	var vis = this;

	// Currently no data wrangling/filtering needed
	// vis.displayData = vis.data;

	// Update the visualization
	vis.update();

};


/*
 *  The drawing function
 */

MenuPanel.prototype.update = function() {
	var vis = this;
	var sigilGroup = vis.svg.append("g").attr("class", "sigils");
	var sigils = ["None", "Lannister", "Targaryen", "Greyjoy", "Baratheon", "NightsWatch", "Arryn", "Stark", "Tyrell", "Martell", "Wildling", "Tully"];
	sigilGroup.selectAll('image').remove().exit().data(vis.houses).enter()
		.append('image')
		.attr("xlink:href",function(d, index){
			return "./css/houseSigils/" + sigils[index] + ".jpg";
		})
		.attr("width", 200)
		.attr("height", 150)
		.attr("x", function(d, i){
			if((i%3) == 0){
				return 70;
			}
			if((i%3) == 1){
				return 320;
			}
			if((i%3) == 2){
				return 570;
			}
		})
		.attr("y", function(d, i){
			if((i%4) == 0){
				return 150;
			}
			if((i%4) == 1){
				return 320;
			}
			if((i%4) == 2){
				return 490;
			}
			if((i%4) == 3){
				return 660;
			}
		})
		.on('click', function(d, i){
			d3.select("#menuPanelId").style("display", "none");
			d3.select("#housePanelId").style("display", "inline");
			//set the markers
			var currentName = sigils[i];
			var currentBattles = vis.houseBattles[i][currentName];
			var icon = L.icon({
			    iconUrl: 'css/images/sword.png',
			    iconSize: [15, 30], // size of the icon
			});
			vis.layerGroup = L.layerGroup().addTo(vis.map.map);

			for(var i = 0; i < currentBattles.length; i++) {
				var currentLat = parseFloat(currentBattles[i].lat);
				var currentLong = parseFloat(currentBattles[i].long);
				vis.marker = new L.marker([currentLat,currentLong], {icon: icon})
								.bindPopup(currentBattles[i].name)
								.addTo(vis.layerGroup);
			}
			vis.housePanel = new HousePanel(d, currentName, vis);
		});
	// FIXME: Make this look prettier
	sigilGroup.selectAll("text").remove().exit().data(vis.houses).enter()
		.append("text")
		.text(function(d, i){
			console.log(d);
			if((sigils[i] != "Wildling") && (sigils[i] != "Night's Watch")){
				return "House " + sigils[i];
			}
			else {
				return sigils[i];
			}
		})
		.attr("x", function(d, i){
			if((i%3) == 0){
				return 70;
			}
			if((i%3) == 1){
				return 320;
			}
			if((i%3) == 2){
				return 570;
			}
		})
		.attr("y", function(d, i){
			if((i%4) == 0){
				return 150;
			}
			if((i%4) == 1){
				return 320;
			}
			if((i%4) == 2){
				return 490;
			}
			if((i%4) == 3){
				return 660;
			}
		})
		.style("font-size", 28)
		.style("font", 'MedievalSharp');
};
