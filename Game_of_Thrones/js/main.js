
// Variable for the visualization instance
var GameOfThronesMap;

// Start application by loading the data
loadData();
var fullScreen = true;
var menuPanel;
var houses = [];
var houseBattles = [];
function loadData() {
	// Load the 3 CSV files into the app
	d3.queue()
		.defer(d3.csv, "data/game-of-thrones/battles.csv")
		.defer(d3.csv, "data/game-of-thrones/character-deaths.csv")
		.defer(d3.csv, "data/game-of-thrones/character-predictions.csv")
		.await(createVis)
}


function createVis(error, battles, deaths, predictions) {
	if(error) {
		console.log(error);
	}
	houses = createHouses(deaths, battles);
  	// INSTANTIATE VISUALIZATION
	var map = new GameOfThronesMap("map", battles, deaths, predictions, menuPanel);
	menuPanel = new MenuPanel("menuPanelId", houses, houseBattles, null, map);


	d3.json("kingdomBorders.json", function(error, data) {
		map.addKingdoms(data);
	});
}

function createHouses(deaths, battles){
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
	}

	var houses = ["None", "Lannister", "Targaryen", "Greyjoy", "Baratheon", "Night's Watch", "Arryn", "Stark", "Tyrell", "Martell", "Mance", "Tully"];
	console.log(battles);
	houseBattles = [{"None": []}, {"Lannister": []}, {"Targaryen": []}, {"Greyjoy": []}, {"Baratheon": []}, {"Night's Watch": []}, {"Arryn": []}, {"Stark": []}, {"Tyrell": []}, {"Martell": []}, {"Wildling": []}, {"Tully": []}];

	for (var k = 0; k < houses.length; ++k){
		var house = houses[k];
		for(var j = 0; j < battles.length; ++j){
			var include = 0;
			if (battles[j].attacker_1.includes(house)){
				include = 1;
			}
			else if (battles[j].attacker_2.includes(house)){
				include = 1;
			}
			else if (battles[j].attacker_3.includes(house)){
				include = 1;
			}
			else if (battles[j].attacker_4.includes(house)){
				include = 1;
			}
			else if (battles[j].attacker_commander.includes(house)){
				include = 1;
			}
			else if (battles[j].attacker_king.includes(house)){
				include = 1;
			}
			else if (battles[j].defender_1.includes(house)){
				include = 1;
			}
			else if (battles[j].defender_2.includes(house)){
				include = 1;
			}
			else if (battles[j].defender_3.includes(house)){
				include = 1;
			}
			else if (battles[j].defender_4.includes(house)){
				include = 1;
			}
			else if (battles[j].defender_commander.includes(house)){
				include = 1;
			}
			else if (battles[j].defender_king.includes(house)){
				include = 1;
			}

			if (battles[j].defender_king == "Mance Rayder" && house == "Mance"){
				house = "Wildling";
			}

			if (include == 1){
				houseBattles[k][house].push(battles[j]);
			}

		}
	}
	console.log(houseBattles);
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
