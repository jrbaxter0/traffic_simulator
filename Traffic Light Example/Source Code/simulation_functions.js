function start_simulation() {
	//Toggles whether the simulation on/off
	if(sessionStorage.simulation_active == "0") {
		sessionStorage.interval_var = setInterval(simulate, 100);
		sessionStorage.simulation_active = "1";
	} else {
		clearInterval(sessionStorage.interval_var);
		sessionStorage.simulation_active = "0";
	}
}

function simulate() { 
	//The main loop of the simulation
	manage_lights();
	move_cars();
	
	manage_spawns();

	
	//For Debugging purposes
	console.log(get_var("car_grid"));
	console.log(get_var("car_array"));
	console.log(get_var("intersection_array"));
	console.log(get_var("spawn_array"));
}

function reset_simulation() {
	//Stops the program if active, resets all relevant variables
	if(sessionStorage.simulation_active == "1") {
		clearInterval(sessionStorage.interval_var);
		sessionStorage.simulation_active = "0";
	}
	
	console.log("Reseting Simulation");
	
	//Reset random seed
	sessionStorage.random_seed = sessionStorage.random_seed_start;
	
	var car_grid = get_var("car_grid");
	var car_array = get_var("car_array");
	var intersection_array = get_var("intersection_array");
	var spawn_array = get_var("spawn_array");
	
	//Destroy all cars
	for(var i = car_array.length - 1; i >= 0 ; i--) {
		car_grid[car_array[i].y_coord][car_array[i].x_coord].drivable = 1;	
		var removed_car = car_array.pop();
		var element = document.getElementById(removed_car.carID);
		if(element != null) {
			element.parentNode.removeChild(element);
		}
	}
	
	//Reset all traffic lights
	for(var i = 0; i < intersection_array.length; i++) {
		intersection_array[i].reset();
	}
	
	for(var i = 0; i < spawn_array.length; i++) {
		reset_spawnpoints(spawn_array[i]);
	}
	
	//Store the reset variables back into sessionStorage
	store_var([], "car_array");
	store_var(car_grid, "car_grid");
	store_var(intersection_array, "intersection_array");
	store_var(spawn_array, "spawn_array");
	sessionStorage.cars_passed = "0";
}

function manage_lights() {
	//Check all lights and change state if needed
	var intersection_array = get_var("intersection_array");
	var car_grid = get_var("car_grid");

	//iterate through all traffic lights (the contents of this loop should be an object method)
	for(var i = 0; i < intersection_array.length; i++) {
		intersection_array[i].update_light(car_grid);
		//Update UI, temporary
		//document.getElementById("LightState" + i).innerHTML = "Light State: " + intersection_array[i].green_state;
	}
	
	//Store new array of traffic lights
	store_var(intersection_array, "intersection_array");
}

function spawn_car(spawn_point) {
	var car_grid = get_var("car_grid");
	var car_array = get_var("car_array");
	
	var new_car = {};
	car_grid[spawn_point.y_dim][spawn_point.x_dim].drivable = 0;
	
	//define all car attributes
	new_car.x_coord = spawn_point.x_dim;
	new_car.y_coord = spawn_point.y_dim;
	new_car.movement_cooldown = Number(sessionStorage.car_move_cooldown) + 1;
	new_car.directions = spawn_point.direction;
	new_car.time = 0;
	
	//assign the car a number so it can be referenced
	new_car.carID = "car" + sessionStorage.current_car_id;
	
	sessionStorage.current_car_id = Number(sessionStorage.current_car_id) + 1;
	
	car_array.push(new_car);
	
	//Render functions, currently split to have different colors, but these should be combined with random car coloring
	if(new_car.directions == "Down" || new_car.directions == "Up"){
		render_car(spawn_point.x_dim, spawn_point.y_dim, "Artwork/BlueCar.jpg", "Scene", new_car.carID);
	} else {
		render_car(spawn_point.x_dim, spawn_point.y_dim, "Artwork/RedCar.jpg", "Scene", new_car.carID);
	}

	store_var(car_grid, "car_grid");
	store_var(car_array, "car_array");
}

function move_cars() {
	var car_grid = get_var("car_grid");
	var car_array = get_var("car_array");
	var intersection_array = get_var("intersection_array");
	var cars_to_remove = [];
	
	//Iterate through cars
	for(var i = 0; i < car_array.length; i++) {
		car_array[i].time = car_array[i].time + 1;
		if(car_array[i].movement_cooldown > 0) {
			//if the car moved recently, do nothing
			car_array[i].movement_cooldown = car_array[i].movement_cooldown - 1;
		} else {
			var destination = get_dest_location(car_array[i].directions, car_array[i].x_coord, car_array[i].y_coord, car_grid);
			if(destination[0] == -1) {
				//if the car is going off the map, add it to a list of cars to delete
				cars_to_remove.push(i);
				car_grid[car_array[i].y_coord][car_array[i].x_coord].drivable = 1;
			} else {
				if (car_grid[destination[1]][destination[0]].type == 4 && car_grid[car_array[i].y_coord][car_array[i].x_coord].type != 4) {
					//if moving from a non-light to a light
					var light = intersection_array[car_grid[destination[1]][destination[0]].id];
					if((car_array[i].directions == "Up" || car_array[i].directions == "Down") && light.get_green("vertical"))
					{
						car_grid[car_array[i].y_coord][car_array[i].x_coord].drivable = 1;
						car_array[i].x_coord = destination[0];
						car_array[i].y_coord = destination[1];
						car_grid[destination[1]][destination[0]].drivable = 0;
						car_array[i].movement_cooldown = Number(sessionStorage.car_move_cooldown);

						update_car_position(car_array[i].x_coord, car_array[i].y_coord, car_array[i].carID);
					}
					else if((car_array[i].directions == "Left" || car_array[i].directions == "Right") && light.get_green("horizontal"))
					{
						car_grid[car_array[i].y_coord][car_array[i].x_coord].drivable = 1;
						car_array[i].x_coord = destination[0];
						car_array[i].y_coord = destination[1];
						car_grid[destination[1]][destination[0]].drivable = 0;
						car_array[i].movement_cooldown = Number(sessionStorage.car_move_cooldown);

						update_car_position(car_array[i].x_coord, car_array[i].y_coord, car_array[i].carID);
					}
					else
					{
						//if the car can't move, apply a short delay to prevent overtaxing processor
						car_array[i].movement_cooldown = Number(sessionStorage.short_wait);
					}
				} else if(car_grid[destination[1]][destination[0]].drivable == 1) {
					//if moving between two places that don't care
					car_grid[car_array[i].y_coord][car_array[i].x_coord].drivable = 1;
					car_array[i].x_coord = destination[0];
					car_array[i].y_coord = destination[1];
					car_grid[destination[1]][destination[0]].drivable = 0;
					car_array[i].movement_cooldown = Number(sessionStorage.car_move_cooldown);
					
					update_car_position(car_array[i].x_coord, car_array[i].y_coord, car_array[i].carID);
				} else {
					car_array[i].movement_cooldown = Number(sessionStorage.short_wait);
				}
			}
		}
	}
	
	//Remove car from array
	for(var i = cars_to_remove.length - 1; i >= 0; i--) {
		var removed_car = car_array[cars_to_remove[i]];
		car_array[cars_to_remove[i]] = car_array.pop();
		sessionStorage.cars_passed = Number(sessionStorage.cars_passed) + 1;
		sessionStorage.car_time = removed_car.time + Number(sessionStorage.car_time);
		//document.getElementById("Score").innerHTML = "Score: " + sessionStorage.cars_passed;
		//document.getElementById("Latency").innerHTML = "Average Latency: " + Math.round(10 * Number(sessionStorage.car_time) / Number(sessionStorage.cars_passed)) / 10; 
		var element = document.getElementById(removed_car.carID);
		if(element != null) {
			element.parentNode.removeChild(element);
		}
	}
	
	store_var(car_grid, "car_grid");
	store_var(car_array, "car_array");
}

function get_dest_location(direction, x_dim, y_dim, car_grid) {
	//Returns the coordinates of where the car is going
	var x_coord = x_dim;
	var y_coord = y_dim;
	
	if(direction == "Up") {
		y_coord--;
	} else if (direction == "Down") {
		y_coord++;
	} else if (direction == "Left") {
		x_coord--;
	} else {
		x_coord++;
	}
	
	//if the car is going off the map (despawning), return [-1, -1]
	if( (x_coord < 0) || (y_coord < 0) || (y_coord >= car_grid.length) || (x_coord >= car_grid[0].length) ) {
		x_coord = -1;
		y_coord = -1;
	}
	
	return [x_coord, y_coord];
}

function render_car(block_location_x, block_location_y, source, div, carID) {
	//Mostly stollen from the render map function
	var grid_size_x = Number(sessionStorage.grid_size_x) / 2;
	var grid_size_y = Number(sessionStorage.grid_size_y) / 2;
	var x_buffer = Number(sessionStorage.x_buffer) * 2;
	var y_buffer = Number(sessionStorage.y_buffer) * 2;
	
	var elem = document.createElement("img");
	elem.setAttribute("src", source);
			
	elem.setAttribute("id", carID);	
	elem.setAttribute("width", grid_size_x + "%");
	elem.setAttribute("height", grid_size_y + "%");
	elem.setAttribute("z-index", sessionStorage.car_zindex);
	
	//For some reason, the position attribute in HTML is not standard but is instead under style, (controlled by a CSS function)
	var left_str = "left:" + (x_buffer * grid_size_x + block_location_x * grid_size_x) + "%";
	var top_str = "top:" + (y_buffer * grid_size_y + block_location_y * grid_size_y) + "%";
	elem.setAttribute("style", "position:absolute;" + left_str + ";" + top_str);
			
	document.getElementById(div).appendChild(elem);
	
	return;
}

function update_car_position(block_location_x, block_location_y, carID) {
	//shortened version of render_car, could probably be combined
	var grid_size_x = Number(sessionStorage.grid_size_x) / 2;
	var grid_size_y = Number(sessionStorage.grid_size_y) / 2;
	var x_buffer = Number(sessionStorage.x_buffer) * 2;
	var y_buffer = Number(sessionStorage.y_buffer) * 2;
	
	var left_str = "left:" + (x_buffer * grid_size_x + block_location_x * grid_size_x) + "%";
	var top_str = "top:" + (y_buffer * grid_size_y + block_location_y * grid_size_y) + "%";
			
	document.getElementById(carID).setAttribute("style", "position:absolute;" + left_str + ";" + top_str);

	return;
}