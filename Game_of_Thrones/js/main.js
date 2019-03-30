
// Variable for the visualization instance
var GameOfThronesMap;

// Start application by loading the data
loadData();
var fullScreen = true;
var menuPanel;
var houses = [];

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
	houses = createHouses(deaths);
  	// INSTANTIATE VISUALIZATION
	var map = new GameOfThronesMap("map", battles, deaths, predictions, menuPanel);
	menuPanel = new MenuPanel("menuPanelId", houses, null, map);



	d3.json("kingdomBorders.json", function(error, data) {
		map.addKingdoms(data);
	});
}

function createHouses(deaths){
	var sigils = [{"None": []}, {"Lannister": []}, {"Targaryen": []}, {"Greyjoy": []}, {"Baratheon": []}, {"Night's Watch": []}, {"Arryn": []}, {"Stark": []}, {"Tyrell": []}, {"Martell": []}, {"Wildling": []}, {"Tully": []}];

	for(var i = 0; i < deaths.length; i++){
		if(deaths[i].Allegiances == "Night's Watch"){
			deaths[i].sigil = "css/houseSigils/NightsWatch.jpg";
		}
		else {
			deaths[i].sigil = "css/houseSigils/" + deaths[i].Allegiances + ".jpg";
		}
		for(var j = 0; j < sigils.length; j++){
			var currentSigil = Object.keys(sigils[j]);
			if(deaths[i].Allegiances == currentSigil){
				var ind = deaths[i].Allegiances;
				sigils[j][ind].push(deaths[i]);
			}
		}
		// sigils[deaths[i].Allegiances].push(deaths[i]);
	}
	console.log(sigils);
	return sigils;
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
