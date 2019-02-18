function setup() {

	//General variables
	drawQuadrants = true;
	quadStroke = 1;
	pointSize = 4;
	qtMargin = 50;
	
	gridWidth = 1024;
	gridHeight = 1024;
	
	qt = new QuadTree(0, 0, gridWidth, gridHeight, 1);

	createCanvas(windowWidth, windowHeight);

}

function draw() {

	background(170);
	
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

	//Draw points
	fill(0);
	let points = qt.getPoints();
	for (let p of points) {
		mapped = mapPnt(p);
		ellipse(mapped[0], mapped[1], pointSize);
	}
}

function mouseClicked() {

	let mapped = mapMouse();
	qt.ins(new Pnt(mapped[0], mapped[1], [random(-5,5), random(-5,5)]));

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

function moveDots() {
	
	//TODO
	
}

function deflectDots(a, b) {
	
	//TODO
	
}