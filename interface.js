function setup() {

	//General variables
	drawQuadrants = true;
	quadStroke = 1;
	pointSize = 4;
	
	gridWidth = 1024;
	gridHeight = 1024;
	
	qt = new QuadTree(20, 20, gridWidth - 40, gridHeight - 40, 1);

	createCanvas(windowWidth, windowHeight);

}

function draw() {

	background(0);
	
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
	qt.ins(new Pnt(mapped[0], mapped[1]));

}

function windowResized() {
	
	resizeCanvas(windowWidth, windowHeight);
	return;
	
}

function mapRect(r) {
	
	let x = map(r.x, 0, gridWidth, 0, windowWidth);
	let y = map(r.y, 0, gridHeight, 0, windowHeight);
	let w = map(r.w, 0, gridWidth, 0, windowWidth);
	let h = map(r.h, 0, gridHeight, 0, windowHeight);
	
	return [x, y, w, h];
	
}

function mapPnt(p) {
	
	let x = map(p.x, 0, gridWidth, 0, windowWidth);
	let y = map(p.y, 0, gridHeight, 0, windowHeight);
	
	return [x, y];
	
}

function mapMouse() {
	
	let x = map(mouseX, 0, windowWidth, 0, gridWidth);
	let y = map(mouseY, 0, windowHeight, 0, gridHeight);
	
	return [x, y];
	
}