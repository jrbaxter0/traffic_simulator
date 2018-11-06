// This file defines the traffic_light object
// The attributes are map_row, map_col, cycle_mode, max_cars_horizontal, max_cars_vertical, max_time_horizontal_ms,
// max_time_vertical_ms, last_green, state, state_time_ms

// map_row					Row in map array
// map_col					Column in map array
// cycle_mode				Cycle mode "timer" or "count"
// max_cars_horizontal		The maximum cars allowed to build up horizontally
// max_cars_vertical		The maximum cars allowed to build up vertically
// max_time_horizontal_ms	The maximum time spent green horizontally before changing
// max_time_vertical_ms		The maximum time spent green vertically before changing
// last_green 				The last green state, "horizontal" or "vertical"
// state 					the state of the light, "red", "yellow", "vertical_green", "horizontal_green"
// state_time_ms			the time that the light has spent in the state

// Constructor for timer based light
function Traffic_light_timer(map_row, map_col, max_time_horizontal_ms, max_time_vertical_ms)
{
	return traffic_light(map_row, map_col, "timer", 0, 0, max_time_horizontal_ms, max_time_vertical_ms);
}

// Constructor for count based light
function Traffic_light_count(map_row, map_col, max_cars_horizontal, max_cars_vertical)
{
	return traffic_light(map_row, map_col, "count", max_cars_horizontal, max_cars_vertical, 0, 0);
}

// General constructor
function Traffic_light(map_row, map_col, cycle_mode, max_cars_horizontal, max_cars_vertical, max_time_horizontal_ms, max_time_vertical_ms)
{

	/// @brief Time that the light is yellow before switching to double red
	var light_time_yellow_ms = 1000;

	/// @brief Time that the light is a double red before switching to green in a single direction
	var light_time_red_ms = 500;

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
	this.max_time_horizontal_ms = max_time_horizontal_ms;
	this.max_time_vertical_ms = max_time_vertical_ms;

	// Initial state setup
	this.last_green = "vertical";
	this.state = "red";
	this.state_time_ms = -light_time_red_ms; // Will make it turn green on first cycle
	

	this.update_light = function(car_grid)
	{
		switch(this.state)
		{
			case "red": 
				if(this.state_time_ms > light_time_red_ms)
				{
					if(this.last_green == "horizontal")
					{
						this.state = "vertical_green";
					}
					else
					{
						this.state = "horizontal_green";
					}
					this.state_time_ms = 0;
				}
				else
				{
					this.state_time_ms += 1; // can we get real ms?
				}
				break;

			case "yellow": 
				if(this.state_time_ms > light_time_yellow_ms)
				{
					this.state = "red";
					this.state_time_ms = 0;
				}
				else
				{
					this.state_time_ms += 1; // can we get real ms?
				}
				break;

			case "horizontal_green"
				if(this.cycle_mode == "timer")
				{
					if(this.state_time_ms > this.max_time_horizontal_ms)
					{
						this.state = "yellow";
						this.state_time_ms = 0;
						this.last_green = "horizontal";
					}
					else
					{
						this.state_time_ms += 1;
					}
				}
				else //count
				{
					if(this.get_cars(car_grid, "vertical") > this.max_cars_vertical)
					{
						this.state = "yellow";
						this.state_time_ms = 0;
						this.last_green = "horizontal";
					}
				}
				break;

			case "vertical_green"
				if(this.cycle_mode == "timer")
				{
					if(this.state_time_ms > this.max_time_vertical_ms)
					{
						this.state = "yellow";
						this.state_time_ms = 0;
						this.last_green = "vertical";
					}
					else
					{
						this.state_time_ms += 1;
					}
				}
				else //count
				{
					if(this.get_cars(car_grid, "horizontal") > this.max_cars_horizontal)
					{
						this.state = "yellow";
						this.state_time_ms = 0;
						this.last_green = "vertical";
					}
				}
				break;
		}
		// Update Image?
	};

	this.get_cars = function(car_grid, direction)
	{
		// Allows a light to determine how many cars are waiting for the light to change
		// Returns an int being the sum of cars on both sides
		// Direction: "horizontal" or "vertical"
		return false;
		//@TODO
	};

	this.get_green = function(direction)
	{
		// Allows a car to determine if the light is green in their direction
		// Returns a boolean true (green) or false (anything else)
		// Direction: "horizontal" or "vertical"
		if(this.state == "horizontal_green" && direction == "horizontal")
		{
			//Good for horizontal travel
			return true;
		}
		if(this.state == "vertical_green" && direction == "vertical")
		{
			//Good for vertical travel
			return true;
		}
		return false;
	};

	this.reset = function()
	{
		this.last_green = "vertical";
		this.state = "red";
		this.state_time_ms = -light_time_red_ms; // Will make it turn green on first cycle
	}
}