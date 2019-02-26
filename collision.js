function moveDots(points) {
	
	//TODO Use the quadtree to reduce the number of wall deflection checks
	if (typeof points != "object") {return false;}
	if (typeof points[0] != "object") {return false;}
	
	let tempPos;
	
	for (let i = 0; i < points.length; i++) {
		
		tempPos = [points[i].x + points[i].data[0], points[i].y + points[i].data[1]];
		if (tempPos[0] + points[i].data[2] > gridWidth) {
			
			deflectDot(points[i], "VERT");
			return "DEFLECTED VERT";
			
		}
		if (tempPos[0] - points[i].data[2] < 0) {
			
			deflectDot(points[i], "VERT");
			return "DEFLECTED VERT";
			
		}
		if (tempPos[1] + points[i].data[2] > gridHeight) {	
			
			deflectDot(points[i], "HORI");
			return "DEFLECTED HORI";
			
		}
		if (tempPos[1] - points[i].data[2] < 0) {
			
			deflectDot(points[i], "HORI");
			return "DEFLECTED HORI";
			
		}
		
		
		points[i].x = tempPos[0];
		points[i].y = tempPos[1];
 		
	}
	
	return true;
	
}

function deflectDot(a, direction) {
	
	if (typeof a != "object") {return false;}
	if (typeof a.data != "object") {return false;}
	
	if (direction == "VERT") {
		
		a.data[0] = -a.data[0];
		return true;
	
	}
	
	if (direction == "HORI") {
		
		a.data[1] = -a.data[1];
		return true;
		
	}
	
	return false;
}