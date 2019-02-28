function moveDots(points) {
	
	//TODO Use the quadtree to reduce the number of wall deflection checks
	if (typeof points != "object") {return false;}
	if (typeof points[0] != "object") {return false;}
	
	let testPos;
	
	for (let i = 0; i < points.length; i++) {
		
		testPos = [points[i].x + points[i].data[0], points[i].y + points[i].data[1]];
		if (testPos[0] + points[i].data[2] > gridWidth) {
			
			if (testPos[0] + points[i].data[2] < gridWidth + 5) {
				deflectDot(points[i], "VERT");
			} else {
				points[i].x += points[i].data[0];
			}
			
		}
		else if (testPos[0] - points[i].data[2] < 0) {
			
			if (testPos[0] - points[i].data[2] > -6) {
				deflectDot(points[i], "VERT");
			} else {
				points[i].x += points[i].data[0];
			}
			
		}
		else if (testPos[1] + points[i].data[2] > gridHeight) {	
			
			if (testPos[1] + points[i].data[2] < gridHeight + 5) {
				deflectDot(points[i], "HORI");
			} else {
				points[i].y += points[i].data[1];
			}
			
		}
		else if (testPos[1] - points[i].data[2] < 0) {
			
			if (testPos[1] - points[i].data[2] > 0 - 5) {
				deflectDot(points[i], "HORI");
			} else {
				points[i].y += points[i].data[1];
			}
			
			
		} else {
			
			points[i].x = testPos[0];
			points[i].y = testPos[1];
		}
		
		let nearPoints = qt.queryPoints(new Circ(points[i].x, points[i].y, points[i].data[2] + maxSize));
		
		for (let j = 0; j < nearPoints.length; j++) {
			
			if (new Circ(points[i].x, points[i].y, points[i].data[2] - 6).intersects(new Circ(nearPoints[j].x, nearPoints[j].y, nearPoints[j].data[2])) && points[i] != nearPoints[j]) {
				
				points[i].x -= points[i].data[0];
				points[i].y -= points[i].data[1];
				nearPoints[j].x -= nearPoints[j].data[0];
				nearPoints[j].y -= nearPoints[j].data[1];
				
			}
			 else if (new Circ(points[i].x, points[i].y, points[i].data[2]).intersects(new Circ(nearPoints[j].x, nearPoints[j].y, nearPoints[j].data[2])) && points[i] != nearPoints[j]) {
				
				bounceDots(qt.points[i], nearPoints[j]);
				points[i].x += points[i].data[0];
				points[i].y += points[i].data[1];
				nearPoints[j].x += nearPoints[j].data[0];
				nearPoints[j].y += nearPoints[j].data[1];
				
			}
			
		}
 		
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

function bounceDots(a, b) {
	
	/*
	STEP 1: Get vector that joins the two points and rotate velocity vectors to accomodate for that (so that vectorAB is aligned to X axis)
	
	STEP 2: Collide velocities in X axis.
	
	STEP 3: Rotate back.
	*/
	let v1 = createVector(a.data[0], a.data[1]);
	let v2 = createVector(b.data[0], b.data[1]);
	let joint = getVect(a, b);
	let angle = joint.heading();
	v1.rotate(-angle);
	v2.rotate(-angle);
	
	//TEMP X collision
	let tempX = v1.x;
	v1.set(v2.x, v1.y);
	v2.set(tempX, v2.y);
	
	v1.rotate(angle);
	v2.rotate(angle);
	
	a.data = [v1.x, v1.y, a.data[2]];
	b.data = [v2.x, v2.y, b.data[2]];
	
}

function getVect(a, b) {
	
	return createVector(b.x - a.x, b.y - a.y);
	
}