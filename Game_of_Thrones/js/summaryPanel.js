[]/*
 *  This file will create all the visualizations related to a single
 *	house. It will overlay the menuPanel
 */
function SummaryPanel(battles, houses, people, battlesRawData, menuPanel){
	var vis = this;
	vis.houses = houses;
	vis.people = people;
	vis.battles = battles;
	vis.houseNames = ["None", "Lannister", "Targaryen", "Greyjoy", "Baratheon", "Night's Watch", "Arryn", "Stark", "Tyrell", "Martell", "Wildling", "Tully"];
	vis.houseBattleNames = ["None", "Lannister", "Targaryen", "Greyjoy", "Baratheon", "Night's Watch", "Arryn", "Stark", "Tyrell", "Martell", "Rayder", "Tully"];
	vis.battlesRawData = battlesRawData;
	vis.menuPanel = menuPanel;``
	vis.init();
}


SummaryPanel.prototype.init = function(){
	var vis = this;
	vis.svgHeight = 850;
	vis.svg = d3.select("#summaryPanelId").append("svg")
					.attr("id", "svg-menu-houses")
					.attr("height", vis.svgHeight)
					.attr("width", "100%");
	// Button to go back
	var backButton = vis.svg.append("g").attr("id", "backButton");
	backButton.append("rect")
			.attr("x", 30)
			.attr("y", 30)
			.attr("width", 100)
			.attr("height", 30)
			.attr("fill","#0f1113")
			.on("click", function(){
				d3.select("#svg-menu-houses").remove();
				d3.select("#summaryPanelId").style("display", "none");
				d3.select("#menuPanelId").style("display", "inline");
			});
	backButton.append("text").text("Back")
			.attr("x", 65)
			.attr("y", 50)
			.attr("fill", "white");

	vis.svg.selectAll('.compare-title')
		.remove().exit()
		.data(['Is your house winning?']).enter()
		.append('text')
			.text(function(d){
				return d;
			})
			.attr('x', 200)
			.attr('y', 50)
			.attr('class', 'compare-title');


	vis.wrangleData();
}

SummaryPanel.prototype.wrangleData = function(){
	var vis = this;

	vis.colorScheme = {
		"None": "#c15c1e",
		"Lannister": "#87090a",
		"Targaryen": "#a9171f",
		"Greyjoy": "#372e11",
		"Baratheon": "#fecf03",
		"Night's Watch": "#383838",
		"Arryn":"#111a29",
		"Stark": "#747474",
		"Tyrell": "#8da17e",
		"Martell": "#f08639",
		"Wildling": "#baedf8",
		"Tully": "#21224e"
	};

	vis.friendBattles = [{
		"None": [{"None": {"count": 0, "battles": []}}, {"Lannister": {"count": 0, "battles": []}}, {"Targaryen": {"count": 0, "battles": []}}, {"Greyjoy": {"count": 0, "battles": []}}, {"Baratheon": {"count": 0, "battles": []}}, {"Night's Watch": {"count": 0, "battles": []}}, {"Arryn": {"count": 0, "battles": []}}, {"Stark":{"count": 0, "battles": []}}, {"Tyrell": {"count": 0, "battles": []}}, {"Martell":{"count": 0, "battles": []}}, {"Rayder": {"count": 0, "battles": []}}, {"Tully": {"count": 0, "battles": []}}]
	}, {
		"Lannister": [{"None": {"count": 0, "battles": []}}, {"Lannister": {"count": 0, "battles": []}}, {"Targaryen": {"count": 0, "battles": []}}, {"Greyjoy": {"count": 0, "battles": []}}, {"Baratheon": {"count": 0, "battles": []}}, {"Night's Watch": {"count": 0, "battles": []}}, {"Arryn": {"count": 0, "battles": []}}, {"Stark":{"count": 0, "battles": []}}, {"Tyrell": {"count": 0, "battles": []}}, {"Martell":{"count": 0, "battles": []}}, {"Rayder": {"count": 0, "battles": []}}, {"Tully": {"count": 0, "battles": []}}]
	}, {
		"Targaryen": [{"None": {"count": 0, "battles": []}}, {"Lannister": {"count": 0, "battles": []}}, {"Targaryen": {"count": 0, "battles": []}}, {"Greyjoy": {"count": 0, "battles": []}}, {"Baratheon": {"count": 0, "battles": []}}, {"Night's Watch": {"count": 0, "battles": []}}, {"Arryn": {"count": 0, "battles": []}}, {"Stark":{"count": 0, "battles": []}}, {"Tyrell": {"count": 0, "battles": []}}, {"Martell":{"count": 0, "battles": []}}, {"Rayder": {"count": 0, "battles": []}}, {"Tully": {"count": 0, "battles": []}}]
	}, {
		"Greyjoy": [{"None": {"count": 0, "battles": []}}, {"Lannister": {"count": 0, "battles": []}}, {"Targaryen": {"count": 0, "battles": []}}, {"Greyjoy": {"count": 0, "battles": []}}, {"Baratheon": {"count": 0, "battles": []}}, {"Night's Watch": {"count": 0, "battles": []}}, {"Arryn": {"count": 0, "battles": []}}, {"Stark":{"count": 0, "battles": []}}, {"Tyrell": {"count": 0, "battles": []}}, {"Martell":{"count": 0, "battles": []}}, {"Rayder": {"count": 0, "battles": []}}, {"Tully": {"count": 0, "battles": []}}]
	}, {
		"Baratheon": [{"None": {"count": 0, "battles": []}}, {"Lannister": {"count": 0, "battles": []}}, {"Targaryen": {"count": 0, "battles": []}}, {"Greyjoy": {"count": 0, "battles": []}}, {"Baratheon": {"count": 0, "battles": []}}, {"Night's Watch": {"count": 0, "battles": []}}, {"Arryn": {"count": 0, "battles": []}}, {"Stark":{"count": 0, "battles": []}}, {"Tyrell": {"count": 0, "battles": []}}, {"Martell":{"count": 0, "battles": []}}, {"Rayder": {"count": 0, "battles": []}}, {"Tully": {"count": 0, "battles": []}}]
	}, {
		"Night's Watch": [{"None": {"count": 0, "battles": []}}, {"Lannister": {"count": 0, "battles": []}}, {"Targaryen": {"count": 0, "battles": []}}, {"Greyjoy": {"count": 0, "battles": []}}, {"Baratheon": {"count": 0, "battles": []}}, {"Night's Watch": {"count": 0, "battles": []}}, {"Arryn": {"count": 0, "battles": []}}, {"Stark":{"count": 0, "battles": []}}, {"Tyrell": {"count": 0, "battles": []}}, {"Martell":{"count": 0, "battles": []}}, {"Rayder": {"count": 0, "battles": []}}, {"Tully": {"count": 0, "battles": []}}]
	}, {
		"Arryn": [{"None": {"count": 0, "battles": []}}, {"Lannister": {"count": 0, "battles": []}}, {"Targaryen": {"count": 0, "battles": []}}, {"Greyjoy": {"count": 0, "battles": []}}, {"Baratheon": {"count": 0, "battles": []}}, {"Night's Watch": {"count": 0, "battles": []}}, {"Arryn": {"count": 0, "battles": []}}, {"Stark":{"count": 0, "battles": []}}, {"Tyrell": {"count": 0, "battles": []}}, {"Martell":{"count": 0, "battles": []}}, {"Rayder": {"count": 0, "battles": []}}, {"Tully": {"count": 0, "battles": []}}]
	}, {
		"Stark": [{"None": {"count": 0, "battles": []}}, {"Lannister": {"count": 0, "battles": []}}, {"Targaryen": {"count": 0, "battles": []}}, {"Greyjoy": {"count": 0, "battles": []}}, {"Baratheon": {"count": 0, "battles": []}}, {"Night's Watch": {"count": 0, "battles": []}}, {"Arryn": {"count": 0, "battles": []}}, {"Stark":{"count": 0, "battles": []}}, {"Tyrell": {"count": 0, "battles": []}}, {"Martell":{"count": 0, "battles": []}}, {"Rayder": {"count": 0, "battles": []}}, {"Tully": {"count": 0, "battles": []}}]
	}, {
		"Tyrell": [{"None": {"count": 0, "battles": []}}, {"Lannister": {"count": 0, "battles": []}}, {"Targaryen": {"count": 0, "battles": []}}, {"Greyjoy": {"count": 0, "battles": []}}, {"Baratheon": {"count": 0, "battles": []}}, {"Night's Watch": {"count": 0, "battles": []}}, {"Arryn": {"count": 0, "battles": []}}, {"Stark":{"count": 0, "battles": []}}, {"Tyrell": {"count": 0, "battles": []}}, {"Martell":{"count": 0, "battles": []}}, {"Rayder": {"count": 0, "battles": []}}, {"Tully": {"count": 0, "battles": []}}]
	}, {
		"Martell": [{"None": {"count": 0, "battles": []}}, {"Lannister": {"count": 0, "battles": []}}, {"Targaryen": {"count": 0, "battles": []}}, {"Greyjoy": {"count": 0, "battles": []}}, {"Baratheon": {"count": 0, "battles": []}}, {"Night's Watch": {"count": 0, "battles": []}}, {"Arryn": {"count": 0, "battles": []}}, {"Stark":{"count": 0, "battles": []}}, {"Tyrell": {"count": 0, "battles": []}}, {"Martell":{"count": 0, "battles": []}}, {"Rayder": {"count": 0, "battles": []}}, {"Tully": {"count": 0, "battles": []}}]
	}, {
		"Rayder": [{"None": {"count": 0, "battles": []}}, {"Lannister": {"count": 0, "battles": []}}, {"Targaryen": {"count": 0, "battles": []}}, {"Greyjoy": {"count": 0, "battles": []}}, {"Baratheon": {"count": 0, "battles": []}}, {"Night's Watch": {"count": 0, "battles": []}}, {"Arryn": {"count": 0, "battles": []}}, {"Stark":{"count": 0, "battles": []}}, {"Tyrell": {"count": 0, "battles": []}}, {"Martell":{"count": 0, "battles": []}}, {"Rayder": {"count": 0, "battles": []}}, {"Tully": {"count": 0, "battles": []}}]
	}, {
		"Tully": [{"None": {"count": 0, "battles": []}}, {"Lannister": {"count": 0, "battles": []}}, {"Targaryen": {"count": 0, "battles": []}}, {"Greyjoy": {"count": 0, "battles": []}}, {"Baratheon": {"count": 0, "battles": []}}, {"Night's Watch": {"count": 0, "battles": []}}, {"Arryn": {"count": 0, "battles": []}}, {"Stark":{"count": 0, "battles": []}}, {"Tyrell": {"count": 0, "battles": []}}, {"Martell":{"count": 0, "battles": []}}, {"Rayder": {"count": 0, "battles": []}}, {"Tully": {"count": 0, "battles": []}}]
	}];
	vis.foeBattles = [{
		"None": [{"None": {"count": 0, "battles": []}}, {"Lannister": {"count": 0, "battles": []}}, {"Targaryen": {"count": 0, "battles": []}}, {"Greyjoy": {"count": 0, "battles": []}}, {"Baratheon": {"count": 0, "battles": []}}, {"Night's Watch": {"count": 0, "battles": []}}, {"Arryn": {"count": 0, "battles": []}}, {"Stark":{"count": 0, "battles": []}}, {"Tyrell": {"count": 0, "battles": []}}, {"Martell":{"count": 0, "battles": []}}, {"Rayder": {"count": 0, "battles": []}}, {"Tully": {"count": 0, "battles": []}}]
	}, {
		"Lannister": [{"None": {"count": 0, "battles": []}}, {"Lannister": {"count": 0, "battles": []}}, {"Targaryen": {"count": 0, "battles": []}}, {"Greyjoy": {"count": 0, "battles": []}}, {"Baratheon": {"count": 0, "battles": []}}, {"Night's Watch": {"count": 0, "battles": []}}, {"Arryn": {"count": 0, "battles": []}}, {"Stark":{"count": 0, "battles": []}}, {"Tyrell": {"count": 0, "battles": []}}, {"Martell":{"count": 0, "battles": []}}, {"Rayder": {"count": 0, "battles": []}}, {"Tully": {"count": 0, "battles": []}}]
	}, {
		"Targaryen": [{"None": {"count": 0, "battles": []}}, {"Lannister": {"count": 0, "battles": []}}, {"Targaryen": {"count": 0, "battles": []}}, {"Greyjoy": {"count": 0, "battles": []}}, {"Baratheon": {"count": 0, "battles": []}}, {"Night's Watch": {"count": 0, "battles": []}}, {"Arryn": {"count": 0, "battles": []}}, {"Stark":{"count": 0, "battles": []}}, {"Tyrell": {"count": 0, "battles": []}}, {"Martell":{"count": 0, "battles": []}}, {"Rayder": {"count": 0, "battles": []}}, {"Tully": {"count": 0, "battles": []}}]
	}, {
		"Greyjoy": [{"None": {"count": 0, "battles": []}}, {"Lannister": {"count": 0, "battles": []}}, {"Targaryen": {"count": 0, "battles": []}}, {"Greyjoy": {"count": 0, "battles": []}}, {"Baratheon": {"count": 0, "battles": []}}, {"Night's Watch": {"count": 0, "battles": []}}, {"Arryn": {"count": 0, "battles": []}}, {"Stark":{"count": 0, "battles": []}}, {"Tyrell": {"count": 0, "battles": []}}, {"Martell":{"count": 0, "battles": []}}, {"Rayder": {"count": 0, "battles": []}}, {"Tully": {"count": 0, "battles": []}}]
	}, {
		"Baratheon": [{"None": {"count": 0, "battles": []}}, {"Lannister": {"count": 0, "battles": []}}, {"Targaryen": {"count": 0, "battles": []}}, {"Greyjoy": {"count": 0, "battles": []}}, {"Baratheon": {"count": 0, "battles": []}}, {"Night's Watch": {"count": 0, "battles": []}}, {"Arryn": {"count": 0, "battles": []}}, {"Stark":{"count": 0, "battles": []}}, {"Tyrell": {"count": 0, "battles": []}}, {"Martell":{"count": 0, "battles": []}}, {"Rayder": {"count": 0, "battles": []}}, {"Tully": {"count": 0, "battles": []}}]
	}, {
		"Night's Watch": [{"None": {"count": 0, "battles": []}}, {"Lannister": {"count": 0, "battles": []}}, {"Targaryen": {"count": 0, "battles": []}}, {"Greyjoy": {"count": 0, "battles": []}}, {"Baratheon": {"count": 0, "battles": []}}, {"Night's Watch": {"count": 0, "battles": []}}, {"Arryn": {"count": 0, "battles": []}}, {"Stark":{"count": 0, "battles": []}}, {"Tyrell": {"count": 0, "battles": []}}, {"Martell":{"count": 0, "battles": []}}, {"Rayder": {"count": 0, "battles": []}}, {"Tully": {"count": 0, "battles": []}}]
	}, {
		"Arryn": [{"None": {"count": 0, "battles": []}}, {"Lannister": {"count": 0, "battles": []}}, {"Targaryen": {"count": 0, "battles": []}}, {"Greyjoy": {"count": 0, "battles": []}}, {"Baratheon": {"count": 0, "battles": []}}, {"Night's Watch": {"count": 0, "battles": []}}, {"Arryn": {"count": 0, "battles": []}}, {"Stark":{"count": 0, "battles": []}}, {"Tyrell": {"count": 0, "battles": []}}, {"Martell":{"count": 0, "battles": []}}, {"Rayder": {"count": 0, "battles": []}}, {"Tully": {"count": 0, "battles": []}}]
	}, {
		"Stark": [{"None": {"count": 0, "battles": []}}, {"Lannister": {"count": 0, "battles": []}}, {"Targaryen": {"count": 0, "battles": []}}, {"Greyjoy": {"count": 0, "battles": []}}, {"Baratheon": {"count": 0, "battles": []}}, {"Night's Watch": {"count": 0, "battles": []}}, {"Arryn": {"count": 0, "battles": []}}, {"Stark":{"count": 0, "battles": []}}, {"Tyrell": {"count": 0, "battles": []}}, {"Martell":{"count": 0, "battles": []}}, {"Rayder": {"count": 0, "battles": []}}, {"Tully": {"count": 0, "battles": []}}]
	}, {
		"Tyrell": [{"None": {"count": 0, "battles": []}}, {"Lannister": {"count": 0, "battles": []}}, {"Targaryen": {"count": 0, "battles": []}}, {"Greyjoy": {"count": 0, "battles": []}}, {"Baratheon": {"count": 0, "battles": []}}, {"Night's Watch": {"count": 0, "battles": []}}, {"Arryn": {"count": 0, "battles": []}}, {"Stark":{"count": 0, "battles": []}}, {"Tyrell": {"count": 0, "battles": []}}, {"Martell":{"count": 0, "battles": []}}, {"Rayder": {"count": 0, "battles": []}}, {"Tully": {"count": 0, "battles": []}}]
	}, {
		"Martell": [{"None": {"count": 0, "battles": []}}, {"Lannister": {"count": 0, "battles": []}}, {"Targaryen": {"count": 0, "battles": []}}, {"Greyjoy": {"count": 0, "battles": []}}, {"Baratheon": {"count": 0, "battles": []}}, {"Night's Watch": {"count": 0, "battles": []}}, {"Arryn": {"count": 0, "battles": []}}, {"Stark":{"count": 0, "battles": []}}, {"Tyrell": {"count": 0, "battles": []}}, {"Martell":{"count": 0, "battles": []}}, {"Rayder": {"count": 0, "battles": []}}, {"Tully": {"count": 0, "battles": []}}]
	}, {
		"Rayder": [{"None": {"count": 0, "battles": []}}, {"Lannister": {"count": 0, "battles": []}}, {"Targaryen": {"count": 0, "battles": []}}, {"Greyjoy": {"count": 0, "battles": []}}, {"Baratheon": {"count": 0, "battles": []}}, {"Night's Watch": {"count": 0, "battles": []}}, {"Arryn": {"count": 0, "battles": []}}, {"Stark":{"count": 0, "battles": []}}, {"Tyrell": {"count": 0, "battles": []}}, {"Martell":{"count": 0, "battles": []}}, {"Rayder": {"count": 0, "battles": []}}, {"Tully": {"count": 0, "battles": []}}]
	}, {
		"Tully": [{"None": {"count": 0, "battles": []}}, {"Lannister": {"count": 0, "battles": []}}, {"Targaryen": {"count": 0, "battles": []}}, {"Greyjoy": {"count": 0, "battles": []}}, {"Baratheon": {"count": 0, "battles": []}}, {"Night's Watch": {"count": 0, "battles": []}}, {"Arryn": {"count": 0, "battles": []}}, {"Stark":{"count": 0, "battles": []}}, {"Tyrell": {"count": 0, "battles": []}}, {"Martell":{"count": 0, "battles": []}}, {"Rayder": {"count": 0, "battles": []}}, {"Tully": {"count": 0, "battles": []}}]
	}];

	for (var i = 0; i < vis.battlesRawData.length; ++i){
		for(var j = 0; j < vis.houseNames.length; ++j){
			for(var k = 0; k < vis.houseNames.length; ++k){
				var main = vis.houseBattleNames[j];
				var other = vis.houseBattleNames[k];
				var mainPresent = fought(main, vis.battlesRawData[i]);
				var otherPresent = fought(other, vis.battlesRawData[i]);
				if (mainPresent != 0 && otherPresent != 0 && main != other){
					if (mainPresent == otherPresent){
						vis.friendBattles[j][main][k][other].battles.push(vis.battlesRawData[i]);
						vis.friendBattles[j][main][k][other].count += 1;
					}
					else {
						vis.foeBattles[j][main][k][other].battles.push(vis.battlesRawData[i]);
						vis.foeBattles[j][main][k][other].count += 1;
					}
				}
			}
		}
	}
	vis.updateVis();
}

function fought(name, battle){
	if (battle.attacker_1.includes(name)) {
		return 1;
	} else if (battle.attacker_2.includes(name)) {
		return 1;
	} else if (battle.attacker_3.includes(name)) {
		return 1;
	} else if (battle.attacker_4.includes(name)) {
		return 1;
	} else if (battle.attacker_commander.includes(name)) {
		return 1;
	} else if (battle.attacker_king.includes(name)) {
		return 1;
	} else if (battle.defender_1.includes(name)) {
		return 2;
	} else if (battle.defender_2.includes(name)) {
		return 2;
	} else if (battle.defender_3.includes(name)) {
		return 2;
	} else if (battle.defender_4.includes(name)) {
		return 2;
	} else if (battle.defender_commander.includes(name)) {
		return 2;
	} else if (battle.defender_king.includes(name)) {
		return 2;
	}
	else {
		return 0;
	}
}

SummaryPanel.prototype.updateVis = function(){
	var vis = this;
	var deathScale = d3.scaleLinear()
		.domain([0, 253])
		.range([549, 0]);
	var yAxisDeath = d3.axisLeft().scale(deathScale);

	var deathChartVisible = true;
	var foeMatrixVisible = false;
	var friendMatrixVisible = false;


	//toggle buttons
	vis.svg.append("rect").attr("id", "toggleLeft")
		.attr("x", 275)
		.attr("y", 100)
		.attr("width", 75)
		.attr("height",30)
		.attr("fill", "black")
		.on("click", function(){
			console.log("Toggle Left");
			// Can't more left anymore
			if(deathChartVisible){
				return;
			}
			else {
				// shift the visual that's showing
				if(!deathChartVisible && foeMatrixVisible) {
					// move the chart out
					foeMatrixVisible = false;
					deathChartVisible = true;
					vis.svg.select("#foe-matrix")
						.transition()
						.duration(1000)
						.attr("transform", "translate(850, 0)")
						.style("fill-opacity", 1e-6)
						.on("end", function(){
							d3.select("#foe-matrix").style("display", "none");
						});
					if(vis.foeRelationLayerGroup != null){
						vis.foeRelationLayerGroup.clearLayers();
					}

					// FIXME: slowly move in the new chart
					vis.svg.select("#deathBarChart")
						.transition()
						.duration(1000)
						.attr("transform", "translate(-800, 0)")
						.style("fill-opacity", 1)
						.on("end", function() {
							d3.select("#deathBarChart").style("display", "contents");
						});
				}
				else if(!foeMatrixVisible && friendMatrixVisible) {
					// move the chart out
					friendMatrixVisible = false;
					foeMatrixVisible = true;
					vis.svg.select("#friend-matrix")
						.transition()
						.duration(1000)
						.attr("transform", "translate(850, 0)")
						.style("fill-opacity", 1e-6)
						.on("end", function(){
							d3.select("#friend-matrix").style("display", "none");
						});
						if(vis.friendRelationLayerGroup != null){
							vis.friendRelationLayerGroup.clearLayers();
						}
					// FIXME: slowly move in the new chart
					vis.svg.select("#foe-matrix")
						.transition()
						.duration(1000)
						.attr("transform", "translate(20, 0)")
						.style("fill-opacity", 1)
						.on("end", function() {
							d3.select("#foe-matrix").style("display", "contents");
						});
				}
			}

		});
	vis.svg.append("text").text("prev")
		.attr("x", 290)
		.attr("y", 123)
		.attr("width", 75)
		.attr("height",30)
		.attr("fill", "white")
		.style("font-size", 15)
		.style("font-family", "Game of Thrones");

	vis.svg.append("rect").attr("id", "toggleRight")
		.attr("x", 500)
		.attr("y", 100)
		.attr("width", 75)
		.attr("height", 30)
		.attr("fill", "black")
		.on("click", function(){
			// Can't move right anymore
			if(friendMatrixVisible){
				d3.select(this).on("click", null);
			}
			else {
				if(!foeMatrixVisible) {
					// move the chart out
					foeMatrixVisible = true;
					deathChartVisible = false;
					vis.svg.select("#deathBarChart")
						.transition()
						.duration(1000)
						.attr("transform", "translate(-800, 0)")
						.style("fill-opacity", 1e-6)
						.on("end", function(){
							d3.select("#deathBarChart").style("display", "none");
						});
					// FIXME: slowly move in the new chart
					vis.svg.select("#foe-matrix")
						.transition()
						.duration(1000)
						.attr("transform", "translate(20, 0)")
						.style("fill-opacity", 1)
						.on("end", function() {
							d3.select("#foe-matrix").style("display", "inline");
						});
				}
				else if(!friendMatrixVisible) {
					// move the chart out
					friendMatrixVisible = true;
					foeMatrixVisible = false;
					vis.svg.select("#foe-matrix")
						.transition()
						.duration(1000)
						.attr("transform", "translate(-800, 0)")
						.style("fill-opacity", 1e-6)
						.on("end", function(){
							d3.select("#foe-matrix").style("display", "none");
						});
						if(vis.foeRelationLayerGroup != null){
							vis.foeRelationLayerGroup.clearLayers();
						}
					// FIXME: slowly move in the new chart
					vis.svg.select("#friend-matrix")
						.transition()
						.duration(1000)
						.attr("transform", "translate(20, 0)")
						.style("fill-opacity", 1)
						.on("end", function() {
							d3.select("#friend-matrix").style("display", "inline");
						});

				}
			}

		});
	vis.svg.append("text").text("next")
		.attr("x", 513)
		.attr("y", 123)
		.attr("width", 75)
		.attr("height",30)
		.attr("fill", "white")
		.style("font-size", 15)
		.style("font-family", "Game of Thrones");

	// The Bar Chart
	var barchart = vis.svg.append("g").attr("id", "deathBarChart");
	barchart.append("text").text("Number of Deaths For Each Family")
			.attr("x", 135)
			.attr("y", 200)
			.style("font-size", 25)
			.style("font-family", "Game of Thrones");
	barchart.selectAll('.barchart-x-label')
		.remove().exit()
		.data(vis.houseNames).enter()
		.append('text')
			.attr('class', 'barchart-x-label')
			.text(function(d){
				return d;
			})
			.attr('y', 775)
			.attr('x', function(d, index){
				return 70 + index * 50;
			})
			.style("font-size", 13);
	barchart.selectAll('.death-rect')
		.remove().exit()
		.data(vis.houses).enter()
		.append('rect')
			.attr('class', 'death-rect')
			.attr('x', function(d, index){
				return 50 + 60 * index;
			})
			.attr('y', function(d, index){
				var tempHeight = d[vis.houseNames[index]].length;
				return 500 - (300 - deathScale(tempHeight));
			})
			.attr('height', function(d, index){
				return 550 - deathScale(d[vis.houseNames[index]].length);
			})
			.attr('width', 50)
			.attr('fill', function(d, i){
				var color = vis.colorScheme[vis.houseNames[i]];
				return color;
			})
			.style("opacity", 0.75)
			.on("mouseover", function(){
				d3.select(this).style("opacity", 1);
				//Add a tooltip with all the information about a family
				// tip.show();
			})
			.on("mouseout", function(){
				d3.select(this).style("opacity", 0.75);
				// tip.hide();
			});

	barchart.append("g").attr("class", "axis").attr("transform", "translate(50,200)").call(yAxisDeath);


	// The friend/foe matrix
	var foeMatrix = vis.svg.append("g").attr("id", "foe-matrix");
	var friendMatrix = vis.svg.append("g").attr("id", "friend-matrix");
	var circleScale = d3.scaleLinear()
		.domain([0, 19])
		.range([12, 17]);
	foeMatrix.append("text").text("Families Who Fought Against Each Other")
			.attr("x", 35)
			.attr("y", 175)
			.style("font-size", 17)
			.style("font-family", "Game of Thrones");
	friendMatrix.append("text").text("Families Who Fought With Each Other")
			.attr("x", 35)
			.attr("y", 175)
			.style("font-size", 17)
			.style("font-family", "Game of Thrones");
	for (var i = 0; i < vis.foeBattles.length; ++i){
		var tempFoe = '.foe-circle-' + i;
		foeMatrix.selectAll(tempFoe)
			.remove().exit()
			.data(vis.foeBattles[i][vis.houseBattleNames[i]]).enter() // FIXME: Making changes
			.append('circle')
				.attr('class', function(){
					return 'foe-circle-'  + i;
				})
				.attr('cx', function(d, index){
					return 150 + index * 50;
				})
				.attr('cy', function(){
					return 200 + i * 40;
				})
				.attr('r', function(d, index){
					var curHouse = d[vis.houseBattleNames[index]];
					if (curHouse.count != 0){
						return circleScale(curHouse.count);
					}
					else {
						return 7;
					}
				})
				.attr('fill', function(d, index){
					var curHouse = d[vis.houseBattleNames[index]];
					if (curHouse.count == 0){
						return '#edd49d';
					}
					else {
						return '#974449';
					}
				})
				.style("cursor", "pointer")
				.on("click", function(d, index){
					// vis.foeRelationLayerGroup = {};
					if(vis.foeRelationLayerGroup != null){
						vis.foeRelationLayerGroup.clearLayers();
					}
					var curHouse = d[vis.houseBattleNames[index]];
					if (curHouse.count != 0){
						// if there are relations I want to update the map
						// with markers where the interactions occured
						vis.foeRelationLayerGroup = L.layerGroup().addTo(vis.menuPanel.map.map);
						var icon = L.icon({
							iconUrl: 'css/images/foe.png',
							iconSize: [30, 30], // size of the icon
						});
						for(var i = 0; i < curHouse.battles.length; i++) {
							var currentLat = parseFloat(curHouse.battles[i].lat);
							var currentLong = parseFloat(curHouse.battles[i].long);
							vis.relationMarker = new L.marker([currentLat,currentLong], {icon: icon})
											.addTo(vis.foeRelationLayerGroup);
						}

					}
				})
				.on("mouseover", function(d, i) {
					var curHouse = d[vis.houseBattleNames[i]];
					if (curHouse.count != 0){
						d3.select(this).transition()
							.ease(d3.easeElastic)
							.duration("500")
							.attr("r", 23);
					}
				})
				.on("mouseout", function(d, i) {
					var curHouse = d[vis.houseBattleNames[i]];
					if (curHouse.count != 0){
						d3.select(this).transition()
							.ease(d3.easeQuad)
							.delay("100")
							.duration("200")
							.attr("r", circleScale(curHouse.count));
					}
				});
		var tempFriend = '.friend-circle-' + i;
		friendMatrix.selectAll(tempFriend)
			.remove().exit()
			.data(vis.friendBattles[i][vis.houseBattleNames[i]]).enter()
			.append('circle')
				.attr('class', function(){
					return 'friend-circle-'  + i;
				})
				.attr('cx', function(d, index){
					return 150 + index * 50;
				})
				.attr('cy', function(){
					return 200 + i * 40;
				})
				.attr('r', function(d, index){
					var curHouse = d[vis.houseBattleNames[index]];
					if (curHouse.count != 0){
						return circleScale(curHouse.count);
					}
					else {
						return 7;
					}
				})
				.attr('fill', function(d, index){
					var curHouse = d[vis.houseBattleNames[index]];
					if (curHouse.count == 0){
						return '#edd49d';
					}
					else {
						return '#0f5778';
					}
				})
				.style("cursor", "pointer")
				.on("click", function(d, index){
					// vis.foeRelationLayerGroup = {};
					if(vis.friendRelationLayerGroup != null){
						vis.friendRelationLayerGroup.clearLayers();
					}
					var curHouse = d[vis.houseBattleNames[index]];
					if (curHouse.count != 0){
						// if there are relations I want to update the map
						// with markers where the interactions occured
						vis.friendRelationLayerGroup = L.layerGroup().addTo(vis.menuPanel.map.map);
						var icon = L.icon({
							iconUrl: 'css/images/friend.png',
							iconSize: [30, 30], // size of the icon
						});
						for(var i = 0; i < curHouse.battles.length; i++) {
							var currentLat = parseFloat(curHouse.battles[i].lat);
							var currentLong = parseFloat(curHouse.battles[i].long);
							vis.relationMarker = new L.marker([currentLat,currentLong], {icon: icon})
											.addTo(vis.friendRelationLayerGroup);
						}

					}
				})
				.on("mouseover", function(d, i) {
					var curHouse = d[vis.houseBattleNames[i]];
					if (curHouse.count != 0){
						d3.select(this).transition()
							.ease(d3.easeElastic)
							.duration("500")
							.attr("r", 23);
					}
				})
				.on("mouseout", function(d, i) {
					var curHouse = d[vis.houseBattleNames[i]];
					if (curHouse.count != 0){
						d3.select(this).transition()
							.ease(d3.easeQuad)
							.delay("100")
							.duration("200")
							.attr("r", circleScale(curHouse.count));
					}
				});
	}
	foeMatrix.selectAll('.foe-y-label')
		.remove().exit()
		.data(vis.houseNames).enter()
		.append('text')
			.attr('class', 'foe-y-label')
			.text(function(d){
				return d;
			})
			.attr('x', 110)
			.attr('y', function(d, index){
				return 205 + index * 40;
			})
			.style("font-size", 12);

	friendMatrix.selectAll('.friend-y-label')
		.remove().exit()
		.data(vis.houseNames).enter()
		.append('text')
			.attr('class', 'friend-y-label')
			.text(function(d){
				return d;
			})
			.attr('x', 110)
			.attr('y', function(d, index){
				return 205 + index * 40;
			})
			.style("font-size", 12);

	foeMatrix.selectAll('.foe-x-label')
		.remove().exit()
		.data(vis.houseNames).enter()
		.append('text')
			.attr('class', 'foe-x-label')
			.text(function(d){
				return d;
			})
			.attr('y', 660)
			.attr('x', function(d, index){
				return 150 + index * 50;
			})
			.style("font-size", 13);
	friendMatrix.selectAll('.friend-x-label')
		.remove().exit()
		.data(vis.houseNames).enter()
		.append('text')
			.attr('class', 'friend-x-label')
			.text(function(d){
				return d;
			})
			.attr('y', 660)
			.attr('x', function(d, index){
				return 150 + index * 50;
			})
			.style("font-size", 13);
	d3.select("#foe-matrix").style("display", "none");
	d3.select("#friend-matrix").style("display", "none");
}

function battleSummary(battle){
	// Here is where I configure the battle summary that goes in the marker popup
}
