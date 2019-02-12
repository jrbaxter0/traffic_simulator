// This file defines the traffic_light object
// The attributes are map_row, map_col, cycle_mode, max_cars_horizontal, max_cars_vertical, max_time_horizontal,
// max_time_vertical, last_green, state, state_time

// map_row					Row in map array
// map_col					Column in map array
// cycle_mode				Cycle mode "timer" or "count"
// max_cars_horizontal		The maximum cars allowed to build up horizontally
// max_cars_vertical		The maximum cars allowed to build up vertically
// max_time_horizontal		The maximum time spent green horizontally before changing
// max_time_vertical		The maximum time spent green vertically before changing
// last_green 				The last green state, "horizontal" or "vertical"
// state 					the state of the light, "red", "yellow", "vertical_green", "horizontal_green"
// state_time				the time that the light has spent in the state

// General constructor

/// @brief Time that the light is yellow before switching to double red
var light_time_yellow = 5;

/// @brief Time that the light is a double red before switching to green in a single direction
var light_time_red = 5;

function Traffic_light(index, map_row, map_col, cycle_mode, max_cars_horizontal, max_cars_vertical, max_time_horizontal, max_time_vertical)
{
	this.index = index;
	/// @brief Position of the intersection in the map array
	this.map_row = map_row;

	/// @brief Position of the intersection in the map array
	this.map_col = map_col;

	/// @brief The mode that the intersection will use - can be "car_count" or "timer"
	this.cycle_mode = cycle_mode;

	/// @brief The max cars in horizontal and vertical directions
	this.max_cars_horizontal = max_cars_horizontal;
	this.max_cars_vertical = max_cars_vertical;

	/// @brief The max time in horizontal and vertical modes
	this.max_time_horizontal = max_time_horizontal;
	this.max_time_vertical = max_time_vertical;

	// Initial state setup
	this.last_green = "vertical";
	this.state = "red";
	this.state_time = light_time_red; // Will make it turn green on first cycle
}

function update_light(light, car_grid)
{
	switch(light.state)
	{
		case "red": 
			if(light.state_time > light_time_red)
			{
				if(light.last_green == "horizontal")
				{
					light.state = "vertical_green";
				}
				else
				{
					light.state = "horizontal_green";
				}
				light.state_time = 0;
			}
			else
			{
				light.state_time += 1; // can we get real ms?
			}
			break;

		case "yellow": 
			if(light.state_time > light_time_yellow)
			{
				light.state = "red";
				light.state_time = 0;
			}
			else
			{
				light.state_time += 1; // can we get real ms?
			}
			break;

		case "horizontal_green":
			if(light.cycle_mode == "timer")
			{
				if(light.state_time > light.max_time_horizontal)
				{
					light.state = "yellow";
					light.state_time = 0;
					light.last_green = "horizontal";
				}
				else
				{
					light.state_time += 1;
				}
			}
			else //count
			{
				if(light.get_cars(car_grid, "vertical") > light.max_cars_vertical)
				{
					light.state = "yellow";
					light.state_time = 0;
					light.last_green = "horizontal";
				}
			}
			break;

		case "vertical_green":
			if(light.cycle_mode == "timer")
			{
				if(light.state_time > light.max_time_vertical)
				{
					light.state = "yellow";
					light.state_time = 0;
					light.last_green = "vertical";
				}
				else
				{
					light.state_time += 1;
				}
			}
			else //count
			{
				if(light.get_cars(car_grid, "horizontal") > light.max_cars_horizontal)
				{
					light.state = "yellow";
					light.state_time = 0;
					light.last_green = "vertical";
				}
			}
			break;
	}
	document.getElementById("LightState" + light.index).innerHTML = "Light State: " + light.state + " timer: " + light.state_time;
	// Update Image?
}

function get_cars(light, car_grid, direction)
{
	// Allows a light to determine how many cars are waiting for the light to change
	// Returns an int being the sum of cars on both sides
	// Direction: "horizontal" or "vertical"
	return 0;
	//@TODO
}

function get_green(light, direction)
{
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
}

function reset_light(light)
{
	light.last_green = "vertical";
	light.state = "red";
	light.state_time = light_time_red; // Will make it turn green on first cycle
}
