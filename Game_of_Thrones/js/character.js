function Character(name, houseName, prediction, menuPanel) {
	var vis = this;
	vis.name = name;
	vis.houseName = houseName;
	vis.prediction = prediction;
	vis.menuPanel = menuPanel;
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

Character.prototype.init = function() {
	var vis = this;
	vis.svgHeight = 850;
	vis.svg = d3.select("#characterPanelId").append("svg")
		.attr("id", "svg-character")
		.attr("height", vis.svgHeight)
		.attr("width", "100%");
	var backButton = vis.svg.append("g").attr("id", "backButton");
	backButton.append("rect")
		.attr("x", 30)
		.attr("y", 30)
		.attr("width", 100)
		.attr("height", 30)
		.attr("fill", "#0f1113")
		.on("click", function() {
			d3.select("#svg-character").remove();
			d3.select("#characterPanelId").style("display", "none");
			d3.select("#housePanelId").style("display", "inline");
			vis.menuPanel.map.map.removeLayer(vis.trail);
			vis.menuPanel.map.map.removeLayer(vis.movingPath);
		});
	backButton.append("text").text("Back")
		.attr("x", 65)
		.attr("y", 50)
		.attr("fill", "white");

	vis.createVis();
}

Character.prototype.createVis = function() {
	var vis = this;
	var prevPath = "";
	var alive = (vis.prediction.isAlive == 0) ? false : true;
	var house = (vis.prediction.house == "") ? "Not Listed" : vis.prediction.house;
	var culture = (vis.prediction.culture == "") ? "Not Listed" : vis.prediction.culture;
	var width = 200,
		height = 200,
		twoPi = 2 * Math.PI,
		progress = 0,
		allocated = 2000000,
		total = 4300000,
		formatPercent = d3.format(".0%");

	// Character Headshot
	vis.svg.append("image")
		.attr("xlink:href", function(d) {
			var image_str = vis.name.replace(" ", "_");
			return "./css/headshots/" + image_str + ".jpg";
		})
		.attr("x", 30)
		.attr("y", 75)
		.attr("width", 200)
		.attr("height", 300);

	// Character Information
	vis.characterInfoGroup = vis.svg.append("g").attr("class", "characterInfo");

	vis.characterInfoGroup.append("text")
		.text("Name: " + vis.name)
		.attr("x", 250)
		.attr("y", 115)
		.attr("fill", "#e7d09f")
		.style("font-size", 32)
		.style("font-family", "Game of Thrones");

	vis.characterInfoGroup.append("text")
		.text("House: " + house)
		.attr("x", 250)
		.attr("y", 180)
		.attr("fill", "#e7d09f")
		.style("font-size", 24)
		.style("font-family", "Game of Thrones");

	vis.characterInfoGroup.append("text")
		.text("Culture: " + culture)
		.attr("x", 250)
		.attr("y", 245)
		.attr("fill", "#e7d09f")
		.style("font-size", 24)
		.style("font-family", "Game of Thrones");
	vis.characterInfoGroup.append("text")
		.text("Current Status: " + ((alive) ? "Living":"Deceased"))
		.attr("x", 250)
		.attr("y", 310)
		.attr("fill", "#e7d09f")
		.style("font-size", 24)
		.style("font-family", "Game of Thrones");
	vis.characterInfoGroup.append("text")
		.text("Follow this Character")
		.attr("x", 250)
		.attr("y", 360)
		.attr("fill", "#b90e0e")
		.style("cursor", "pointer")
		.style("font-size", 22)
		.style("text-decoration", "underline")
		.style("font-family", "Game of Thrones")
		.on("click", function() {
			var path = [];
			// var charIcon = L.icon({
			// 	iconUrl: "./css/headshots/sansa_stark_icon1.png"
			// });
			// Also set all their family markers at their starting position
			var c_path = vis.menuPanel.character_paths[vis.houseName][vis.name];
			for (var i = 0; i < c_path.length; i++) {
				var latlong = [c_path[i].lat, c_path[i].long]
				path.push(latlong);
			}
			if ((prevPath != vis.name) && (prevPath != '')) {
				//remove the old path
				vis.menuPanel.map.map.removeLayer(vis.trail);
				vis.menuPanel.map.map.removeLayer(vis.movingPath);
			}
			vis.movingPath = new L.Marker.movingMarker(path, 10000).addTo(vis.menuPanel.map.map);
			vis.trail = L.polyline(path, {
				color: vis.colorScheme[vis.houseName]
			}).addTo(vis.menuPanel.map.map);
			vis.movingPath.once('click', function() {
				vis.movingPath.start();
				vis.movingPath.closePopup();
				vis.movingPath.unbindPopup();
				vis.movingPath.on('click', function() {
					if (vis.movingPath.isRunning()) {
						vis.movingPath.pause()
					} else {
						vis.movingPath.start();
					}
				});
			});
			vis.movingPath.bindPopup("Start or Pause");
			vis.movingPath.openPopup();
			prevPath = vis.name;
		})
		.on("mouseover", function(){
			d3.select(this).style("font-size", 30);
		})
		.on("mouseout", function(){
			d3.select(this).style("font-size", 22);
		});

	// Next, we want to hav the gauge that shows their percentage likelihood of death (PLOD)
	// http://bl.ocks.org/mbostock/5100636
	var w = 150;
	var h = 150;
	var tau = 2 * Math.PI;
	var arc = d3.arc()
		.innerRadius(110)
		.outerRadius(150)
		.startAngle(0);
	var formatPercent = d3.format(".0%");
	var colorRange = ["#E50400", "#01BF00"];
	var color = d3.scaleLinear()
					.domain([0, 1])
					.range(colorRange);
	var percentage = (alive) ? (1 - parseFloat(vis.prediction.plod)) : 0;
	var gauge = vis.svg.append("g").attr("id", "gauge").attr("transform", "translate(" + 200 + "," + 675 + ")");
	var background = gauge.append("path").attr("id", "back")
		.datum({
			endAngle: tau
		})
		.style("fill", "#382e2e")
		.style("opacity", 0.25)
		.attr("d", arc);
	var foreground = gauge.append("path").attr("id", "fore")
		.datum({
			endAngle: 0
		})
		.style("fill", "orange")
		.attr("d", arc);


	var text = gauge.append("text")
		.attr("text-anchor", "middle")
		.attr("dy", ".35em")
		.style("font-size", 80)
		.style("font-family", "Game of Thrones"); //FIXME: Add the tooltip to this so hovering shows the attributes that contribute
		// .on("mouseover", tip.show)
		// .on("mouseout", tip.hide);



	// Here we include the traits that contribute to survival
	var nobility = (vis.prediction.isNoble == "1") ? "Of Noble Blood" : "Not of Noble Blood";
	var feastOfCrows = (vis.prediction.book4 == "1") ? "Featured in In A Feast For Crows" : "Not featured in In A Feast For Crows";
	var gender = (vis.prediction.male == "1") ? "Male" : "Female";
	vis.survivalHeader = vis.svg.append("g").attr("class", "survivalHeader");
	vis.survivalTraits = vis.svg.append("g").attr("class", "survivalTraits");
	vis.survivalHeader.append("text")
		.text("Characteristics Contributing to Survival")
		.attr("x", 50)
		.attr("y", 425)
		.attr("fill", "black")
		.style("font-size", 25)
		.style("font-family", "Game of Thrones");
	vis.survivalHeader.append("text")
		.text("Will they Survive?")
		.attr("x", 300)
		.attr("y", 475)
		.attr("fill", "#b90e0e")
		.style("cursor", "pointer")
		.style("font-size", 22)
		.style("text-decoration", "underline")
		.style("font-family", "Game of Thrones")
		.on("click", startTransition)
		.on("mouseover", function(){
			d3.select(this).style("font-size", 30);
		})
		.on("mouseout", function(){
			d3.select(this).style("font-size", 22);
		});
	vis.survivalTraits.append("text")
		.text(feastOfCrows)
		.attr("x", 375)
		.attr("y", 525)
		.attr("fill", "black")
		.style("font-size", 18)
		.style("font-family", "Game of Thrones");
	vis.survivalTraits.append("text")
		.text("In " + house)
		.attr("x", 425)
		.attr("y", 595)
		.attr("fill", "black")
		.style("font-size", 24)
		.style("font-family", "Game of Thrones");
	vis.survivalTraits.append("text")
		.text(vis.prediction.age + " years old")
		.attr("x", 475)
		.attr("y", 665)
		.attr("fill", "black")
		.style("font-size", 24)
		.style("font-family", "Game of Thrones");
	vis.survivalTraits.append("text")
		.text(nobility)
		.attr("x", 425)
		.attr("y", 735)
		.attr("fill", "black")
		.style("font-size", 24)
		.style("font-family", "Game of Thrones");
	vis.survivalTraits.append("text")
		.text(gender)
		.attr("x", 375)
		.attr("y", 805)
		.attr("fill", "black")
		.style("font-size", 24)
		.style("font-family", "Game of Thrones");

	function arcTween(newAngle) {

		return function(d) {

			var interpolate = d3.interpolate(d.endAngle, newAngle);

			return function(t) {

				d.endAngle = interpolate(t); // the progress
				text.text(formatPercent(d.endAngle / 6.2758))
				foreground.style("fill", color((d.endAngle / 6.2758))); //maybe make it a gradient

				return arc(d);
			};
		};
	}
	function startTransition(){
		vis.survivalTraits.selectAll("text")
			.transition()
			.delay(function(d, i){
				return i * 1000
			})
			.duration(1000)
			.attr("x", 200)
			.style("fill-opacity", 1e-6);
			// .remove();
		d3.selectAll("#fore")
		.datum({
			endAngle: 0
		})
		.style("fill", "orange")
		.attr("d", arc)
		.transition()
		.duration(5000)
		.attrTween("d", arcTween(percentage * tau));

		d3.selectAll("#gauge")
			.transition()
			.delay(5500)
			.duration(1500)
			.attr("transform", "translate(" + 400 + "," + 675 + ")");
	}

}
