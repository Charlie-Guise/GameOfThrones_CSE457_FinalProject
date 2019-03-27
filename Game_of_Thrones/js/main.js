
// Variable for the visualization instance
var GameOfThronesMap;

// Start application by loading the data
loadData();
var fullScreen = true;

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
	var houses = createHouses(deaths);
	console.log(houses);
  	// TO-DO: INSTANTIATE VISUALIZATION
	var map = new GameOfThronesMap("map", battles, deaths, predictions);
	var menuPanel = new MenuPanel("menuPanelId", houses, null);



	d3.json("kingdomBorders.json", function(error, data) {
		map.addKingdoms(data);
	});
}

function createHouses(deaths){

	var houses = new Map();
	var houseNames = [];
	for(var i = 0; i < deaths.length; i++){
		if(houses.has(deaths[i].Allegiances)) {
			// if the name already exists
			// Add the filepath for their sigil
			if(deaths[i].Allegiances == "Night's Watch"){
				deaths[i].sigil = "../css/houseSigils/NightsWatch.jpg";
			}
			else {
				deaths[i].sigil = "../css/houseSigils/" + deaths[i].Allegiances + ".jpg";
			}
			var current = houses.get(deaths[i].Allegiances);
			current.push(deaths[i]);
			houses.set(deaths[i].Allegiances, current);
		}
		else {
			if(deaths[i].Allegiances == "Night's Watch"){
				deaths[i].sigil = "../css/houseSigils/NightsWatch.jpg";
			}
			else {
				deaths[i].sigil = "../css/houseSigils/" + deaths[i].Allegiances + ".jpg";
			}
			var current = [deaths[i]];
			houses.set(deaths[i].Allegiances, current);
		}
	}
	return houses;
}


function toggleMenu(){
	if(fullScreen){
		var panel = document.getElementById('panel').style.display = 'inline-block';
		var map = document.getElementById('mapCol');
		map.className = "col-md-6";
		fullScreen = false;
	}
	else {
		var panel = document.getElementById('panel').style.display = 'none';
		var map = document.getElementById('mapCol');
		map.className = "col-md-12";
		fullScreen = true;
	}
}

function toggleMenuFromMap(kingdom){
	if(fullScreen || (kingdom != "")){
		var panel = document.getElementById('panel').style.display = 'inline-block';
		var map = document.getElementById('mapCol');
		map.className = "col-md-6";
		fullScreen = false;
	}
	else {
		var panel = document.getElementById('panel').style.display = 'none';
		var map = document.getElementById('mapCol');
		map.className = "col-md-12";
		fullScreen = true;
	}
}
