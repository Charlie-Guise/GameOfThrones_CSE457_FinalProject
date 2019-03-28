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
	vis.update();

};


/*
 *  The drawing function
 */

MenuPanel.prototype.update = function() {
	var vis = this;
	// console.log(JSON.stringify(vis.houses));
	var sigilGroup = vis.svg.append("g").attr("class", "sigils");

	var sigils = ["None", "Lannister", "Targaryen", "Greyjoy", "Baratheon", "NightsWatch", "Arryn", "Stark", "Tyrell", "Martell", "Wildling", "Tully"];

	sigilGroup.selectAll('image').remove().exit().data(vis.houses).enter() // FIXME: The issue here is that .data cannot take in an map
		.append('image')
		.attr("xlink:href",function(d, index){
			return "./css/houseSigils/" + sigils[index] + ".jpg";
		})
		.attr("width", 200)
		.attr("height", 150)
		.attr("x", function(d, i){
			if((i%3) == 0){
				return 70;
			}
			if((i%3) == 1){
				return 320;
			}
			if((i%3) == 2){
				return 570;
			}
		})
		.attr("y", function(d, i){
			if((i%4) == 0){
				return 150;
			}
			if((i%4) == 1){
				return 320;
			}
			if((i%4) == 2){
				return 490;
			}
			if((i%4) == 3){
				return 660;
			}
		})
		.on('click', function(d){
			console.log("click");
			console.log(d);
		});
};
