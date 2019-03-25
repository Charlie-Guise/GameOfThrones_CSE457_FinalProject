
// Variable for the visualization instance
var GameOfThronesMap;

// Start application by loading the data
loadData();


function loadData() {
	// Load the 3 CSV files into the app
	d3.queue()
		.defer(d3.csv, "data/battles.csv")
		.defer(d3.csv, "data/character-deaths.csv")
		.defer(d3.csv, "data/character-predictions.csv")
		.await(createVis)

}


function createVis(error, battles, deaths, predictions) {
	if(error) {
		console.log(error);
	}
  	// TO-DO: INSTANTIATE VISUALIZATION
	var map = new GameOfThronesMap("map", battles, deaths, predictions);
	// var map = new GameOfThronesMap();
	d3.json("kingdomBorders.json", function(error, data) {
		map.addKingdoms(data);
	});
}
