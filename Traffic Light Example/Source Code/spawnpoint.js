//This file defines the spawnpoint object
//The attributes are x_dim, y_dim, direction, last_spawn, and spawn_freq

//x_dim: x dimension on the car_grid
//y_dim: y dimension on the car grid
//direction: direction on the spawn grid
//last_spawn: cycles since the last car was spawned from this spawnpoint
//spawn_freq: the frequency that cars should spawn, 0-255, 0 means it will never spawn while 255 means always

function Spawnpoint(map_square, i, j) {
	var spawn_point = {};
	var orient = Number(map_square.orientation); //Convert the map orientation into a int
				
	if(orient == 0) { //The spawnpoint on the tile is dependent on the orientation, it the direction is up, then the spawnpoint is in the bottom right, the grid is defined so 0,0 is in the top right
		spawn_point.y_dim = 2 * i + 1;
		spawn_point.x_dim = 2 * j + 1;
		spawn_point.direction = "Up";
	} else if (orient == 1) {
		spawn_point.y_dim = 2 * i + 1;
		spawn_point.x_dim = 2 * j;
		spawn_point.direction = "Right";
	} else if (orient == 2) {
		spawn_point.y_dim = 2 * i;
		spawn_point.x_dim = 2 * j;
		spawn_point.direction = "Down";
	} else {
		spawn_point.y_dim = 2 * i;
		spawn_point.x_dim = 2 * j + 1;
		spawn_point.direction = "Left";
	}
	
	spawn_point.last_spawn = 10000; //Set the last spawn rediculously high so that it doesn't get in the way
	spawn_point.spawn_freq = map_square.frequency; //Copy over frequency, frequency is a number btween 0 and 255, 255 means it (almost) always spawns, 0 is never
	
	spawn_point.spawn_cars = function(spawn_cooldown, car_grid) {
		this.last_spawn = this.last_spawn + 1; //Increment time since last spawn
		if((this.last_spawn > Number(spawn_cooldown)) && (car_grid[this.y_dim][this.x_dim].drivable == 1)) {
			if(LFSR() < this.spawn_freq) {
				this.last_spawn = 0; //Reset last spawn counter
				spawn_car(this);
				//This line should be replaced with a call to the car contructor, then return the result to be added to the car array
			}
		}
		return; //We will return a new car here eventually
	}
	
	spawn_point.update_frequency(new_freq) {
		spawn_point.spawn_freq = new_freq;
	}
	
	return spawn_point;
}