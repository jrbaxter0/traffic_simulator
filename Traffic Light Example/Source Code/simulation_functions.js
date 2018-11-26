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
		reset_light(intersection_array[i]);
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
		update_light(intersection_array[i], car_grid);
	}
	
	//Store new array of traffic lights
	store_var(intersection_array, "intersection_array");
}