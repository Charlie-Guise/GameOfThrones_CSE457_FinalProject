/**
 * Constructor for the Game of Thrones Map

 */
function MenuPanel(parentElement, houses, currentHouse){
	var vis = this;
	vis.parentElement = parentElement;
	vis.houses = houses;
	vis.currentHouse = currentHouse;
	vis.init();
};

/*
 *  Initialize Game of Thrones map
 */

MenuPanel.prototype.init = function() {
	var vis = this;
	vis.svgHeight = 850;
	vis.svg = d3.select("#menuPanelId").append("svg")
					.attr("id", "svg-menu")
					.attr("height", vis.svgHeight)
					.attr("width", "100%");


	vis.update()
};


/*
 *  Data wrangling
 */

MenuPanel.prototype.wrangleData = function() {
	var vis = this;

	// Currently no data wrangling/filtering needed
	// vis.displayData = vis.data;

	// Update the visualization
	vis.updateVis();

};


/*
 *  The drawing function
 */

MenuPanel.prototype.update = function() {
	var vis = this;
	// console.log(vis);
	// vis.svg.selectAll("div").remove().exit().data(vis.houses[1].Names).enter()
	// 		.append("div")
	// 			.attr("class", function(d, index){
	// 				console.log(index);
	// 				var row = index % 3;
	// 				return "row-" + row;
	// 			});

	// vis.svg.selectAll("text").append('text').text("TESTESTETSETSETSES");
	// vis.svg.selectAll("text").remove().exit().data(vis.houses).enter()
	// 	.append("text")
	// 	.text("dshflaksfajskf")
	// 	.attr("x", 50)
	// 	.attr("y", 50);
};
