function spawn_car(spawn_point, car_grid) {
	car_grid[spawn_point.y_dim][spawn_point.x_dim].drivable = 0; //Set the spawnpoint as undrivable because there is now a car here
	
	//define all car attributes
	this.x_coord = spawn_point.x_dim; 
	this.y_coord = spawn_point.y_dim;
	this.movement_cooldown = Number(sessionStorage.car_move_cooldown) + 1; //The # of cycles until the car can move again
	this.directions = spawn_point.direction;
	this.time = 0;
	
	//assign the car a number so it can be referenced
	this.carID = "car" + sessionStorage.current_car_id;
	
	sessionStorage.current_car_id = Number(sessionStorage.current_car_id) + 1;
	
	//Determine car color
	var color_number = Math.floor(Math.random() * 2);
	if(color_number == 0) {
		this.color = "Blue";
	} else if(color_number == 1) {
		this.color = "Red";
	} else {
		this.color = "Blue";
	}
	
	//Render functions, currently split to have different colors, but these should be combined with random car coloring
	render_car(spawn_point.x_dim, spawn_point.y_dim, "Artwork/" + this.color + "Car.jpg", "Scene", this.carID);
}

function render_car(block_location_x, block_location_y, source, div, carID) {
	//Mostly stolen from the render map function
	var grid_size_x = Number(sessionStorage.grid_size_x) / 2; //Size of the large grid halved to get the size of the quadrants
	var grid_size_y = Number(sessionStorage.grid_size_y) / 2;
	var x_buffer = Number(sessionStorage.x_buffer) * 2; //The number of squares not rendered on the edge, I do not know why it is multiplied by two
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

function move_cars() {
	var car_grid = get_var("car_grid");
	var car_array = get_var("car_array");
	var intersection_array = get_var("intersection_array");
	var cars_to_remove = [];
	
	for(var i = 0; i < car_array.length; i++) {
		move_car(car_array[i], car_grid, cars_to_remove, i, intersection_array);
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

function move_car(car, car_grid, cars_to_remove, i, intersection_array) {
	car.time = car.time + 1;
	if(car.movement_cooldown > 0) {
		//if the car moved recently, do nothing
		car.movement_cooldown = car.movement_cooldown - 1;
		return;
	}
	
	var destination = get_dest_location(car.directions, car.x_coord, car.y_coord, car_grid); //returns [-1, -1] is the car leaves the map or is entering an undrivable zone
	if(destination[0] == -1) {
		//if the car is going off the map, add it to a list of cars to delete
		cars_to_remove.push(i);
		car_grid[car.y_coord][car.x_coord].drivable = 1;
		return;
	}
	
	if (car_grid[destination[1]][destination[0]].type[0] == 1 && car_grid[car.y_coord][car.x_coord].type[0] != 1) {
		//if moving from a non-light to a light
		var light = intersection_array[car_grid[destination[1]][destination[0]].id];
		if((car.directions == "Up" || car.directions == "Down") && get_green(light, "vertical"))
		{
			car_grid[car.y_coord][car.x_coord].drivable = 1;
			car.x_coord = destination[0];
			car.y_coord = destination[1];
			car_grid[destination[1]][destination[0]].drivable = 0;
			car.movement_cooldown = Number(sessionStorage.car_move_cooldown);

			update_car_position(car.x_coord, car.y_coord, car.carID);
		}
		else if((car.directions == "Left" || car.directions == "Right") && get_green(light, "horizontal"))
		{
			car_grid[car.y_coord][car.x_coord].drivable = 1;
			car.x_coord = destination[0];
			car.y_coord = destination[1];
			car_grid[destination[1]][destination[0]].drivable = 0;
			car.movement_cooldown = Number(sessionStorage.car_move_cooldown);

			update_car_position(car.x_coord, car.y_coord, car.carID);
		}
		else
		{
			//if the car can't move, apply a short delay to prevent overtaxing processor
			car.movement_cooldown = Number(sessionStorage.short_wait);
		}
	} else if(car_grid[destination[1]][destination[0]].drivable == 1) {
		//if moving between two places that don't care
		car_grid[car.y_coord][car.x_coord].drivable = 1;
		car.x_coord = destination[0];
		car.y_coord = destination[1];
		car_grid[destination[1]][destination[0]].drivable = 0;
		car.movement_cooldown = Number(sessionStorage.car_move_cooldown);
		
		update_car_position(car.x_coord, car.y_coord, car.carID);
	} else {
		//If the car cannot move, put it on a small cooldown for spacing
		car.movement_cooldown = Number(sessionStorage.short_wait);
	}
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