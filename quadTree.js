class QuadTree {

	constructor(x, y, w, h, cap) {
		this.r = new Rect(x, y, w, h);
		this.points = [];
		this.root = new Quadrant(this.r.x, this.r.y, this.r.w, this.r.h, this);
		this.c = max(1, cap);
	}

	getC() {return this.c;}

	getPoints() {return this.points;}

	getLeaves() {
		return this.root.getLeaves();
	}

	clear() {
		this.points = [];
		this.root = new Quadrant(this.r.x, this.r.y, this.r.w, this.r.h, this);
		return true;
	}

	build() {
		let points = this.points;
		this.clear();

		for (let p of points) {
			this.ins(p);
		}

		return true;
	}

	ins(p) {

		//Insert the point if it's a Pnt and is contained in the QuadTree
		if (p instanceof Pnt && this.r.contains(p)) {

			for (let p2 of this.points) {
				if (p2.x == p.x && p2.y == p.y) {return false;}
			}

			//Add it to the log and the quadtree
			if (this.root.ins(p)) {this.points.push(p); return true;}
		}

		return false;
	}
	
	query(zone) {
		
		let nearLeaves = [];
		
		let leaves = this.getLeaves();
		
		if (!(zone instanceof Circ) && !(zone instanceof Rect)) {return "ERROR query(): Zone is not a valid shape";}

		
		for (let i = 0; i < leaves.length; i++) {
			
			if (zone.intersects(leaves[i].r)) {nearLeaves.push(leaves[i]);}
			
		}
		
		return nearLeaves;
		
	}
	
	queryPoints(zone) {
		
		let nearPoints = [];
		
		let leaves = this.getLeaves();
		
		if (!(zone instanceof Circ) && !(zone instanceof Rect)) {return "ERROR query(): Zone is not a valid shape";}

		for (let quad of leaves) {
			
			if (zone.intersects(quad.r)) {
				
				for (let dot of quad.points) {
					
					if (zone.intersects(new Circ(dot.x, dot.y, dot.data[2]))) {
						
						nearPoints.push(dot);
						
					}
					
				}
				
			}
			
		}
		
		return nearPoints;
		
	}

}

class Pnt {

	constructor(x, y, data = null) {
		this.x = x;
		this.y = y;
		this.data = data;
	}

}

class Quadrant {

	constructor(x, y, w, h, qt) {
		this.r = new Rect(x, y, w, h);
		this.qt = qt;
		this.points = [];
		this.divided = false;
	}

	ins(p) {
		if (!this.r.contains(p)) {return false;}
		if (this.divided) {
			//Insert the point into only one subquadrant
			if (this.ne.ins(p)) {return true;}
			if (this.nw.ins(p)) {return true;}
			if (this.sw.ins(p)) {return true;}
			if (this.se.ins(p)) {return true;}
			return false;
		} else if (qt.getC() > this.points.length) {
			this.points.push(p);
			return true;
		} else if (this.divide()){
			//Divide and push all points into the subQuadrants
			this.points.push(p);
			let points = this.points;
			this.points = [];

			for (let p of points) {
				//Insert the point only into the first Quadrant that accepts it
				if (this.ne.ins(p)) {continue;}
				if (this.nw.ins(p)) {continue;}
				if (this.sw.ins(p)) {continue;}
				if (this.se.ins(p)) {continue;}
				return false;
			}
			return true;
		} else {return false;}
	}

	divide() {
		//Create all the subdivision Quadrants
		this.ne = new Quadrant(this.r.x + this.r.w/2, this.r.y, this.r.w/2, this.r.h/2, this.qt);
		this.nw = new Quadrant(this.r.x, this.r.y, this.r.w/2, this.r.h/2, this.qt);
		this.sw = new Quadrant(this.r.x, this.r.y + this.r.h/2, this.r.w/2, this.r.h/2, this.qt);
		this.se = new Quadrant(this.r.x + this.r.w/2, this.r.y + this.r.h/2, this.r.w/2, this.r.h/2, this.qt);
		this.divided = true;
		return true;
	}

	getLeaves() {
		if (this.divided) {
			let leaves = [];
			Array.prototype.push.apply(leaves, this.ne.getLeaves());
			Array.prototype.push.apply(leaves, this.nw.getLeaves());
			Array.prototype.push.apply(leaves, this.sw.getLeaves());
			Array.prototype.push.apply(leaves, this.se.getLeaves());
			return leaves;
		}

		return [this];
	}
}

class Rect {

	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}

	contains(p) {

		if (p instanceof Pnt) {
			return !(this.x > p.x
				|| this.x + this.w < p.x
				|| this.y > p.y
				|| this.y + this.h < p.y
			);
		}

		return false;
	}

	intersects(r) {

		if (r instanceof Circ) {
			//Get the min distance between the circle's center and the rect edges
			let dX = r.x - max(this.x, min(r.x, this.x + this.w));
			let dY = r.y - max(this.y, min(r.y, this.y + this.h));
			//If the closest point of the Rect is inside the circle
			return (dX * dX + dY * dY) < (r.rr);
		}

		if (r instanceof Rect) {
			return !(this.x + this.w < r.x
				|| this.x > r.x + r.w
				|| this.y + this.h < r.y
				|| this.y > r.y + r.h
			);
		}

		//If the range is not a Rect or a Circ
		return false;
	}
}

class Circ {

	constructor(x, y, r) {
		this.x = x;
		this.y = y;
		this.r = r;
		this.r2 = r + r;
		this.rr = r * r;
	}
	
	radius(radius) {
		
		if (isNaN(radius)) {return this.r;}
		
		this.r = radius;
		this.r2 = radius + radius;
		this.rr = radius * radius;
		return this.r;
		
	}

	contains(p) {

		if (p instanceof Pnt) {
			let dX = this.x - p.x;
			let dY = this.y - p.y;
			return (this.rr) > (dX * dX + dY * dY);
		}

		return false;
	}

	intersects(r) {

		if (r instanceof Circ) {
			let dX = r.x - this.x;
			let dY = r.y - this.y;
			let dR = this.r + r.r;
			//If the distance between centers is less than the sum of the radius
			return (dR * dR) > (dX * dX) + (dY * dY);
		}

		if (r instanceof Rect) {
			//Get the min distance between the circle's center and the rect
			let dX = this.x - max(r.x, min(this.x, r.x + r.w));
			let dY = this.y - max(r.y, min(this.y, r.y + r.h));
			//If the closest point of the Rect is inside the circle
			return (dX * dX + dY * dY) < (this.rr);
		}

		//If the range is not a Rect or a Circ
		return false;
	}
}
