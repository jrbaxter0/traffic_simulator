function update_light() {
	//Variables 
	request = false;
	var time = sessionStorage.light_time;
	var vert_cars = sessionStorage.vert_cars_waiting;
	var horz_cars = sessionStorage.horz_cars_waiting;
	var vertical_green = (Number(sessionStorage.light_state) == 3);
	var horizontal_green = (Number(sessionStorage.light_state) == 2);

	console.log("Variables:\nVertical Green: " + vertical_green + "\nhorizontal_green: " 
		+ horizontal_green + "\nvert_cars: " + vert_cars + "\nhorz_cars" + horz_cars)

	//Player Function
	if(vertical_green || horizontal_green) {
		/*if (vert_cars > 2){
			request = true;
		}
		else if (horz_cars > 3){
			request = true;
		}
		else{
			//do nothing
		}*/ //Austin's Attempt: 7 passed
		
		/*if (vertical_green) { 
			if (horz_cars > 3 || time > 10) {
				request = true;
			}
		} else if (horizontal_green) { 
			if (vert_cars > 3 || time > 10) {
				request = true;
			}
		}*/

		//Timer
		/*if(time >= 5) {
			request = true;
		}*/

		if (vertical_green) { 
			if (vert_cars == 0) {
				request = true;
			}
		} else if (horizontal_green) { 
			if (horz_cars == 0) {
				request = true;
			}
		}
	}
	
	console.log("Request: " + request);

	//Don't Touch Below This point
	change_light(request);
}

function update_cars() {
	var storedData = sessionStorage.getItem("vertical_car_delay");
	if (storedData) {
		var vertical_car_delay = JSON.parse(storedData);
	}

	var storedData = sessionStorage.getItem("horizontal_car_delay");
	if (storedData) {
		var horizontal_car_delay = JSON.parse(storedData);
	}

	var next_car_vert = vertical_car_delay.pop();
	var next_car_horz = horizontal_car_delay.pop();

	if(next_car_vert == 0) {
		sessionStorage.vert_cars_waiting = Number(sessionStorage.vert_cars_waiting) + 1;
	} else {
		vertical_car_delay.push(next_car_vert - 1);
	}

	if(next_car_horz == 0) {
		sessionStorage.horz_cars_waiting = Number(sessionStorage.horz_cars_waiting) + 1;
	} else {
		horizontal_car_delay.push(next_car_horz - 1);
	}

	if(sessionStorage.light_state == 2 && Number(sessionStorage.horz_cars_waiting) > 0) {
		sessionStorage.horz_cars_waiting = Number(sessionStorage.horz_cars_waiting) - 1;
		sessionStorage.cars_passed = Number(sessionStorage.cars_passed) + 1;
	} else if (sessionStorage.light_state == 3 && Number(sessionStorage.vert_cars_waiting) > 0) {
		sessionStorage.vert_cars_waiting = Number(sessionStorage.vert_cars_waiting) - 1;
		sessionStorage.cars_passed = Number(sessionStorage.cars_passed) + 1;
	}

	sessionStorage.setItem("vertical_car_delay", JSON.stringify(vertical_car_delay));
	sessionStorage.setItem("horizontal_car_delay", JSON.stringify(horizontal_car_delay));

	return (vertical_car_delay.length == 0) || (horizontal_car_delay.length == 0);
}

function change_light(request) {
	if(Number(sessionStorage.light_state) == 0) { //Changing vert to horz
		if(Number(sessionStorage.light_delay) == 0) {
			sessionStorage.light_state = 2;
			sessionStorage.light_time = 0;
		} else {
			sessionStorage.light_delay = Number(sessionStorage.light_delay) - 1;
		}
	} else if (Number(sessionStorage.light_state) == 1) { //Changing horz to vert
		if(Number(sessionStorage.light_delay) == 0) {
			sessionStorage.light_state = 3;
			sessionStorage.light_time = 0;
		} else {
			sessionStorage.light_delay = Number(sessionStorage.light_delay) - 1;
		}
	} else if (Number(sessionStorage.light_state) == 2) { //Green horz
		if(request) {
			sessionStorage.light_delay = 5;
			sessionStorage.light_state = 1;
			sessionStorage.light_time = Number(sessionStorage.light_time) + 1;
		}
	} else if (Number(sessionStorage.light_state) == 3) { //Green vert
		if(request) {
			sessionStorage.light_delay = 5;
			sessionStorage.light_state = 0;
			sessionStorage.light_time = Number(sessionStorage.light_time) + 1;
		}
	} 
}
