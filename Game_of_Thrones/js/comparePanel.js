function ComparePanel(battles, houses, people, battlesRawData, menuPanel){
    var self = this;
    self.battles = battles;
    self.battlesRawData = self.battlesRawData;
    self.houses = houses;
    self.people = people;
    self.menuPanel = menuPanel;
    self.init();
}

ComparePanel.prototype.init = function(){
    var self = this;
	self.svgHeight = 850;
	self.svg = d3.select("#houseComparePanelId").append("svg")
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
		.data(['Is your house winning?']).enter()
		.append('text')
			.text(function(d){
				return d;
			})
			.attr('x', 200)
			.attr('y', 50)
			.attr('class', 'compare-title');


	self.wrangleData();
}

ComparePanel.prototype.wrangleData = function(){

}

ComparePanel.prototype.updateVis = function(){

}