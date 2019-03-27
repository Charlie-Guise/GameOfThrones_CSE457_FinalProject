/*
 * Root file that handles instances of all the map and loads the visualization
 */
(function(){
    var instance = null;

    /**
     * Creates instances for the map
     */
    function init() {


        //load the data corresponding to all Game of Thrones
        //pass this data and instances of all the charts that update on year selection to yearChart's constructor
		// queue()
		// 	.defer()
		// 	.defer()
		// 	.defer()
		// 	.await(function(data1, data2, data3){
		// 		//Creating instances for each visualization
		var parent = document.getElementById('map-placeholder')
		var GoTMap = new GameOfThronesMap("station-map"); // Passed the csv files that we load in
		// 	});
    }

    /**
     *
     * @constructor
     */
    function Main(){
        if(instance  !== null){
            throw new Error("Cannot instantiate more than one Class");
        }
    }

    /**
     *
     * @returns {Main singleton class |*}
     */
    Main.getInstance = function(){
        var self = this
        if(self.instance == null){
            self.instance = new Main();
            //called only once when the class is initialized
            init();
        }
        return instance;
    }

    Main.getInstance();
})();
