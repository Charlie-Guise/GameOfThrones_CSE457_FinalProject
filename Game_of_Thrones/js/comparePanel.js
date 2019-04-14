function ComparePanel(battles, houses, people, battlesRawData, menuPanel){
	console.log(houses);
    var self = this;
    self.battles = battles;
    self.battlesRawData = self.battlesRawData;
    self.houses = houses;
    self.people = people;
	self.menuPanel = menuPanel;
	self.sigils = ["None", "Lannister", "Targaryen", "Greyjoy", "Baratheon", "NightsWatch", "Arryn", "Stark", "Tyrell", "Martell", "Wildling", "Tully"];
	self.houseNames = ["None", "Lannister", "Targaryen", "Greyjoy", "Baratheon", "Night's Watch", "Arryn", "Stark", "Tyrell", "Martell", "Wildling", "Tully"];
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

	self.updateVis();
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
				if((index % 2)== 0){
					return (index * 160) / 2;
				}
				else {
					return ((index - 1) * 160) / 2
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
			if((index % 2)== 0){
				return 45 + (index * 160) / 2;
			}
			else {
				return ((index - 1) * 160) / 2 + 45
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
		
	// Battle Chart
	var battleScale = d3.scaleLinear()
		.domain([0, 30])
		.range([449, 0]);
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
			.attr('width', 50)
			.attr('height', function(d, index){
				var loc = 0;
				for (var i = 0; i < self.houseNames.length; ++i){
					if (self.houseNames[i] == d){
						loc = i;
					}
				}
				var value = self.battles[loc][d].length;
				return 450 - battleScale(value);
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
				return 800 - (450 - battleScale(value));
			})
			.attr('fill', function(d){
				return self.colorScheme[d];
			});
	battleChart.append("g").attr('class', 'axis').attr('transform', 'translate(50, 350)').call(yAxisBattle);

	
	// Death Chart
	var deathScale = d3.scaleLinear()
		.domain([0, 30])
		.range([449, 0]);
	var yAxisDeath = d3.axisLeft().scale(deathScale);
	var deathChart = d3.select('#death-chart');
	deathChart.append('text')
		.text('Who lost the fewest soldiers?')
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
				var value = self.battles[loc][d].length;
				return 450 - deathScale(value);
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
				return 800 - (450 - deathScale(value));
			})
			.attr('fill', function(d){
				return self.colorScheme[d];
			});
	deathChart.append("g").attr('class', 'axis').attr('transform', 'translate(50, 350)').call(yAxisDeath);

	// Survival Chart
	var survivalScale = d3.scaleLinear()
		.domain([0, 100])
		.range([449, 0]);
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
				return survivalScale(value);
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
				return 800 - (450 - survivalScale(value));
			})
			.attr('fill', function(d){
				return self.colorScheme[d];
			});
	survivalChart.append("g").attr('class', 'axis').attr('transform', 'translate(50, 350)').call(yAxisSurvival);

}