function store_var(storing_variable, id_string) { //Function to store arrays and objects in sessionStorage
	sessionStorage.setItem(id_string, JSON.stringify(storing_variable));
	return;
}

function get_var(id_string) { //Retrieves objects stored in sessionStorage
	var storedData = sessionStorage.getItem(id_string);
	if (storedData) {
		return JSON.parse(storedData);
	} else {
		return false;
	}
}

function LFSR() { //Returns a random value between 0 and 255, uses psuedo-randomess, so long as the number of calls and starting seed are the same
	var random_value = sessionStorage.random_seed;
	
	var digit_3 = !(!(8 & random_value));
	var digit_4 = !(!(16 & random_value));
	var digit_5 = !(!(32 & random_value));
	var digit_7 = !(!(128 & random_value));
	
	random_value = (random_value << 1) % 256;
	//Uses the formula for a linear feedback shift register
	random_value = random_value + !(digit_3 ^ digit_4 ^ digit_5 ^ digit_7);
	
	sessionStorage.random_seed = random_value;
	
	return random_value;
}
	