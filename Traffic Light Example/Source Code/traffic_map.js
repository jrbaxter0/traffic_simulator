function build_map(div, map, x_dim, y_dim) {

	//Start by calculating the size, in percent, of each grid space based on the dimensions
	var scene_width = Number(sessionStorage.scene_width);  //Goes in conjuction with the width of Scene in the CSS. I am not smart enough to link them here, sorry
	var x_buffer = Number(sessionStorage.x_buffer); 		//The size of the area surrounding the map in grid spaces
	var y_buffer = Number(sessionStorage.y_buffer);
	
	var grid_size_x = scene_width / (x_dim + 2 * x_buffer);
	var grid_size_y = 100 / (y_dim + 2 * y_buffer);
	
	sessionStorage.grid_size_x = grid_size_x;
	sessionStorage.grid_size_y = grid_size_y;
	
	//begin to iterate through each element in the grid
	for(var block_location_x = 0; block_location_x < x_dim; block_location_x++) {
		for(var block_location_y = 0; block_location_y < y_dim; block_location_y++) {
			//Using the type and orientation, return an array of all sources and other instructions
			if(Number(map[block_location_y][block_location_x].type) < 100) { //True if piece takes 1 layer
				var image_object = get_single_level_source(map[block_location_y][block_location_x].type, map[block_location_y][block_location_x].orientation);
		
				//depending on the .instructions attribute, perform one of various functions to render the object		
				render_full(grid_size_x, grid_size_y, block_location_x, block_location_y, x_buffer, y_buffer, image_object, div, y_dim);
			
				//store the new element in the grid variable for later access
			} else { //Run for multilevel objects
				
			}
		}
	}
}

function get_single_level_source(type, orientation) {
	//file basename lookup table
	file_base_names = ["Border", "BorderTunnel", "Grass", "StraightRoadBlock", "IntersectionBase"];
	
	//file rotation lookup table
	file_rotations = ["_0", "_90", "_180", "_270", ""];
	
	var file_path = "Artwork/"
	var file_base = file_base_names[Number(type)];
	var file_rot = "";
	if (orientation != "-1") {
		file_rot = file_rotations[Number(orientation)];
	}
	var file_ext = ".jpg";
	
	return {source:file_path + file_base + file_rot + file_ext, zindex:"0"};
}

//Accept # and orientation, first number (hundreds) indicates layers, next two are ids
//return array will the source of all pieces
//interate through array to build all pieces
//z levels: 0: base track, 5: highlighting, 10: cars on lower levels, 12: bridges, 15: cars on higher levels

function render_full(grid_size_x, grid_size_y, block_location_x, block_location_y, x_buffer, y_buffer, image_object, div, y_dim) {
	var elem = document.createElement("img");
	elem.setAttribute("src", image_object.source);
	elem.setAttribute("id", "MapSquare" + (block_location_x * y_dim + block_location_y));
	elem.setAttribute("onclick", "update_data(" + (block_location_x * y_dim + block_location_y) + ")");
	elem.setAttribute("onmouseenter", "update_hover_name(" + (block_location_x * y_dim + block_location_y) + ")");
			
	elem.setAttribute("width", grid_size_x + "%");
	elem.setAttribute("height", grid_size_y + "%");
	elem.setAttribute("z-index", image_object.zindex);
			
	var left_str = "left:" + (x_buffer * grid_size_x + block_location_x * grid_size_x) + "%";
	var top_str = "top:" + (y_buffer * grid_size_y + block_location_y * grid_size_y) + "%";
	elem.setAttribute("style", "position:absolute;" + left_str + ";" + top_str);
			
	document.getElementById(div).appendChild(elem);
	
	return;
}

function update_data(square_id) {
	console.log(square_id);
}

function update_hover_name(square_id) {
	document.getElementById("TileHoverName").innerHTML = "Tile Name: " + square_id;
}

function change_collaspe(id) {
	var str = document.getElementById(id).innerHTML;
	if(str == "&gt;") {
		str = "v";
		document.getElementById(id).innerHTML = str;
		//Uncollapse
	} else if (str == "v") {
		str = "&gt;";
		document.getElementById(id).innerHTML = str;
		//Collapse
	}
}

function check_timer_valid(phase, dir, textarea_id, p_id) {
	var intersection_array = get_var("intersection_array");
	var value = document.getElementById(textarea_id).value;
	console.log(value);
	if(isNaN(value)) {
		document.getElementById(p_id).style.color = "#ff0000";
		console.log("Not a number");
		//set_timer(intersection_array[id], dir, -1); 
	} else {
		document.getElementById(p_id).style.color = "#008000";
		console.log("Number");
		//set_timer(intersection_array[id], dir, Number(value)); 
	}
		
	store_var(intersection_array, "intersection_array");
}
