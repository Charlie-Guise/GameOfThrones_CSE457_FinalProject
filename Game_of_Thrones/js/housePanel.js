/*
 *  This file will create all the visualizations related to a single
 *	house. It will overlay the menuPanel
 */
function HousePanel(house, houseName, menuPanel){
	var vis = this;
	vis.house = house;
	vis.houseName = houseName;
	vis.menuPanel = menuPanel;
	vis.init();
}


HousePanel.prototype.init = function(){
	var vis = this;
	vis.svgHeight = 850;
	vis.svg = d3.select("#housePanelId").append("svg")
					.attr("id", "svg-menu")
					.attr("height", vis.svgHeight)
					.attr("width", "100%");

	vis.wrangleData();
}

HousePanel.prototype.wrangleData = function(){
	var vis = this;
	vis.deathsByYear = [];

	vis.deathCount = [0, 0, 0, 0];
	for(var i = 0; i < vis.house[vis.houseName].length; i++){
		var death = vis.house[vis.houseName][i]['Death Year'];
		if (death == 297){
			vis.deathCount[0] += 1;
		}
		else if (death == 298){
			vis.deathCount[1] += 1;
		}
		else if (death == 299){
			vis.deathCount[2] += 1;
		}
		else if (death == 300){
			vis.deathCount[3] += 1;
		}
	}
	vis.updateVis();
}

HousePanel.prototype.updateVis = function(){
	var vis = this;

	var deathScale = d3.scaleLinear()
						.domain([0, d3.max(vis.deathCount)])
						.range([499, 0]);
	var xScale = d3.scaleLinear()
						.domain([297, 300])
						.range([0, 400]);

	// Create Line chart
	var xAxis = d3.axisBottom().scale(xScale).ticks(4);
	var yAxis = d3.axisLeft().scale(deathScale);

	//Create the visualizations (Bar Chart of Deaths)
	vis.svg.selectAll("rect").data(vis.deathCount).enter()
		.append("rect")
		.attr("x", function(d, i){
			return 250 + xScale(i + 297);
		})
		.attr("y", function(d, i){
			return 800 - (500 - deathScale(d));
		})
		.attr("width", 50)
		.attr("height", function(d){
			return 500 - deathScale(d);
		})
		.attr("fill", function(d){
			return "red";
		});
	vis.svg.append("g").attr("class", "axis").attr("transform", "translate(250,800)").call(xAxis);
	vis.svg.append("g").attr("class", "axis").attr("transform", "translate(250,300)").call(yAxis);

	// Button to go back
	var backButton = vis.svg.append("g").attr("id", "backButton");
	backButton.append("rect")
			.attr("x", 30)
			.attr("y", 30)
			.attr("width", 50)
			.attr("height", 30)
			.attr("fill","#0f1113")
			.on("click", function(){
				d3.select("#housePanelId").style("display", "none");
				d3.select("#menuPanelId").style("display", "inline");
				vis.menuPanel.layerGroup.clearLayers();

			});
	backButton.append("text").text("Back")
			.attr("x", 65)
			.attr("y", 50)
			.attr("fill", "white");



}
