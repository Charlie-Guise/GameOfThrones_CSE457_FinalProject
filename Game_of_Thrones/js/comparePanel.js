/*
 *  This file will create all the visualizations related to a single
 *	house. It will overlay the menuPanel
 */
function ComparePanel(battles, houses, people, battlesRawData){
	var vis = this;
	vis.houses = houses;
	vis.people = people;
	vis.battles = battles;
	vis.houseNames = ["None", "Lannister", "Targaryen", "Greyjoy", "Baratheon", "Night's Watch", "Arryn", "Stark", "Tyrell", "Martell", "Wildling", "Tully"];
	vis.houseBattleNames = ["None", "Lannister", "Targaryen", "Greyjoy", "Baratheon", "Night's Watch", "Arryn", "Stark", "Tyrell", "Martell", "Rayder", "Tully"];
	vis.battlesRawData = battlesRawData;
	vis.init();
}


ComparePanel.prototype.init = function(){
	var vis = this;
	vis.svgHeight = 850;
	vis.svg = d3.select("#comparePanelId").append("svg")
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
				d3.select("#ComparePanelId").style("display", "none");
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

ComparePanel.prototype.wrangleData = function(){
	var vis = this;
	vis.foes = [{
		"None": [{"None": 0}, {"Lannister": 0}, {"Targaryen": 0}, {"Greyjoy": 0}, {"Baratheon": 0}, {"Night's Watch": 0}, {"Arryn": 0}, {"Stark":0}, {"Tyrell": 0}, {"Martell":0}, {"Rayder": 0}, {"Tully": 0}]
	}, {
		"Lannister": [{"None": 0}, {"Lannister": 0}, {"Targaryen": 0}, {"Greyjoy": 0}, {"Baratheon": 0}, {"Night's Watch": 0}, {"Arryn": 0}, {"Stark":0}, {"Tyrell": 0}, {"Martell":0}, {"Rayder": 0}, {"Tully": 0}]
	}, {
		"Targaryen": [{"None": 0}, {"Lannister": 0}, {"Targaryen": 0}, {"Greyjoy": 0}, {"Baratheon": 0}, {"Night's Watch": 0}, {"Arryn": 0}, {"Stark":0}, {"Tyrell": 0}, {"Martell":0}, {"Rayder": 0}, {"Tully": 0}]
	}, {
		"Greyjoy": [{"None": 0}, {"Lannister": 0}, {"Targaryen": 0}, {"Greyjoy": 0}, {"Baratheon": 0}, {"Night's Watch": 0}, {"Arryn": 0}, {"Stark":0}, {"Tyrell": 0}, {"Martell":0}, {"Rayder": 0}, {"Tully": 0}]
	}, {
		"Baratheon": [{"None": 0}, {"Lannister": 0}, {"Targaryen": 0}, {"Greyjoy": 0}, {"Baratheon": 0}, {"Night's Watch": 0}, {"Arryn": 0}, {"Stark":0}, {"Tyrell": 0}, {"Martell":0}, {"Rayder": 0}, {"Tully": 0}]
	}, {
		"Night's Watch": [{"None": 0}, {"Lannister": 0}, {"Targaryen": 0}, {"Greyjoy": 0}, {"Baratheon": 0}, {"Night's Watch": 0}, {"Arryn": 0}, {"Stark":0}, {"Tyrell": 0}, {"Martell":0}, {"Rayder": 0}, {"Tully": 0}]
	}, {
		"Arryn": [{"None": 0}, {"Lannister": 0}, {"Targaryen": 0}, {"Greyjoy": 0}, {"Baratheon": 0}, {"Night's Watch": 0}, {"Arryn": 0}, {"Stark":0}, {"Tyrell": 0}, {"Martell":0}, {"Rayder": 0}, {"Tully": 0}]
	}, {
		"Stark": [{"None": 0}, {"Lannister": 0}, {"Targaryen": 0}, {"Greyjoy": 0}, {"Baratheon": 0}, {"Night's Watch": 0}, {"Arryn": 0}, {"Stark":0}, {"Tyrell": 0}, {"Martell":0}, {"Rayder": 0}, {"Tully": 0}]
	}, {
		"Tyrell": [{"None": 0}, {"Lannister": 0}, {"Targaryen": 0}, {"Greyjoy": 0}, {"Baratheon": 0}, {"Night's Watch": 0}, {"Arryn": 0}, {"Stark":0}, {"Tyrell": 0}, {"Martell":0}, {"Rayder": 0}, {"Tully": 0}]
	}, {
		"Martell": [{"None": 0}, {"Lannister": 0}, {"Targaryen": 0}, {"Greyjoy": 0}, {"Baratheon": 0}, {"Night's Watch": 0}, {"Arryn": 0}, {"Stark":0}, {"Tyrell": 0}, {"Martell":0}, {"Rayder": 0}, {"Tully": 0}]
	}, {
		"Rayder": [{"None": 0}, {"Lannister": 0}, {"Targaryen": 0}, {"Greyjoy": 0}, {"Baratheon": 0}, {"Night's Watch": 0}, {"Arryn": 0}, {"Stark":0}, {"Tyrell": 0}, {"Martell":0}, {"Rayder": 0}, {"Tully": 0}]
	}, {
		"Tully": [{"None": 0}, {"Lannister": 0}, {"Targaryen": 0}, {"Greyjoy": 0}, {"Baratheon": 0}, {"Night's Watch": 0}, {"Arryn": 0}, {"Stark":0}, {"Tyrell": 0}, {"Martell":0}, {"Rayder": 0}, {"Tully": 0}]
	}];
	vis.friends = [{
		"None": [{"None": 0}, {"Lannister": 0}, {"Targaryen": 0}, {"Greyjoy": 0}, {"Baratheon": 0}, {"Night's Watch": 0}, {"Arryn": 0}, {"Stark":0}, {"Tyrell": 0}, {"Martell":0}, {"Rayder": 0}, {"Tully": 0}]
	}, {
		"Lannister": [{"None": 0}, {"Lannister": 0}, {"Targaryen": 0}, {"Greyjoy": 0}, {"Baratheon": 0}, {"Night's Watch": 0}, {"Arryn": 0}, {"Stark":0}, {"Tyrell": 0}, {"Martell":0}, {"Rayder": 0}, {"Tully": 0}]
	}, {
		"Targaryen": [{"None": 0}, {"Lannister": 0}, {"Targaryen": 0}, {"Greyjoy": 0}, {"Baratheon": 0}, {"Night's Watch": 0}, {"Arryn": 0}, {"Stark":0}, {"Tyrell": 0}, {"Martell":0}, {"Rayder": 0}, {"Tully": 0}]
	}, {
		"Greyjoy": [{"None": 0}, {"Lannister": 0}, {"Targaryen": 0}, {"Greyjoy": 0}, {"Baratheon": 0}, {"Night's Watch": 0}, {"Arryn": 0}, {"Stark":0}, {"Tyrell": 0}, {"Martell":0}, {"Rayder": 0}, {"Tully": 0}]
	}, {
		"Baratheon": [{"None": 0}, {"Lannister": 0}, {"Targaryen": 0}, {"Greyjoy": 0}, {"Baratheon": 0}, {"Night's Watch": 0}, {"Arryn": 0}, {"Stark":0}, {"Tyrell": 0}, {"Martell":0}, {"Rayder": 0}, {"Tully": 0}]
	}, {
		"Night's Watch": [{"None": 0}, {"Lannister": 0}, {"Targaryen": 0}, {"Greyjoy": 0}, {"Baratheon": 0}, {"Night's Watch": 0}, {"Arryn": 0}, {"Stark":0}, {"Tyrell": 0}, {"Martell":0}, {"Rayder": 0}, {"Tully": 0}]
	}, {
		"Arryn": [{"None": 0}, {"Lannister": 0}, {"Targaryen": 0}, {"Greyjoy": 0}, {"Baratheon": 0}, {"Night's Watch": 0}, {"Arryn": 0}, {"Stark":0}, {"Tyrell": 0}, {"Martell":0}, {"Rayder": 0}, {"Tully": 0}]
	}, {
		"Stark": [{"None": 0}, {"Lannister": 0}, {"Targaryen": 0}, {"Greyjoy": 0}, {"Baratheon": 0}, {"Night's Watch": 0}, {"Arryn": 0}, {"Stark":0}, {"Tyrell": 0}, {"Martell":0}, {"Rayder": 0}, {"Tully": 0}]
	}, {
		"Tyrell": [{"None": 0}, {"Lannister": 0}, {"Targaryen": 0}, {"Greyjoy": 0}, {"Baratheon": 0}, {"Night's Watch": 0}, {"Arryn": 0}, {"Stark":0}, {"Tyrell": 0}, {"Martell":0}, {"Rayder": 0}, {"Tully": 0}]
	}, {
		"Martell": [{"None": 0}, {"Lannister": 0}, {"Targaryen": 0}, {"Greyjoy": 0}, {"Baratheon": 0}, {"Night's Watch": 0}, {"Arryn": 0}, {"Stark":0}, {"Tyrell": 0}, {"Martell":0}, {"Rayder": 0}, {"Tully": 0}]
	}, {
		"Rayder": [{"None": 0}, {"Lannister": 0}, {"Targaryen": 0}, {"Greyjoy": 0}, {"Baratheon": 0}, {"Night's Watch": 0}, {"Arryn": 0}, {"Stark":0}, {"Tyrell": 0}, {"Martell":0}, {"Rayder": 0}, {"Tully": 0}]
	}, {
		"Tully": [{"None": 0}, {"Lannister": 0}, {"Targaryen": 0}, {"Greyjoy": 0}, {"Baratheon": 0}, {"Night's Watch": 0}, {"Arryn": 0}, {"Stark":0}, {"Tyrell": 0}, {"Martell":0}, {"Rader": 0}, {"Tully": 0}]
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
						vis.friends[j][main][k][other] += 1;
					}
					else {
						vis.foes[j][main][k][other] += 1;
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

ComparePanel.prototype.updateVis = function(){
	var vis = this;

	var deathScale = d3.scaleLinear()
		.domain([0, 253])
		.range([299, 0]);

	var yAxisDeath = d3.axisLeft().scale(deathScale);

	vis.svg.selectAll('.death-rect')
		.remove().exit()
		.data(vis.houses).enter()
		.append('rect')
			.attr('class', 'death-rect')
			.attr('x', function(d, index){
				return 50 + 30 * index;
			})
			.attr('y', function(d, index){
				var tempHeight = d[vis.houseNames[index]].length;
				return 750 - (300 - deathScale(tempHeight));
			})
			.attr('height', function(d, index){
				return 300 - deathScale(d[vis.houseNames[index]].length);
			})
			.attr('width', 20)
			.attr('fill', 'lightcoral');

	vis.svg.append("g").attr("class", "axis").attr("transform", "translate(50,450)").call(yAxisDeath);

	var foeScale = d3.scaleLinear()
		.domain([0, 20])
		.range([0, 10]);

	for (var i = 0; i < vis.foes.length; ++i){
		vis.svg.selectAll('.foe-circle')
		.remove().exit()
		.data(vis.foes[i][vis.houseBattleNames[i]]).enter()
		.append('circle')
			.attr('class', 'foe-circle')
			.attr('x', function(d, index){
				return 0;
			})
			.attr('y', function(d, index){
				return 0;
			})
			.attr('r', function(d, index){
				console.log(d[vis.houseBattleNames[index]]);
				return foeScale(d[vis.houseBattleNames[index]]);
			})
	}	
}