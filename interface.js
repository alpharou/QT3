function setup() {

	//General variables
	drawQuadrants = true;
	quadStroke = 1;
	minSize = 20; //radius, points in the grid
	maxSize = 50;
	qtMargin = 30;
	
	wW = max(windowWidth, 150);
	wH = max(windowHeight, 150);
	wS = min(wW, wH); //window Size
	mW = (wW - wS) /2 + qtMargin; //Width margin
	mH = (wH - wS) /2 + qtMargin; //Height margin
	
	gridWidth = 2048;
	gridHeight = 2048;
	
	qt = new QuadTree(0, 0, gridWidth, gridHeight, 3);
	
	//CursorZone
	zoney = new Circ(mapMouse()[0], mapMouse()[1], 150);
	deltaSize = 20; //Amount to resize the cursorZone
	nearQuads = [];
	nearPoints = [];

	createCanvas(windowWidth, windowHeight);

}

function draw() {
	
	zoney.x = mapMouse()[0];
	zoney.y = mapMouse()[1];

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
	nearQuads = qt.query(zoney);

		for (let q of nearQuads) {

			fill(0);
			mapped = mapRect(q.r);
			rect(mapped[0], mapped[1], mapped[2], mapped[3]);
			fill(253, 35, 76);
			rect(mapped[0] + quadStroke/2, mapped[1] + quadStroke/2, mapped[2] - quadStroke, mapped[3] - quadStroke);

		}

	//Draw cursorZone
	mapped = mapEllipse(zoney);
	noFill();
	stroke(255, 0, 255);
	strokeWeight(3);
	ellipse(mapped[0], mapped[1], mapped[2], mapped[3]);

	//Draw points
	fill(0);
	noStroke();
	let points = qt.getPoints();
	if (points.length > 0) {
		
		for (let i = 0; i < points.length; i++) {
			mapped = mapEllipse(new Circ(qt.points[i].x, qt.points[i].y, qt.points[i].data[2]));
			ellipse(mapped[0], mapped[1], mapped[2], mapped[3]);
		}
		
	}
	
	//Draw nearPoints
	nearPoints = qt.queryPoints(zoney);
	fill(255, 0, 255);
	strokeWeight(1);
	stroke(255, 0, 255);
	if (nearPoints.length > 0) {
		
		for (let p of nearPoints) {
			mapped = mapEllipse(new Circ(p.x, p.y, p.data[2]));
			ellipse(mapped[0], mapped[1], mapped[2], mapped[3]);
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
	
	wW = max(windowWidth, 150);
	wH = max(windowHeight, 150);
	wS = min(wW, wH); //window Size
	mW = (wW - wS) /2 + qtMargin; //Width margin
	mH = (wH - wS) /2 + qtMargin; //Height margin
	
	resizeCanvas(wW, wH);
	return;
	
}

function mapRect(r) {
	
	let x = map(r.x, 0, gridWidth, mW, wW - mW, true);
	let y = map(r.y, 0, gridHeight, mH, wH - mH, true);
	let w = map(r.w, 0, gridWidth, 0, wW - mW*2, true);
	let h = map(r.h, 0, gridHeight, 0, wH - mH*2, true);
	
	return [x, y, w, h];
	
}

function mapPnt(p) {
	
	let x = map(p.x, 0, gridWidth, mW, wW - mW, true);
	let y = map(p.y, 0, gridHeight, mH, wH - mH, true);
	
	return [x, y];
	
}

function mapEllipse(c) {
	
	let x = map(c.x, 0, gridWidth, mW, wW - mW);
	let y = map(c.y, 0, gridHeight, mH, wH - mH);
	let w = map(c.r*2, 0, gridWidth, 0, wW - mW*2, true);
	let h = map(c.r*2, 0, gridHeight, 0, wH - mH*2, true);
	
	return [x, y, w, h];
	
}

function mapMouse() {
	
	let x = map(mouseX, mW, wW - mW, 0, gridWidth);
	let y = map(mouseY, mH, wH - mH, 0, gridHeight);
	
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

function mouseWheel(event) {
	
  zoney.radius(max(0, zoney.radius() - (event.delta/abs(event.delta) * deltaSize)));
  return false;
  
}

function bounceDots(a, b) {
	
	let temp = a.data;
	a.data = b.data;
	b.data = temp;
	return true;
	
}