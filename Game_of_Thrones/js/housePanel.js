/*
 *  This file will create all the visualizations related to a single
 *	house. It will overlay the menuPanel
 */
function HousePanel(house, houseName, menuPanel, layer){
	var vis = this;
	vis.house = house;
	vis.houseName = houseName;
	vis.menuPanel = menuPanel;
	vis.layer = layer;
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
	vis.init();
}


HousePanel.prototype.init = function(){
	var vis = this;
	vis.svgHeight = 850;
	vis.svg = d3.select("#housePanelId").append("svg")
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
				d3.select("#housePanelId").style("display", "none");
				d3.select("#menuPanelId").style("display", "inline");
				vis.menuPanel.battleLayerGroup.clearLayers();
				vis.menuPanel.map.layers.kingdom.resetStyle(vis.layer);
			});
	backButton.append("text").text("Back")
			.attr("x", 65)
			.attr("y", 50)
			.attr("fill", "white");

	vis.wrangleData();
}

HousePanel.prototype.wrangleData = function(){
	var vis = this;
	vis.deathsByYear = [];

	vis.deathCount = [0, 0, 0, 0, 0];
	for(var i = 0; i < vis.house[vis.houseName].length; i++){
		var death = vis.house[vis.houseName][i]['Death Year'];
		if (death == 297){
			vis.deathCount[1] += 1;
		}
		else if (death == 298){
			vis.deathCount[2] += 1;
		}
		else if (death == 299){
			vis.deathCount[3] += 1;
		}
		else if (death == 300){
			vis.deathCount[4] += 1;
		}
	}

	//give all the houses their summaries
	vis.houseSummary = {
		"Lannister": "House Lannister is seated at Casterly Rock in the Westerlands, where it ruled the West until the Targaryens invaded and conquered the Seven Kingdoms. The Lannisters were made Wardens of the West afterward. The Lannisters are the richest family in Westeros because of the gold mines located on their lands. Tywin Lannister, head of the house, served as Hand of the King under King Aerys II Targaryen, until Robert Baratheon deposed the Targaryens. House Lannister’s coat of arms is a gold lion on a red background, and its motto is “Hear Me Roar!",
		"Stark": "Seated in Winterfell, House Stark is the principle house of the northern lands of Westeros. House Stark ruled as Kings in the North for thousands of years before the Targaryens came to power and conquered the Seven Kingdoms. The Starks were then made Lords of Winterfell and Wardens of the North. Its motto is “Winter Is Coming,” and its coat of arms is a gray direwolf on a white background. House Stark is known for its honorable devotion to duty.",
		"Baratheon": "House Baratheon is the principle house of the Stormlands and is the youngest of the noble houses. King Robert is head of the house, though he lives in King’s Landing. The official seat of the house is in Storm’s End, and the youngest of the Baratheon brothers, Renly, is Lord of Storm’s End. The middle Baratheon brother, Stannis, is Lord of Dragonstone, which is a secondary seat for the house. House Baratheon’s coat of arms is a black stag on a bright yellow background, and its motto is “Ours Is the Fury.",
		"Targaryen": "Originally from Valyria on the continent of Essos, House Targaryen conquered the Seven Kingdoms of Westeros and ruled for 300 years through the use of dragons. Its coat of arms is a red three-headed dragon on black, and its motto is “Fire and Blood.” The rule of the Targaryens ended when Robert Baratheon and Ned Stark led a rebellion to depose King Aerys, during which the king was slain by Jaime Lannister. Afterward, Robert took the Iron Throne, and Aerys’s surviving two children (Daenerys and Viserys) were exiled to Essos.",
		"Greyjoy": "Seated in Pyke in the Iron Islands, House Greyjoy became Lords Paramount of the Iron Islands after the Targaryens conquered Westeros. Ten years before Game of Thrones begins, Lord Balon Greyjoy led a failed rebellion against King Robert, after which Lord Balon had to give his youngest son, Theon, to the Starks as a hostage to live in Winterfell in order to retain control of the Iron Islands. House Greyjoy’s coat of arms is a golden kraken on black, and its motto is “We Do Not Sow.",
		"Arryn": "House Arryn is the principle house in the Vale and is seated in a small castle called the Eyrie, which is located at the top of a mountain. Jon Arryn, the head of the house, served King Robert as Hand of the King; Jon was poisoned shortly before Game of Thrones begins, which prompts Robert to ask Ned Stark to become Hand of the King. Now, Jon’s only son Robert is Lord of the Eyrie, with his mother Lysa acting as regent. House Arryn’s coat of arms is white moon and falcon on blue, and its motto is “As High as Honor.",
		"Martell": "Seated at Sunspear Castle in Dorne, House Martell resisted conquest by the Targaryens and was allowed to remain sovereign; in fact, Dorne was the only kingdom that maintained its independence during the Targaryen conquest. House Martell supported the Targaryens during Robert Baratheon’s rebellion, but ended up swearing fealty to Robert after he took the Iron Throne. House Martell isolated itself from the other houses because of their anger and resentment of the Lannisters.",
		"Tully":"House Tully is seated at Riverrun in the Riverlands. Catelyn Stark and Lysa Arryn are the daughters of Hoster Tully, the Lord of Riverrun. House Tully’s coat of arms is a silver trout on blue and red stripes, and its motto is “Family, Duty, Honor.”",
		"Tyrell": "House Tyrell is the principle house in the Reach and is seated in Highgarden. The Targaryens made the Tyrells Lords of Highgarden after the king of the Reach was killed. The women of House Tyrell are known to be clever leaders, which is apparent in Margaery Tyrell’s rise to become Renly Baratheon’s wife, then betrothed to Joffrey after Renly’s death. House Tyrell’s coat of arms is a golden rose on a green background, and its motto is “Growing Strong.”",
		"None": "These are groups of people who have chosen not to associate with a particular family. They often rome Westeros without the protection that a house can give, making them vulnerable to the battles that lie ahead.",
		"Wildling": "The Free Folk is the self-given name for the people who live in the lands beyond the Wall, still on the continent of Westeros but beyond the northern border of the Seven Kingdoms. The name they employ makes reference to their society, which recognizes no inherent or hereditary political authority, except for leaders whom they choose to follow.",
		"Night's Watch": "The Night's Watch is a military order dedicated to holding the Wall, the immense fortification on the northern border of the Seven Kingdoms, defending the realms of men from what lies beyond the Wall. The order was led by Lord Commander Jon Snow from the stronghold of Castle Black. "
	}



	vis.updateVis();
}

HousePanel.prototype.updateVis = function(){
	var sigils = ["None", "Lannister", "Targaryen", "Greyjoy", "Baratheon", "Night's Watch", "Arryn", "Stark", "Tyrell", "Martell", "Wildling", "Tully"];
	var numPics = 0;
	var vis = this;
	var menuWidth = 823;
	var familyImages = [];
	var prevPath = "";
	for(var i = 0; i < vis.menuPanel.houseMain.length; i++){
		if(vis.menuPanel.houseMain[i][vis.houseName]){
			familyImages = vis.menuPanel.houseMain[i];
		}
	}

	vis.svg.selectAll('.house-name').exit().remove()
		.data([0])
		.enter()
		.append('text')
			.text(vis.houseName)
			.attr('x', 415)
			.attr('y', 60)
			.attr("text-anchor", "middle")
			.attr('class', 'house-name');


	vis.svg.selectAll('character-name').exit().remove()
		.data(familyImages[vis.houseName])
		.enter()
		.append('text')
			.text(function(d){
				console.log(d);
				return d;
			})
			.attr('x', function(d, index){
				if(familyImages[vis.houseName].length == 1){
					return 415;
				}
				else if(familyImages[vis.houseName].length <= 3){
					return (100 + index * (menuWidth/familyImages[vis.houseName].length)) + 40;
				}
				return (80 + index * (menuWidth/familyImages[vis.houseName].length)) + 20;
			})
			.attr('y', 155)
			.attr("text-anchor", "middle")
			.attr('class', 'character-name')
			.style("font-size", function(){
				if ((familyImages[vis.houseName].length == 5) && (vis.houseName == "Lannister")) {
					return 12;
				}
				return 15;
			});
	//Add the images of the different family members
	vis.movingPath = {};
	vis.svg.selectAll('image').exit().remove().data(familyImages[vis.houseName]).enter()
		.append('image')
		.attr("xlink:href",function(d, index){
			var image_str = d.replace(" ", "_");
			return "./css/headshots/" + image_str + ".jpg";
		})
		.attr("x", function(d, i){
			if(familyImages[vis.houseName].length == 1){
				return 315;
			}
			else if(familyImages[vis.houseName].length <= 3){
				return (i * (menuWidth/familyImages[vis.houseName].length)) + 40;
			}
			return (i * (menuWidth/familyImages[vis.houseName].length)) + 20;

		})
		.attr("y", 175)
		.attr("width", function(d){
			if(familyImages[vis.houseName].length <= 3){
				return 200;
			}
			return 150;
		})
		.attr("height", function(d){
			if(familyImages[vis.houseName].length <= 3){
				return 200;
			}
			return 150;
		})
		.attr("fill", "white")
		.style("cursor", "pointer")
		.on("click", function(name) {
			console.log(vis);
			var prediction = {};
			// Grab the Character's predictions
			for(var i = 0; i < vis.menuPanel.map.predictions.length; i++) {
				if(vis.menuPanel.map.predictions[i].name == name) {
					prediction = vis.menuPanel.map.predictions[i];
					break;
			    }
			}
			var character = new Character(name, vis.houseName, prediction, vis.menuPanel);

			d3.select("#housePanelId").style("display", "none");
			d3.select("#characterPanelId").style("display", "inline");
		})
		.on("mouseover", function() {
			d3.select(this).transition()
				.ease(d3.easeElastic)
				.duration("500")
				.attr("width", function(d){
					if(familyImages[vis.houseName].length <= 3){
						return 225;
					}
					return 175;
				})
				.attr("height", function(d) {
					if(familyImages[vis.houseName].length <= 3){
						return 225;
					}
					return 175;
				});

		})
		.on("mouseout", function() {
			d3.select(this).transition()
				.ease(d3.easeElastic)
				.duration("500")
				.attr("width", function(d){
					if(familyImages[vis.houseName].length <= 3){
						return 200;
					}
					return 150;
				})
				.attr("height", function(d) {
					if(familyImages[vis.houseName].length <= 3){
						return 200;
					}
					return 150;
				});
		})

	var deathScale = d3.scaleLinear()
						.domain([0, d3.max(vis.deathCount)])
						.range([399, 0]);
	var xScale = d3.scaleLinear()
						.domain([297, 300])
						.range([0, 300]);

	// Create Line chart
	var xAxis = d3.axisBottom().scale(xScale).ticks(4);
	var yAxis = d3.axisLeft().scale(deathScale);

	//Create the visualizations (Bar Chart of Deaths)
	vis.svg.selectAll("rect").data(vis.deathCount).enter()
		.append("rect")
		.attr("x", function(d, i){
			return -50 + xScale(i + 297);
		})
		.attr("y", function(d, i){
			return 800 - (400 - deathScale(d));
		})
		.attr("width", 50)
		.attr("height", function(d){
			return 400 - deathScale(d);
		})
		.attr("fill", function(d){
			return vis.colorScheme[vis.houseName];
		});
	vis.svg.append("g").attr("class", "axis").attr("transform", "translate(75,800)").call(xAxis);
	vis.svg.append("g").attr("class", "axis").attr("transform", "translate(50,400)").call(yAxis);


	var summary = vis.svg.append("g").attr("id", "house-summary");
	var wrap = d3.textwrap()
					.bounds({height: 400, width: 350})
					.method('tspans');

	var sumText = summary.append("text").attr("id", "summary-text").text(vis.houseSummary[vis.houseName])
	.attr("x", 45)
	.attr("y", 42)
	.style("font-size", 22)
	.style("font-family", "sans-serif");

	sumText.call(wrap);

}
