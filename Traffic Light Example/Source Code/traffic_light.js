//This file defines the traffic_light object
//The attributes are TODO

//i_index: x dimension on the map
//j_index: y dimension on the map

//last_state: the state of the light last time update_light was called

//COMMENT

function traffic_light(i, j, cycle_mode, max_cars_horizontal, max_cars_vertical, max_time_horizontal_ms, max_time_vertical_ms)
{

	/// @brief Time that the light is yellow before switching to double red
	var light_time_yellow_ms = 1000;

	/// @brief Time that the light is a double red before switching to green in a single direction
	var light_time_red_ms = 500;

	/// @brief The light object being created / returned
	var light = {};

	/// @brief Position of the intersection in the map array
	light.index_i = i;

	/// @brief Position of the intersection in the map array
	light.index_j = j;

	/// @brief The mode that the intersection will use - can be "car_count" or "timer"
	light.cycle_mode = cycle_mode;

	light.max_cars_horizontal = max_cars_horizontal;
	light.max_cars_vertical = max_cars_vertical;

	light.max_time_horizontal_ms = max_time_horizontal_ms;
	light.max_time_vertical_ms = max_time_vertical_ms;

	light.last_green = "vertical"; //should this be set to something else?
	light.state = "red";
	light.state_time_ms = -light_time_red_ms; // Will make it turn green on first cycle
	

	light.update_light = function(car_grid){
		switch(this.state){
			case "red": 
				if(this.state_time_ms > light_time_red_ms){
					if(this.last_green == "horizontal"){
						this.state = "vertical_green";
					}
					else{
						this.state = "horizontal_green";
					}
					this.state_time_ms = 0;
				}
				else{
					this.state_time_ms += 1; // can we get real ms?
				}
				break;
			case "yellow": 
				if(this.state_time_ms > light_time_yellow_ms)
				{
					this.state = "red";
					this.state_time_ms = 0;
				}
				break;
			case "vertical_green" // Intentional overflow
			case "horizontal_green"
				if(this.cycle_mode == "timer"){
					if(this.state == "horizontal_green"){
						if(this.state_time_ms > this.max_time_horizontal_ms){
							this.state = "yellow";
							this.state_time_ms = 0;
							this.last_green = "horizontal";
						}
						else{
							this.state_time_ms += 1;
						}
					}
					else //Vertical green
					{
						if(this.state_time_ms > this.max_time_vertical_ms){
							this.state = "yellow";
							this.state_time_ms = 0;
							this.last_green = "vertical";
						}
						else{
							this.state_time_ms += 1;
						} 
					}
				}
				else{ //Timer mode
					if(this.state == "horizontal_green"){
						if(this.get_cars(car_grid, "vertical") > this.max_cars_vertical){
							this.state = "yellow";
							this.state_time_ms = 0;
							this.last_green = "horizontal";
						}
					}
					else //Vertical green
					{
						if(this.get_cars(car_grid, "horizontal") > this.max_cars_horizontal){
							this.state = "yellow";
							this.state_time_ms = 0;
							this.last_green = "vertical";
						} 
					}
				}
				break;
		}
		// Update Image?
	};

	light.get_cars = function(car_grid, direction){
		// Allows a light to determine how many cars are waiting for the light to change
		// Returns an int being the sum of cars on both sides
		// Direction: "horizontal" or "vertical"
		return false;
		//@TODO
	};

	light.get_green = function(direction){
		// Allows a car to determine if the light is green in their direction
		// Returns a boolean true (green) or false (anything else)
		// Direction: "horizontal" or "vertical"
		if(light.state == "horizontal_green" && direction == "horizontal")
		{
			//Good for horizontal travel
			return true;
		}
		if(light.state == "vertical_green" && direction == "vertical")
		{
			//Good for vertical travel
			return true;
		}
		return false;
	};

	return light;
}