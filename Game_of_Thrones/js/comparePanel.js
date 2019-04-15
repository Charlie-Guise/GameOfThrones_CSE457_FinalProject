function ComparePanel(battles, houses, people, battlesRawData, menuPanel){
	console.log(houses);
    var self = this;
    self.battles = battles;
    self.battlesRawData = battlesRawData;
    self.houses = houses;
    self.people = people;
	self.menuPanel = menuPanel;
	self.sigils = ["None", "Lannister", "Targaryen", "Greyjoy", "Baratheon", "NightsWatch", "Arryn", "Stark", "Tyrell", "Martell", "Wildling", "Tully"];
	self.houseNames = ["None", "Lannister", "Targaryen", "Greyjoy", "Baratheon", "Night's Watch", "Arryn", "Stark", "Tyrell", "Martell", "Wildling", "Tully"];
	self.battleNames = ["None", "Lannister", "Targaryen", "Greyjoy", "Baratheon", "Night's Watch", "Arryn", "Stark", "Tyrell", "Martell", "Rayder", "Tully"];
	self.colorScheme = {
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
	self.battlesWon = [
		{ "None": [{ "count": 0, "battles":[] }] },
		{ "Lannister": [{ "count": 0, "battles":[] }] },
		{ "Targaryen": [{ "count": 0, "battles":[] }] },
		{ "Greyjoy": [{ "count": 0, "battles":[] }] },
		{ "Baratheon": [{ "count": 0, "battles":[] }] },
		{ "Night's Watch": [{ "count": 0, "battles":[] }] },
		{ "Arryn": [{ "count": 0, "battles":[] }] },
		{ "Stark": [{ "count": 0, "battles":[] }] },
		{ "Tyrell": [{ "count": 0, "battles":[] }] },
		{ "Martell": [{ "count": 0, "battles":[] }] },
		{ "Wildling": [{ "count": 0, "battles":[] }] },
		{ "Tully": [{ "count": 0, "battles":[] }] },


	]
	self.compareHouse = [];
	self.deathChart = false;
	self.survivalChart = false;
	self.battleChart = true;
	self.init();
}

ComparePanel.prototype.init = function(){
    var self = this;
	self.svgHeight = 850;
	self.svg = d3.select("#comparePanelId").append("svg")
					.attr("id", "svg-menu-houses")
					.attr("height", self.svgHeight)
					.attr("width", "100%");
					// Button to go back
	var backButton = self.svg.append("g").attr("id", "backButton");
	backButton.append("rect")
			.attr("x", 30)
			.attr("y", 30)
			.attr("width", 100)
			.attr("height", 30)
			.attr("fill","#0f1113")
			.on("click", function(){
				d3.select("#svg-menu-houses").remove();
				d3.select("#comparePanelId").style("display", "none");
				d3.select("#menuPanelId").style("display", "inline");
			});
	backButton.append("text").text("Back")
			.attr("x", 65)
			.attr("y", 50)
			.attr("fill", "white");

	self.svg.selectAll('.compare-title')
		.remove().exit()
		.data(['Who is the better house?']).enter()
		.append('text')
			.text(function(d){
				return d;
			})
			.attr('x', 200)
			.attr('y', 50)
			.attr('class', 'compare-title');

	self.svg.append("rect")
		.attr("id", "toggleLeft")
		.attr("x", 275)
		.attr("y", 200)
		.attr("width", 75)
		.attr("height",30)
		.attr("fill", "black")
		.on("click", function(){
			if(self.battleChart){
				return;
			}
			else if (self.deathChart){
				self.battleChart = true;
				self.deathChart = false;

				self.svg.select('#death-chart')
					.transition()
					.duration(1000)
					.style('fill-opacity', 1e-6)
					.on('end', function(){
						d3.select('#death-chart').style('display', 'none');
					});
				self.svg.select('#battle-chart')
					.transition()
					.duration(1000)
					.style('fill-opacity', 1)
					.on('end', function(){
						d3.select('#battle-chart').style('display', 'contents')
					});
			}
			else {
				self.deathChart = true;
				self.survivalChart = false;

				self.svg.select('#survival-chart')
					.transition()
					.duration(1000)
					.style('fill-opacity', 1e-6)
					.on('end', function(){
						d3.select('#survival-chart').style('display', 'none');
					});
				self.svg.select('#death-chart')
					.transition()
					.duration(1000)
					.style('fill-opacity', 1)
					.on('end', function(){
						d3.select('#death-chart').style('display', 'contents')
					});
			}
		});
	self.svg.append("rect")
		.attr("id", "toggleRight")
		.attr("x", 500)
		.attr("y", 200)
		.attr("width", 75)
		.attr("height", 30)
		.attr("fill", "black")
		.on("click", function(){
			if (self.survivalChart){
				return;
			}
			else if (self.deathChart){
				self.survivalChart = true;
				self.deathChart = false;

				self.svg.select('#death-chart')
					.transition()
					.duration(1000)
					.style('fill-opacity', 1e-6)
					.on('end', function(){
						d3.select('#death-chart').style('display', 'none');
					});
				self.svg.select('#survival-chart')
					.transition()
					.duration(1000)
					.style('fill-opacity', 1)
					.on('end', function(){
						d3.select('#survival-chart').style('display', 'contents')
					});
			}
			else {
				self.deathChart = true;
				self.battleChart = false;

				self.svg.select('#battle-chart')
					.transition()
					.duration(1000)
					.style('fill-opacity', 1e-6)
					.on('end', function(){
						d3.select('#battle-chart').style('display', 'none');
					});
				self.svg.select('#death-chart')
					.transition()
					.duration(1000)
					.style('fill-opacity', 1)
					.on('end', function(){
						d3.select('#death-chart').style('display', 'contents')
					});
			}
		});
	self.svg.append("text")
		.text("prev")
		.attr("x", 290)
		.attr("y", 223)
		.attr("width", 75)
		.attr("height",30)
		.attr("fill", "white")
		.style("font-size", 15)
		.style("font-family", "Game of Thrones");
	self.svg.append("text")
		.text("next")
		.attr("x", 513)
		.attr("y", 223)
		.attr("width", 75)
		.attr("height",30)
		.attr("fill", "white")
		.style("font-size", 15)
		.style("font-family", "Game of Thrones");
	

	self.svg.append('g')
		.attr('id', 'battle-chart')
		.style('display', 'contents');
	self.svg.append('g')
		.attr('id', 'death-chart')
		.style('display', 'none');
	self.svg.append('g')
		.attr('id', 'survival-chart')
		.style('display', 'none');

	self.wrangleData();
}

ComparePanel.prototype.wrangleData = function(){
	var self = this;
	for (var i = 0; i < self.battleNames.length; ++i){
		for (var j = 0; j < self.battlesRawData.length; ++j){
			var house = self.battleNames[i];
			var battle = self.battlesRawData[j];
			var attacker = houseAttacker(house, battle);
			var defender = houseDefender(house, battle);
			var win = self.battlesRawData[j].attacker_outcome;
			if (attacker == true && win =='win'){
				self.battlesWon[i][self.houseNames[i]][0]["count"] += 1;
				self.battlesWon[i][self.houseNames[i]][0]['battles'].push(battle);
			} 
			if (defender == true && win == 'loss'){
				self.battlesWon[i][self.houseNames[i]][0]["count"] += 1;
				self.battlesWon[i][self.houseNames[i]][0]['battles'].push(battle);
			}
		}
	}
	self.updateVis();
}

function houseAttacker(name, battle) {
	if (battle.attacker_1.includes(name)) {
		return true;
	} else if (battle.attacker_2.includes(name)) {
		return true;
	} else if (battle.attacker_3.includes(name)) {
		return true;
	} else if (battle.attacker_4.includes(name)) {
		return true;
	} else if (battle.attacker_commander.includes(name)) {
		return true;
	} else if (battle.attacker_king.includes(name)) {
		return true;
	} else {
		return false;
	}
}
function houseDefender(name, battle) {
	if (battle.defender_1.includes(name)) {
		return true;
	} else if (battle.defender_2.includes(name)) {
		return true;
	} else if (battle.defender_3.includes(name)) {
		return true;
	} else if (battle.defender_4.includes(name)) {
		return true;
	} else if (battle.defender_commander.includes(name)) {
		return true;
	} else if (battle.defender_king.includes(name)) {
		return true;
	} else {
		return false;
	}
}

ComparePanel.prototype.updateVis = function(){
	var self = this;

	var sigils = ["None", "Lannister", "Targaryen", "Greyjoy", "Baratheon", "NightsWatch", "Arryn", "Stark", "Tyrell", "Martell", "Wildling", "Tully"];

	self.svg.selectAll('.sigil')
		.remove().exit()
		.data(self.sigils).enter()
		.append('image')
			.attr("xlink:href", function(d){
				return './css/houseSigils/' + d + '.jpg';
			})
			.attr('width', 45)
			.attr('height', 35)
			.attr('x', function(d, index){
				if (index == 0 || index == 2 || index == 4){
					return (index / 2) * 135;
				}
				else if (index == 1 || index == 3 || index == 5){
					return ((index - 1)/2) * 135;
				}
				else if (index == 7 || index == 9 || index == 11){
					return (((index - 3)/2) * 135) + 160;
				}
				else if (index == 6 || index == 8 || index == 10){
					return (((index - 2)/2) * 135) + 160;
				}
			})
			.attr('y', function(d, index){
				if((index % 2)== 0){
					return 100;
				}
				else {
					return 150;
				}
			})
			.attr('class', 'sigil')
			.on('click', function(d, index){
				if (!self.compareHouse.includes(self.houseNames[index])){
					self.compareHouse[self.compareHouse.length] = self.houseNames[index];
				}
				else {
					for (var i = 0; i <self.compareHouse.length; ++i){
						if (self.compareHouse[i] == self.houseNames[index]){
							self.compareHouse.splice(i, 1);
						}
					}
				}
				self.updateVis();
			});
	self.svg.selectAll('.sigil-text')
		.remove().exit()
		.data(self.houseNames).enter()
		.append('text')
		.text(function(d){
			return d;
		})
		.attr('class', 'sigil-text')
		.attr('x', function(d, index){
			if (index == 0 || index == 2 || index == 4){
				return (index / 2) * 135 + 45;
			}
			else if (index == 1 || index == 3 || index == 5){
				return ((index - 1)/2) * 135  + 45;
			}
			else if (index == 7 || index == 9 || index == 11){
				return (((index - 3)/2) * 135) + 205;
			}
			else if (index == 6 || index == 8 || index == 10){
				return (((index - 2)/2) * 135) + 205;
			}
		})
		.attr('y', function(d, index){
			if ((index % 2) == 0){
				return 125
			}
			else {
				return 175;
			}
		});
		
	// X-axis labels
	self.svg.selectAll('.x-axis-label')
		.remove().exit()
		.data(self.compareHouse).enter()
		.append('text')
			.attr('class', 'x-axis-label')
			.attr('x', function(d, index){
				return 75 + 60 * index;
			})
			.attr('y', 710)
			.text(function(d, index){
				return d;
			});

	// Battle Chart
	var battleScale = d3.scaleLinear()
		.domain([0, 30])
		.range([349, 0]);
	var yAxisBattle = d3.axisLeft().scale(battleScale);
	var battleChart = d3.select('#battle-chart');	
	battleChart.append('text')
		.text('Who has the better army?')
		.attr('x', 300)
		.attr('y', 275)
		.attr('class', 'chart-title');
	battleChart.selectAll('.battle-rect')
		.remove().exit()
		.data(self.compareHouse).enter()
		.append('rect')
			.attr('class', 'battle-rect')
			.attr('width', 25)
			.attr('height', function(d, index){
				var loc = 0;
				for (var i = 0; i < self.houseNames.length; ++i){
					if (self.houseNames[i] == d){
						loc = i;
					}
				}
				var value = self.battles[loc][d].length;
				return 350 - battleScale(value);
			})
			.attr('x', function(d, index){
				return 50 + 60 * index;
			})
			.attr('y', function(d, index){
				var loc = 0;
				for (var i = 0; i < self.houseNames.length; ++i){
					if (self.houseNames[i] == d){
						loc = i;
					}
				}
				var value = self.battles[loc][d].length;
				return 700 - (350 - battleScale(value));
			})
			.attr('fill', function(d){
				return self.colorScheme[d];
			});
	battleChart.append("g").attr('class', 'axis').attr('transform', 'translate(50, 350)').call(yAxisBattle);

	
	// Death Chart
	var deathScale = d3.scaleLinear()
		.domain([0, 253])
		.range([349, 0]);
	var yAxisDeath = d3.axisLeft().scale(deathScale);
	var deathChart = d3.select('#death-chart');
	deathChart.append('text')
		.text('Who lost the most soldiers?')
		.attr('x', 275)
		.attr('y', 275)
		.attr('class', 'chart-title');
	deathChart.selectAll('.death-rect')
		.remove().exit()
		.data(self.compareHouse).enter()
		.append('rect')
			.attr('class', 'death-rect')
			.attr('width', 50)
			.attr('height', function(d, index){
				var loc = 0;
				for (var i = 0; i < self.houseNames.length; ++i){
					if (self.houseNames[i] == d){
						loc = i;
					}
				}
				var value = self.houses[loc][d].length;
				console.log("Death: " + value);
				return 350 - deathScale(value);
			})
			.attr('x', function(d, index){
				return 50 + 60 * index;
			})
			.attr('y', function(d, index){
				var loc = 0;
				for (var i = 0; i < self.houseNames.length; ++i){
					if (self.houseNames[i] == d){
						loc = i;
					}
				}
				var value = self.houses[loc][d].length;
				return 700 - (350 - deathScale(value));
			})
			.attr('fill', function(d){
				return self.colorScheme[d];
			});
	deathChart.append("g").attr('class', 'axis').attr('transform', 'translate(50, 350)').call(yAxisDeath);

	// Survival Chart
	var survivalScale = d3.scaleLinear()
		.domain([0, 100])
		.range([349, 0]);
	var yAxisSurvival = d3.axisLeft().scale(survivalScale);
	var survivalChart = d3.select('#survival-chart');
	survivalChart.append('text')
		.text('Who is most likely to survive?')
		.attr('x', 275)
		.attr('y', 275)
		.attr('class', 'chart-title');
	survivalChart.selectAll('.survival-rect')
		.remove().exit()
		.data(self.compareHouse).enter()
		.append('rect')
			.attr('class', 'survival-rect')
			.attr('width', 50)
			.attr('height', function(d, index){
				var loc = 0;
				for (var i = 0; i < self.houseNames.length; ++i){
					if (self.houseNames[i] == d){
						loc = i;
					}
				}
				var value = self.battles[loc][d].length;
				return 350 - survivalScale(value);
			})
			.attr('x', function(d, index){
				return 50 + 60 * index;
			})
			.attr('y', function(d, index){
				var loc = 0;
				for (var i = 0; i < self.houseNames.length; ++i){
					if (self.houseNames[i] == d){
						loc = i;
					}
				}
				var value = self.battles[loc][d].length;
				return 700 - (350 - survivalScale(value));
			})
			.attr('fill', function(d){
				return self.colorScheme[d];
			});
	survivalChart.append("g").attr('class', 'axis').attr('transform', 'translate(50, 350)').call(yAxisSurvival);

}