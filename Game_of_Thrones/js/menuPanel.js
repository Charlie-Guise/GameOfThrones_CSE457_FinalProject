/**
 * Constructor for the Game of Thrones Map

 */
function MenuPanel(parentElement, houses, houseBattles, currentHouse, map, battles){
	var vis = this;
	vis.parentElement = parentElement;
	vis.houses = houses;
	vis.houseBattles = houseBattles;
	vis.currentHouse = currentHouse;
	vis.battlesRawData = battles;
	vis.houseMain = [
		{"None": ["Davos Seaworth", "Samwell Tarly"]},
		{"Lannister": ["Joffrey Baratheon", "Cersei Lannister", "Tywin Lannister", "Tyrion Lannister", "Jaime Lannister"]},
		{"Targaryen": ["Daenerys Targaryen"]},
		{"Greyjoy": ["Theon Greyjoy", "Yara Greyjoy", "Euron Greyjoy"]},
		{"Baratheon": ["Robert Baratheon", "Stannis Baratheon", "Renly Baratheon"]},
		{"Night's Watch": ["Jon Snow"]},
		{"Arryn": []},
		{"Stark": ["Jon Snow", "Sansa Stark", "Bran Stark", "Robb Stark", "Arya Stark"]},
		{"Tyrell": ["Margaery Tyrell", "Loras Tyrell", "Olenna Tyrell"]}, // Don't have location data on these people
		{"Martell": []},
		{"Wildling": ["Mance Rayder", "Tormund Giantsbane"]},// Don't have location data on these people
		{"Tully": ["Catelyn Stark"]}

	];
	d3.json("data/game-of-thrones/character_paths.json", function(data) {
		vis.character_paths = data;
	})

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
	// Update the visualization
	vis.update();

};

/*
 *  The drawing function
 */

MenuPanel.prototype.update = function() {
	var vis = this;
	vis.svg.append("text").text("Houses of Westeros").attr("x", 100).attr("y", 75).style("font-size", 48).style("font-family", "Game of Thrones");
	var sigilGroup = vis.svg.append("g").attr("class", "sigils");
	var sigils = ["None", "Lannister", "Targaryen", "Greyjoy", "Baratheon", "NightsWatch", "Arryn", "Stark", "Tyrell", "Martell", "Wildling", "Tully"];

	vis.svg.selectAll('.compare-sigil')
		.remove().exit()
		.data(['Compare']).enter()
		.append('image')
			.attr("xlink:href", function(d){
				return "./css/houseSigils/" + d + ".jpg";
			})
			.attr("width", 150)
			.attr("height", 115)
			.attr("x", 320)
			.attr("y", 100)
			.attr("class", "compare-sigil")
			.on("click", function(d, i){
				d3.select("#menuPanelId").style("display", "none");
				d3.select("#comparePanelId").style("display", "inline");

				vis.comparePanel = new ComparePanel(vis.houseBattles, vis.houses, vis.houseMain, vis.battlesRawData, vis);
			});
	vis.svg.selectAll('.compare-text')
		.remove().exit()
		.data(["Who is", "the best?"]).enter()
		.append('text')
			.text(function(d){
				return d;
			})
			.attr('class', 'compare-text')
			.attr('x', function(d, index){
				if (index == 0){
					return 250;
				}
				else {
					return 470;
				}
			})
			.attr('y', 150)

	sigilGroup.selectAll('image')
		.remove().exit()
		.data(vis.houses).enter()
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
					return 250;
				}
				if((i%4) == 1){
					return 400;
				}
				if((i%4) == 2){
					return 550;
				}
				if((i%4) == 3){
					return 700;
				}
			})
			.attr("width", 150)
			.attr("height", 115)
			.style("cursor", "pointer")
			.on('click', function(d, i){
				d3.select("#menuPanelId").style("display", "none");
				d3.select("#housePanelId").style("display", "inline");
				//set the markers
				var currentName = (sigils[i] == "NightsWatch") ? "Night's Watch" : sigils[i];
				var currentBattles = vis.houseBattles[i][currentName];
				var icon = L.icon({
					iconUrl: 'css/images/sword.png',
					iconSize: [15, 30], // size of the icon
				});
				vis.battleLayerGroup = L.layerGroup().addTo(vis.map.map);
				vis.characterPathLayerGroup = L.layerGroup().addTo(vis.map.map);

				for(var i = 0; i < currentBattles.length; i++) {
					var currentLat = parseFloat(currentBattles[i].lat);
					var currentLong = parseFloat(currentBattles[i].long);
					vis.battleMarker = new L.marker([currentLat,currentLong], {icon: icon})
									.bindPopup(renderPopup(currentBattles[i]))
									.addTo(vis.battleLayerGroup);
				}
				vis.housePanel = new HousePanel(d, currentName, vis);
			})
			.on("mouseover", function() {
				d3.select(this).transition()
					.ease(d3.easeElastic)
					.duration("500")
					.attr("width", 175)
					.attr("height", 115);

			})
			.on("mouseout", function() {
				d3.select(this).transition()
					.ease(d3.easeElastic)
					.duration("500")
					.attr("width", 150)
					.attr("height", 115);
			});

		sigilGroup.selectAll("text").remove().exit().data(vis.houses).enter()
		.append("text")
		.text(function(d, i){
			if((sigils[i] != "Wildling") && (sigils[i] != "NightsWatch") && (sigils[i] != "None")){
				return "House " + sigils[i];
			}
			else {
				return sigils[i];
			}
		})
		.attr("x", function(d, i){
			if((i%3) == 0){
				return 145;
			}
			if((i%3) == 1){
				return 395;
			}
			if((i%3) == 2){
				return 645;
			}
		})
		.attr("y", function(d, i){
			if((i%4) == 0){
				return 245;
			}
			if((i%4) == 1){
				return 395;
			}
			if((i%4) == 2){
				return 545;
			}
			if((i%4) == 3){
				return 695;
			}
		})
		.style("text-anchor", "middle")
		.style("font-size", 18)
		.style("font-family", 'Game of Thrones');
};

function renderPopup(currentBattle){
	// FIXME: Make this look better lol
	var name = currentBattle.name;
	var attacker = currentBattle.attacker_1;
	var defender = currentBattle.defender_1;
	var attacker_commander = currentBattle.attacker_commander;
	var defender_commander = currentBattle.defender_commander;
	var region = currentBattle.region;
	var attacker_size = currentBattle.attacker_size;
	var defender_size = currentBattle.defender_size;
	var attacker_outcome = currentBattle.attacker_outcome;
	var winner = (attacker_outcome == "win") ? attacker : defender;

	return "<strong>" + name + "</strong><br>Attacker: " + attacker + "<br>Attacking Commander: " + attacker_commander + "<br>Attacking Army Size: "+ attacker_size + "<br>Defender: " + defender + "<br>Defending Commander: " + defender_commander + "<br>Defending Army Size: " + attacker_size + "<br>Battle Winner: " + winner;
}
