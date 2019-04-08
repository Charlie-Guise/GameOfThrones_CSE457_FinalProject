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
		"Tully": [{"None": 0}, {"Lannister": 0}, {"Targaryen": 0}, {"Greyjoy": 0}, {"Baratheon": 0}, {"Night's Watch": 0}, {"Arryn": 0}, {"Stark":0}, {"Tyrell": 0}, {"Martell":0}, {"Rayder": 0}, {"Tully": 0}]
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
					console.log("death chart vis: " + deathChartVisible);
					console.log("foe chart vis: " + foeMatrixVisible);
					console.log("friend chart vis: " + friendMatrixVisible);
					vis.svg.select("#foe-matrix")
						.transition()
						.duration(1000)
						.attr("transform", "translate(850, 0)")
						.style("fill-opacity", 1e-6)
						.on("end", function(){
							d3.select("#foe-matrix").style("display", "none");
						});

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
					console.log("death chart vis: " + deathChartVisible);
					console.log("foe chart vis: " + foeMatrixVisible);
					console.log("friend chart vis: " + friendMatrixVisible);
					vis.svg.select("#friend-matrix")
						.transition()
						.duration(1000)
						.attr("transform", "translate(850, 0)")
						.style("fill-opacity", 1e-6)
						.on("end", function(){
							d3.select("#friend-matrix").style("display", "none");
						});

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
			console.log("Toggle Right");
			// Can't move right anymore
			if(friendMatrixVisible){
				d3.select(this).on("click", null);
			}
			else {
				if(!foeMatrixVisible) {
					// move the chart out
					foeMatrixVisible = true;
					deathChartVisible = false;
					console.log("death chart vis: " + deathChartVisible);
					console.log("foe chart vis: " + foeMatrixVisible);
					console.log("friend chart vis: " + friendMatrixVisible);
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
					console.log("death chart vis: " + deathChartVisible);
					console.log("foe chart vis: " + foeMatrixVisible);
					console.log("friend chart vis: " + friendMatrixVisible);
					vis.svg.select("#foe-matrix")
						.transition()
						.duration(1000)
						.attr("transform", "translate(-800, 0)")
						.style("fill-opacity", 1e-6)
						.on("end", function(){
							d3.select("#foe-matrix").style("display", "none");
						});

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
			.attr('fill', 'lightcoral');

	barchart.append("g").attr("class", "axis").attr("transform", "translate(50,200)").call(yAxisDeath);

	// The friend/foe matrix
	var foeMatrix = vis.svg.append("g").attr("id", "foe-matrix");
	var friendMatrix = vis.svg.append("g").attr("id", "friend-matrix");
	var circleScale = d3.scaleLinear()
		.domain([0, 19])
		.range([12, 17]);

	for (var i = 0; i < vis.foes.length; ++i){
		var tempFoe = '.foe-circle-' + i;
		foeMatrix.selectAll(tempFoe)
			.remove().exit()
			.data(vis.foes[i][vis.houseBattleNames[i]]).enter()
			.append('circle')
				.attr('class', function(){
					return 'foe-circle-'  + i;
				})
				.attr('cx', function(d, index){
					return 150 + index * 50;
				})
				.attr('cy', function(){
					return 180 + i * 40;
				})
				.attr('r', function(d, index){
					var val = d[vis.houseBattleNames[index]];
					if (val != 0){
						return circleScale(val);
					}
					else {
						return 7;
					}
				})
				.attr('fill', function(d, index){
					var val = d[vis.houseBattleNames[index]];
					if (val == 0){
						return 'black';
					}
					else {
						return 'red';
					}
				});
		var tempFriend = '.friend-circle-' + i;
		friendMatrix.selectAll(tempFriend)
			.remove().exit()
			.data(vis.friends[i][vis.houseBattleNames[i]]).enter()
			.append('circle')
				.attr('class', function(){
					return 'friend-circle-'  + i;
				})
				.attr('cx', function(d, index){
					return 150 + index * 50;
				})
				.attr('cy', function(){
					return 180 + i * 40;
				})
				.attr('r', function(d, index){
					var val = d[vis.houseBattleNames[index]];
					if (val != 0){
						return circleScale(val);
					}
					else {
						return 7;
					}
				})
				.attr('fill', function(d, index){
					var val = d[vis.houseBattleNames[index]];
					if (val == 0){
						return 'white';
					}
					else {
						return 'blue';
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
				return 180 + index * 40;
			});
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
				return 180 + index * 40;
			});
	foeMatrix.selectAll('.foe-x-label')
		.remove().exit()
		.data(vis.houseNames).enter()
		.append('text')
			.attr('class', 'foe-x-label')
			.text(function(d){
				return d;
			})
			.attr('y', 650)
			.attr('x', function(d, index){
				return 150 + index * 50;
			});
	friendMatrix.selectAll('.friend-x-label')
		.remove().exit()
		.data(vis.houseNames).enter()
		.append('text')
			.attr('class', 'friend-x-label')
			.text(function(d){
				return d;
			})
			.attr('y', 650)
			.attr('x', function(d, index){
				return 150 + index * 50;
			});
	d3.select("#foe-matrix").style("display", "none");
	d3.select("#friend-matrix").style("display", "none");

}
