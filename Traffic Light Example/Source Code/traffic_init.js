function initialize() {
	//Initialize variables in session storage
	store_var([], "working_map");
	
	//Render Variables
	sessionStorage.scene_width = "75";  //Goes in conjuction with the width of Scene in the CSS. I am not smart enough to link them here, sorry
	sessionStorage.x_buffer = "1"; 		//The size of the area surrounding the map in grid spaces
	sessionStorage.y_buffer = "1";
	
	//Simulation Variables
	sessionStorage.simulation_active = "0";
	sessionStorage.spawn_cooldown = "5"; //Number of cycles before spawn can occur
	sessionStorage.car_move_cooldown = "2";
	sessionStorage.short_wait = "2";
	sessionStorage.car_zindex = "5";
	sessionStorage.current_car_id = "0";
	store_var([], "car_array");
	sessionStorage.cars_passed = "0";
	sessionStorage.car_time = "0";

	//Linear Feedback Shift Register
	sessionStorage.random_seed = 12;
	sessionStorage.random_seed_start = sessionStorage.random_seed;
	
	//Map

	var map = [ [{type:"000", orientation:"-1"}, {type:"000", orientation:"-1"}, {type:"000", orientation:"-1"}, {type:"000", orientation:"-1"}, {type:"300", orientation:"2", frequency:"50"}, {type:"000", orientation:"-1"}, {type:"000", orientation:"-1"}, {type:"000", orientation:"-1"}, {type:"000", orientation:"-1"}],
			[{type:"000", orientation:"-1"}, {type:"001", orientation:"-1"}, {type:"001", orientation:"-1"}, {type:"001", orientation:"-1"}, {type:"200", orientation:"0"}, {type:"001", orientation:"-1"}, {type:"001", orientation:"-1"}, {type:"001", orientation:"-1"}, {type:"000", orientation:"-1"}],
			[{type:"300", orientation:"1", frequency:"20"}, {type:"200", orientation:"1"}, {type:"200", orientation:"1"}, {type:"200", orientation:"1"}, {type:"100", orientation:"-1"}, {type:"200", orientation:"1"}, {type:"200", orientation:"1"}, {type:"200", orientation:"1"}, {type:"300", orientation:"3", frequency:"20"}],
			[{type:"000", orientation:"-1"}, {type:"001", orientation:"-1"}, {type:"001", orientation:"-1"}, {type:"001", orientation:"-1"}, {type:"200", orientation:"0"}, {type:"001", orientation:"-1"}, {type:"001", orientation:"-1"}, {type:"001", orientation:"-1"}, {type:"000", orientation:"-1"}],
			[{type:"000", orientation:"-1"}, {type:"001", orientation:"-1"}, {type:"001", orientation:"-1"}, {type:"001", orientation:"-1"}, {type:"200", orientation:"0"}, {type:"001", orientation:"-1"}, {type:"001", orientation:"-1"}, {type:"001", orientation:"-1"}, {type:"000", orientation:"-1"}],
			[{type:"000", orientation:"-1"}, {type:"001", orientation:"-1"}, {type:"001", orientation:"-1"}, {type:"001", orientation:"-1"}, {type:"200", orientation:"0"}, {type:"001", orientation:"-1"}, {type:"001", orientation:"-1"}, {type:"001", orientation:"-1"}, {type:"000", orientation:"-1"}],
			[{type:"300", orientation:"1", frequency:"20"}, {type:"200", orientation:"1"}, {type:"200", orientation:"1"}, {type:"200", orientation:"1"}, {type:"100", orientation:"-1"}, {type:"200", orientation:"1"}, {type:"200", orientation:"1"}, {type:"200", orientation:"1"}, {type:"300", orientation:"3", frequency:"20"}],
			[{type:"000", orientation:"-1"}, {type:"001", orientation:"-1"}, {type:"001", orientation:"-1"}, {type:"001", orientation:"-1"}, {type:"200", orientation:"0"}, {type:"001", orientation:"-1"}, {type:"001", orientation:"-1"}, {type:"001", orientation:"-1"}, {type:"000", orientation:"-1"}],
			[{type:"000", orientation:"-1"}, {type:"001", orientation:"-1"}, {type:"001", orientation:"-1"}, {type:"001", orientation:"-1"}, {type:"200", orientation:"0"}, {type:"001", orientation:"-1"}, {type:"001", orientation:"-1"}, {type:"001", orientation:"-1"}, {type:"000", orientation:"-1"}],
			[{type:"000", orientation:"-1"}, {type:"001", orientation:"-1"}, {type:"001", orientation:"-1"}, {type:"001", orientation:"-1"}, {type:"200", orientation:"0"}, {type:"001", orientation:"-1"}, {type:"001", orientation:"-1"}, {type:"001", orientation:"-1"}, {type:"000", orientation:"-1"}],
			[{type:"300", orientation:"1", frequency:"20"}, {type:"200", orientation:"1"}, {type:"200", orientation:"1"}, {type:"200", orientation:"1"}, {type:"100", orientation:"-1"}, {type:"200", orientation:"1"}, {type:"200", orientation:"1"}, {type:"200", orientation:"1"}, {type:"300", orientation:"3", frequency:"20"}],
			[{type:"000", orientation:"-1"}, {type:"001", orientation:"-1"}, {type:"001", orientation:"-1"}, {type:"001", orientation:"-1"}, {type:"200", orientation:"0"}, {type:"001", orientation:"-1"}, {type:"001", orientation:"-1"}, {type:"001", orientation:"-1"}, {type:"000", orientation:"-1"}],
			[{type:"000", orientation:"-1"}, {type:"000", orientation:"-1"}, {type:"000", orientation:"-1"}, {type:"000", orientation:"-1"}, {type:"300", orientation:"0", frequency:"50"}, {type:"000", orientation:"-1"}, {type:"000", orientation:"-1"}, {type:"000", orientation:"-1"}, {type:"000", orientation:"-1"}]];
	
	store_var(map, "working_map");
	
	var x_dim = map[0].length;
	var y_dim = map.length;
	
	//Car Grid
	var car_grid = new Array(2 * map.length); //This variable tracks the location of cars, 0 means that the space is unavaible, 1 means the space is available, -1 means the space cannot have a car each space is a quarter of a tile
	
	for(var i = 0; i < 2 * map.length; i++) {
		car_grid[i] = new Array(2 * map[0].length);
		for(var j = 0; j < 2 * map[0].length; j++) {
			//Define car grid, which is the map for the locations the cars drive
			car_grid[i][j] = {};
			car_grid[i][j].drivable = check_drivable(map, Math.floor(i/2), Math.floor(j/2));
			car_grid[i][j].type = map[Math.floor(i/2)][Math.floor(j/2)].type;
			car_grid[i][j].orientation = map[Math.floor(i/2)][Math.floor(j/2)].orientation;
		}
	}
	
	//Create an array of all spawn points and intersections
	
	var spawn_array = [];
	var intersection_array = [];
	
	for(var i = 0; i < map.length; i++) {
		for(var j = 0; j < map[0].length; j++) {
			if(map[i][j].type[0] == "3" || map[i][j].type[0] == "5") {
				//define the values for each spawn point
				spawn_array.push(new Spawnpoint(map[i][j], i, j));
			} else if (map[i][j].type[0] == "1") {
				
				var intersection = {};
				
				car_grid[2*i][2*j].id = intersection_array.length;
				car_grid[2*i+1][2*j].id = intersection_array.length;
				car_grid[2*i+1][2*j+1].id = intersection_array.length;
				car_grid[2*i][2*j+1].id = intersection_array.length;
			
				intersection_array.push(new Traffic_light(intersection_array.length, i, j, "timer", 10, 10, 50, 30));
			}
		}
	}

	/*var light = new Traffic_light(0, 0, "timer", 10, 10, 20, 20);
	var bar;
	for (bar in light)
	{
		console.log("light has property " + bar + " of type " + typeof bar);
	}*/
	
	store_var(spawn_array, "spawn_array");
	store_var(intersection_array, "intersection_array");
	store_var(car_grid, "car_grid");
	
	build_map("Scene", map, x_dim, y_dim);
}

function check_drivable(map, i, j) {  //Returns 1 if the tile can be driven on
	var type = map[i][j].type;
	if(type[0] != "0") {
		return 1;
	}
	return -1;
}