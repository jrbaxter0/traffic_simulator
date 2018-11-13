//This file defines the spawnpoint object
//The attributes are x_dim, y_dim, direction, last_spawn, and spawn_freq

//x_dim: x dimension on the car_grid
//y_dim: y dimension on the car grid
//direction: direction on the spawn grid
//last_spawn: cycles since the last car was spawned from this spawnpoint
//spawn_freq: the frequency that cars should spawn, 0-255, 0 means it will never spawn while 255 means always

function Spawnpoint(map_square, i, j) {
	var orient = Number(map_square.orientation); //Convert the map orientation into a int
				
	if(orient == 0) { //The spawnpoint on the tile is dependent on the orientation, it the direction is up, then the spawnpoint is in the bottom right, the grid is defined so 0,0 is in the top right
		this.y_dim = 2 * i + 1;
		this.x_dim = 2 * j + 1;
		this.direction = "Up";
	} else if (orient == 1) {
		this.y_dim = 2 * i + 1;
		this.x_dim = 2 * j;
		this.direction = "Right";
	} else if (orient == 2) {
		this.y_dim = 2 * i;
		this.x_dim = 2 * j;
		this.direction = "Down";
	} else {
		this.y_dim = 2 * i;
		this.x_dim = 2 * j + 1;
		this.direction = "Left";
	}
	
	this.last_spawn = 10000; //Set the last spawn rediculously high so that it doesn't get in the way
	this.spawn_freq = map_square.frequency; //Copy over frequency, frequency is a number btween 0 and 255, 255 means it (almost) always spawns, 0 is never
}

function manage_spawns() {
	var spawn_array = get_var("spawn_array");
	var car_grid = get_var("car_grid");
	
	//Iterate through spawns, call random value, if the value is lower than spawn_freq value and the spawn isn't on cooldown, then spawn car 
	for(var i = 0; i < spawn_array.length; i++) {
		update_spawn(spawn_array[i], Number(sessionStorage.spawn_cooldown), car_grid);
	}
	
	store_var(spawn_array, "spawn_array");
}

function update_spawn(spawn_point, spawn_cooldown, car_grid) {
	spawn_point.last_spawn = spawn_point.last_spawn + 1; //Increment time since last spawn
	if((spawn_point.last_spawn > Number(spawn_cooldown)) && (car_grid[spawn_point.y_dim][spawn_point.x_dim].drivable == 1)) {
		if(LFSR() < spawn_point.spawn_freq) {
			spawn_point.last_spawn = 0; //Reset last spawn counter
			spawn_car(spawn_point);
			//This line should be replaced with a call to the car constructor, then return the result to be added to the car array
		}
	}
	return; //We will return a new car here eventually
}
	
	
function print_info(spawn_point) {
	console.log("Spawnpoint Info: ");
	console.log("X_Dim: " + spawn_point.x_dim);
	console.log("Y_Dim: " + spawn_point.y_dim);
}
	
function reset_spawnpoints(spawn_point) {
	spawn_point.last_spawn = 10000;
}