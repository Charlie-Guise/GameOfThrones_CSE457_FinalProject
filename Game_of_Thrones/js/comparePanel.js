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
				d3.select("#housePanelId").style("display", "none");
				d3.select("#menuPanelId").style("display", "inline");
				vis.menuPanel.battleLayerGroup.clearLayers();
				vis.menuPanel.map.map.removeLayer(vis.trail);
				vis.menuPanel.map.map.removeLayer(vis.movingPath);
			});
	backButton.append("text").text("Back")
			.attr("x", 65)
			.attr("y", 50)
			.attr("fill", "white");

	vis.wrangleData();
}

HousePanel.prototype.wrangleData = function(){
	var vis = this;
	
	vis.updateVis();
}

ComparePanel.prototype.updateVis = function(){

}
