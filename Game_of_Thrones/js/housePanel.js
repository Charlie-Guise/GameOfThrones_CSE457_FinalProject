/*
 *  This file will create all the visualizations related to a single
 *	house. It will overlay the menuPanel
 */
function HousePanel(house, houseName, menuPanel){
	var vis = this;
	vis.house = house;
	vis.houseName = houseName;
	vis.menuPanel = menuPanel;
	console.log(vis);
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
			.attr('x', 300)
			.attr('y', 60)
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
				return 45 + 155 * index;
			})
			.attr('y', 155)	
			.attr('class', 'character-name');
	//Add the images of the different family members
	vis.movingPath = {};
	vis.svg.selectAll('image').exit().remove().data(familyImages[vis.houseName]).enter()
		.append('image')
		.attr("xlink:href",function(d, index){
			var image_str = d.replace(" ", "_");
			return "./css/headshots/" + image_str + ".jpg";
		})
		.attr("x", function(d, i){
			if(familyImages[vis.houseName].length <= 3){
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
		});

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
			return "red";
		});
	vis.svg.append("g").attr("class", "axis").attr("transform", "translate(75,800)").call(xAxis);
	vis.svg.append("g").attr("class", "axis").attr("transform", "translate(50,400)").call(yAxis);
}
