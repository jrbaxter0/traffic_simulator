//This file defines the traffic_light object
//The attributes are TODO

//i_index: x dimension on the map
//j_index: y dimension on the map

//last_state: the state of the light last time update_light was called

//COMMENT

function traffic_light(i, j, cycle_mode, max_cars_x, max_cars_y, max_time_x, max_time_y)
{

	/// @brief Time that the light is yellow before switching to double red
	var light_yellow_time_ms = 1000;

	/// @brief Time that the light is a double red before switching to green in a single direction
	var light_red_time_ms = 500;

	/// @brief The light object being created / returned
	var light = {};

	/// @brief Position of the intersection in the map array
	light.index_i = i;

	/// @brief Position of the intersection in the map array
	light.index_j = j;

	/// @brief The mode that the intersection will use - can be "car_count" or "timer"
	light.cycle_mode = cycle_mode;

	light.max_cars_x = max_cars_x;
	light.max_cars_y = max_cars_y;

	light.max_time_x = max_time_x;
	light.max_time_y = max_time_y;

	light.last_state = "changing"; //should this be set to something else?
	

	light.update_light = fuction(car_grid){
		if(this.cycle_mode == "timer"){
			if(this.last_state != "waiting"){
				//Check if the time has been reached and change if yes, otherwise add 1 to state time
			}
		}
		else if(this.cycle_mode == "car_count"){


		}
		else{
			//I have no idea . . .
		}




	}

	light.get_green(index_i, index_j){
		//Allows a card to determine if the light is green in their direction
		//Returns a boolean true (green) or false (anything else)

		/// TODO
		return false;
	}



	return light;
}

function ()
{
	//copy paste from simulation_functions.js
	if(intersection_array[index].green_state != "changing") {
			//Since this is only a time setup, check if the time as been reached and change if yes, otherwise add 1 to state time
			if(intersection_array[index].state_time < intersection_array[index].max_time) {
				intersection_array[index].state_time++;
			} else {
				intersection_array[index].state_time = 0;
				if(intersection_array[index].green_state == "vertical") {
					intersection_array[index].changing_to = "horizontal";
				} else {
					intersection_array[index].changing_to = "vertical";
				}
				intersection_array[index].green_state = "changing";
			}
		} else {
			//If the light is changing, check to see if it should be done, if yes, change value, otherwise add 1 to state time
			if(intersection_array[index].state_time < Number(sessionStorage.light_change_time)) {
				intersection_array[index].state_time++;
			} else {
				intersection_array[index].state_time = 0;
				intersection_array[index].green_state = intersection_array[index].changing_to;
				intersection_array[index].changing_to = "changing";
			}
		}
		//Update UI, temporary
		document.getElementById("LightState" + i).innerHTML = "Light State: " + intersection_array[index].green_state;
}