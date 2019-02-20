function setup() {

	//General variables
	drawQuadrants = true;
	quadStroke = 1;
	minSize = 5; //Of the RADIUS
	maxSize = 15;
	qtMargin = 50;
	
	gridWidth = 2048;
	gridHeight = 2048;
	
	qt = new QuadTree(0, 0, gridWidth, gridHeight, 5);

	createCanvas(windowWidth, windowHeight);

}

function draw() {

	background(30);
	
	//Draw QuadTree Boundary
	fill(0);
	noStroke();
	let mapped = mapRect(qt.r);
	rect(mapped[0] - quadStroke/2, mapped[1] - quadStroke/2, mapped[2] + quadStroke, mapped[3] + quadStroke);

	//Draw Quadrants
	fill(0);
	noStroke();

	if (drawQuadrants) {
		let quadrants = qt.getLeaves();

		for (let q of quadrants) {
			fill(0);
			mapped = mapRect(q.r);
			rect(mapped[0], mapped[1], mapped[2], mapped[3]);
			fill(255);
			rect(mapped[0] + quadStroke/2, mapped[1] + quadStroke/2, mapped[2] - quadStroke, mapped[3] - quadStroke);
		}
		
	}
	
	
	
	//TODO: TEMP DRAW NEARLEAVES
	let zoney = new Circ(mapMouse()[0], mapMouse()[1], 50);
	let quadrants = qt.query(zoney);

		for (let q of quadrants) {

				fill(0);
				mapped = mapRect(q.r);
				rect(mapped[0], mapped[1], mapped[2], mapped[3]);
				fill(253, 35, 76);
				rect(mapped[0] + quadStroke/2, mapped[1] + quadStroke/2, mapped[2] - quadStroke, mapped[3] - quadStroke);

		}
	fill(255, 0, 255);
	//TEMP, not scalable
	ellipse(mouseX, mouseY, zoney.r*2);




	//Draw points
	fill(0);
	let points = qt.getPoints();
	if (points.length > 0) {
		
		for (let i = 0; i < points.length; i++) {
			mapped = mapPnt(qt.points[i]);
			ellipse(mapped[0], mapped[1], qt.points[i].data[2]*2);
		}
		
	}
	
	
	//UPDATE
	moveDots(qt.points);
	qt.build();
	
}

function mouseClicked() {

	let mapped = mapMouse();
	qt.ins(new Pnt(mapped[0], mapped[1], [random(-5,5), random(-5,5), random(minSize,maxSize)]));

}

function windowResized() {
	
	resizeCanvas(windowWidth, windowHeight);
	return;
	
}

function mapRect(r) {
	
	let x = map(r.x, 0, gridWidth, qtMargin, windowWidth - qtMargin);
	let y = map(r.y, 0, gridHeight, qtMargin, windowHeight - qtMargin);
	let w = map(r.w, 0, gridWidth, 0, windowWidth - qtMargin*2);
	let h = map(r.h, 0, gridHeight, 0, windowHeight - qtMargin*2);
	
	return [x, y, w, h];
	
}

function mapPnt(p) {
	
	let x = map(p.x, 0, gridWidth, qtMargin, windowWidth - qtMargin);
	let y = map(p.y, 0, gridHeight, qtMargin, windowHeight - qtMargin);
	
	return [x, y];
	
}

function mapMouse() {
	
	let x = map(mouseX, qtMargin, windowWidth - qtMargin, 0, gridWidth);
	let y = map(mouseY, qtMargin, windowHeight - qtMargin, 0, gridHeight);
	
	return [x, y];
	
}

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

function bounceDots(a, b) {
	
	let temp = a.data;
	a.data = b.data;
	b.data = temp;
	return true;
	
}